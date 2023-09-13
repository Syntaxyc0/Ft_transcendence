import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: number;
        mail: string;
    }): Promise<{
        id: number;
        login: string;
        hash: string;
        avatar: string;
        userStatus: import(".prisma/client").$Enums.Status;
        friendList: number[];
    }>;
}
export {};
