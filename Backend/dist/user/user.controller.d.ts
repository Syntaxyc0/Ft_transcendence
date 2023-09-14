import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserFromId(uid: number): Promise<{
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
    updateUserStatus(uid: number, status: string): Promise<void>;
    GetUserStatus(uid: number): Promise<string>;
}
