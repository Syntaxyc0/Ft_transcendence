import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserFromId(id: number): Promise<{
        id: number;
        login: string;
        hash: string;
        avatar: string;
        userStatus: import(".prisma/client").$Enums.Status;
        friendList: number[];
    }>;
}
