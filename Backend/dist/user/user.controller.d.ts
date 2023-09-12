import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(login: any): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        hash: string;
    }, null, import(".prisma/client/runtime/library").DefaultArgs>;
}
