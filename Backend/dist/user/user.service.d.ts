/// <reference types="multer" />
import { PrismaService } from "src/prisma/prisma.service";
import { UserI } from "src/chat/model/user.interface";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserFromId(id: number): Promise<{
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
    }>;
    getUserFromLogin(login: string): Promise<{
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
    }>;
    updateUserStatus(id: number, status: any): Promise<void>;
    GetUserStatus(id: number): Promise<string>;
    GetUserFriendlist(uid: number): Promise<number[]>;
    AddFriend(uid: number, userName: string): Promise<void>;
    RemoveFriend(uid: number, userId: number): Promise<void>;
    uploadFile(uid: number, file: Express.Multer.File): Promise<void>;
    validate_extension(ext: string): boolean;
    getelo(uid: number): Promise<number>;
    updateUserElo(uid: number, elo: number): Promise<void>;
    getlogin(uid: number): Promise<string>;
    get2faenabled(uid: number): Promise<boolean>;
    get2favalidated(uid: number): Promise<boolean>;
    validate2FA(uid: number): Promise<void>;
    switch2fa(uid: any, activate: any): Promise<void>;
    findAllByLogin(login: string): Promise<UserI[]>;
    allUser(): Promise<UserI[]>;
}