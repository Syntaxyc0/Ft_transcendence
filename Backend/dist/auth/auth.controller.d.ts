import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { Response } from "express";
export declare class AuthController {
    private authService;
    private http;
    constructor(authService: AuthService, http: HttpService);
    signup(dto: signupDto): Promise<{
        access_token: string;
        id: number;
    }>;
    signin(dto: signinDto): Promise<{
        access_token: string;
        id: number;
    }>;
    get42auth(res: Response): void;
    get42redirect(res: Response): void;
}
