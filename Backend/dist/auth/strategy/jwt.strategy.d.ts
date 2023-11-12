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
        FriendRequestsEmitted: number[];
        FriendRequestsReceived: number[];
    }>;
}
export {};
