import { User } from '@prisma/client';
export declare class UserController {
    getMe(user: User): {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        mail: string;
        hash: string;
    };
}
