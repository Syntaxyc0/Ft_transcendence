/// <reference types="multer" />
import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserFromId(id: number): Promise<{
        id: number;
        email: string;
        login: string;
        hash: string;
        avatar: string;
        elo: number;
        userStatus: string;
        gameHistory: number[];
        friendList: number[];
    }>;
    getUserFromLogin(login: string): Promise<{
        id: number;
        email: string;
        login: string;
        hash: string;
        avatar: string;
        elo: number;
        userStatus: string;
        gameHistory: number[];
        friendList: number[];
    }>;
    updateUserStatus(id: number, status: any): Promise<void>;
    GetUserStatus(id: number): Promise<string>;
    GetUserFriendlist(uid: number): Promise<number[]>;
    AddFriend(uid: number, userName: string): Promise<void>;
    RemoveFriend(uid: number, userId: number): Promise<void>;
    uploadFile(uid: number, file: Express.Multer.File): Promise<void>;
    getelo(uid: number): Promise<number>;
    updateUserElo(uid: number, elo: number): Promise<void>;
    getlogin(uid: number): Promise<string>;
}
