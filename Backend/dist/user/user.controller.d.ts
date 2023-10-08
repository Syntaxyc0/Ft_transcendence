/// <reference types="multer" />
import { Response } from 'express';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserFromId(uid: number): Promise<{
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
    updateUserStatus(uid: number, status: string): Promise<void>;
    GetUserStatus(uid: number): Promise<string>;
    GetUserFriendlist(uid: number): Promise<number[]>;
    getUserLogin(uid: number): Promise<string>;
    getUserElo(uid: number): Promise<number>;
    updateUserElo(uid: number, elo: number): Promise<void>;
    AddFriend(uid: number, userName: any): Promise<void>;
    RemoveFriend(uid: number, userName: any): Promise<void>;
    uploadFile(uid: number, file: Express.Multer.File): Promise<void>;
    getAvatar(uid: number, res: Response): Promise<void>;
}
export declare const imageFileFilter: (req: any, file: any, callback: any) => any;
