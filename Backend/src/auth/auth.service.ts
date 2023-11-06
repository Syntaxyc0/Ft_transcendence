import { ForbiddenException, Injectable, Req, Res } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { signinDto, signupDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Response, Request } from "express";


@Injectable()
export class AuthService
{
    constructor(private prisma: PrismaService, private jwt:JwtService, private config: ConfigService, private readonly httpService: HttpService,)
    {}
    async signin(dto: signinDto)
    {
        const user = await this.prisma.user.findUnique({
            where: {
                login : dto.login,
            },
        });
        if (!user)
            throw new ForbiddenException("credentials incorrect");
        
        const pwMatches = await argon.verify(user.hash, dto.password);
        if (!pwMatches)
            throw new ForbiddenException("credentials incorrect");
        return this.signToken(user.id, user.login);

    }

    async signup(dto: signupDto)
    {
        const hash = await argon.hash(dto.password);
        try
        {
            const user = await this.prisma.user.create({
                data: {
					email: dto.email,
                    login: dto.login,
                    hash,
                },
                select: {
                    id: true,
                    login: true,
                }
            })
            return this.signToken(user.id, user.login);
        }
        catch(error)
        {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
            {
                if (error.code === "P2002")
                	throw new ForbiddenException("Credentials taken")
            }
            throw error 
          }	
    }
    async signToken(userId: number, login: string): Promise<{access_token: string, id: number}>
    {
        const payload = {
            sub: userId,
            login,
        };
        const secret = this.config.get("JWT_SECRET");
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '180m',
            secret: secret
        },);
        return { access_token: token, id: userId };
    }

    async create42user(login: string, email: string) {
    try {
        const pass = this.generateRandomPassword()
        const hash = await argon.hash(pass);
        const alreadyregistered = await this.prisma.user.findUnique({
            where: {
                login : login,
            },
        });
        if (alreadyregistered)
            return this.signToken(alreadyregistered.id, alreadyregistered.login)
        const user = await this.prisma.user.create({
            data: {
                email: email,
                login: login,
                avatar: "",
                hash,
            },
            select: {
                id: true,
                login: true,
            }
        })
        return this.signToken(user.id, user.login);
    }
    catch(error)
    {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
        {
            if (error.code === "P2002")
                throw new ForbiddenException("Credentials taken")
        }
        throw error 
      }	
    }

	generateRandomPassword ()
	{
		const password = Math.random().toString(36);
		return password;
	}

	check_token(token): boolean {
		if (!token)
			return false;
		try {
		  const payload = this.jwt.verify(token.token, {secret: process.env.JWT_SECRET});
		  if (!payload)
		  	return false;
		} catch (e) {
			console.log(e)
			return false
		}
		return true;
	  }

	  verifyJwt(jwt: string): Promise<any> {
		return this.jwt.verifyAsync(jwt);
	}
}