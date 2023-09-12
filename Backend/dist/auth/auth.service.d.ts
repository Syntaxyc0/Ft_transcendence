import { PrismaService } from "src/prisma/prisma.service";
import { signinDto, signupDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signin(dto: signinDto): Promise<{
        access_token: string;
        id: number;
    }>;
    signup(dto: signupDto): Promise<{
        access_token: string;
        id: number;
    }>;
    signToken(userId: number, login: string): Promise<{
        access_token: string;
        id: number;
    }>;
}
