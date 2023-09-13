import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUserFromId(uid: number): Promise<{
        id: number;
        login: string;
        hash: string;
        avatar: string;
        userStatus: import(".prisma/client").$Enums.Status;
        friendList: number[];
    }>;
}
