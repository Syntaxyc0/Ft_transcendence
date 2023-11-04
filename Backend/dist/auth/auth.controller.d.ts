import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { MailService } from "src/mail/mail.service";
export declare class AuthController {
    private authService;
    private http;
    private mailService;
    constructor(authService: AuthService, http: HttpService, mailService: MailService);
    token: string;
    signup(dto: signupDto): Promise<{
        access_token: string;
        id: number;
    }>;
    signin(dto: signinDto): Promise<{
        access_token: string;
        id: number;
    }>;
    check_token(token: string): boolean;
    get42redirect(request: any, res: any): Promise<void>;
    SendMail(uid: number): Promise<void>;
    check2fa(uid: number): Promise<boolean>;
}
