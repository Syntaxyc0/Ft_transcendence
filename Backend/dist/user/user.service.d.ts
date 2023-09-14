import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserFromId(id: number): Promise<{
        id: number;
        login: string;
        hash: string;
        avatar: string;
        userStatus: string;
        friendList: number[];
    }>;
    getUserFromLogin(login: string): Promise<{
        id: number;
        login: string;
        hash: string;
        avatar: string;
        userStatus: string;
        friendList: number[];
    }>;
    updateUserStatus(id: number, status: string): Promise<void>;
    GetUserStatus(id: number): Promise<string>;
}
