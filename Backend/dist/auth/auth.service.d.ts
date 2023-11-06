import { PrismaService } from "src/prisma/prisma.service";
import { signinDto, signupDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { MailService } from "src/mail/mail.service";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private readonly httpService;
    private mailService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, httpService: HttpService, mailService: MailService);
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
    SendMail(uid: number): Promise<void>;
    check2fa(uid: number): Promise<boolean>;
    generateRandom6digitCode(): string;
}
