/// <reference types="multer" />
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
    updateUserStatus(id: number, status: any): Promise<void>;
    GetUserStatus(id: number): Promise<string>;
    GetUserFriendlist(uid: number): Promise<number[]>;
    AddFriend(uid: number, userName: string): Promise<void>;
    uploadFile(uid: number, file: Express.Multer.File): Promise<void>;
}
