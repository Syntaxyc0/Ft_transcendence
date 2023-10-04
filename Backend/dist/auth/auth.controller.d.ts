import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
export declare class AuthController {
    private authService;
    private http;
    constructor(authService: AuthService, http: HttpService);
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
}
