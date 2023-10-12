import { PrismaService } from "src/prisma/prisma.service";
import { signinDto, signupDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private readonly httpService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, httpService: HttpService);
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
    create42user(login: string, email: string): Promise<{
        access_token: string;
        id: number;
    }>;
    generateRandomPassword(): string;
    check_token(token: any): boolean;
}
