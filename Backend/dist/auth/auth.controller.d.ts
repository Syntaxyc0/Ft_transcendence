import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private authService;
    private http;
    private prismaService;
    constructor(authService: AuthService, http: HttpService, prismaService: PrismaService);
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
    getRooms(): Promise<({
        message: {
            id: number;
            text: string;
            userId: number;
            roomId: number;
            created_at: Date;
            updated_at: Date;
        }[];
    } & {
        id: number;
        name: string;
        description: string;
        created_at: Date;
        updated_at: Date;
    })[]>;
    getUsers(): Promise<{
        id: number;
        email: string;
        login: string;
        hash: string;
        is2faenabled: boolean;
        is2favalidated: boolean;
        twofacode: string;
        avatar: string;
        elo: number;
        userStatus: string;
        gameHistory: number[];
        friendList: number[];
    }[]>;
    getConnectedUsers(): Promise<{
        id: number;
        socketId: string;
        userId: number;
    }[]>;
}
