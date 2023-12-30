import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";
import { HttpService } from "@nestjs/axios";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private authService;
    private http;
    private prismaService;
    private mailService;
    constructor(authService: AuthService, http: HttpService, prismaService: PrismaService, mailService: MailService);
    token: string;
    signup(dto: signupDto): Promise<{
        access_token: string;
        id: number;
    }>;
    signin(dto: signinDto): Promise<{
        access_token: string;
        id: number;
    }>;
    check_token(body: any): Promise<boolean>;
    get42redirect(request: any, res: any): Promise<void>;
    SendMail(uid: number): Promise<void>;
    check2fa(uid: number): Promise<boolean>;
    geturl(): {
        url: string;
    };
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
        creatorId: number;
        public: boolean;
        password: string;
    })[]>;
    getUsers(): Promise<{
        id: number;
        email: string;
        login: string;
        login42: string;
        hash: string;
        access_token: string;
        is2faenabled: boolean;
        is2favalidated: boolean;
        twofacode: string;
        avatar: string;
        elo: number;
        userStatus: string;
        gameHistory: number[];
        friendList: number[];
        FriendRequestsEmitted: number[];
        FriendRequestsReceived: number[];
    }[]>;
    getConnectedUsers(): Promise<{
        id: number;
        socketId: string;
        userId: number;
    }[]>;
    getJoinedRoom(): Promise<{
        id: number;
        socketId: string;
        userId: number;
        roomId: number;
    }[]>;
}
