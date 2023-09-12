import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(login: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        hash: string;
    }, null, import(".prisma/client/runtime/library").DefaultArgs>;
}
