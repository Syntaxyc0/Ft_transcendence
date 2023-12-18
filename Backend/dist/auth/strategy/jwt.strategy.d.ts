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
        login42: string;
        hash: string;
        access_token: string;
        is2faenabled: boolean;
        is2favalidated: boolean;
        twofacode: string;
        avatar: string;
        elo: number;
        userStatus: string;
        gameHistory: number[];
        gamesWon: number;
        friendList: number[];
        FriendRequestsEmitted: number[];
        FriendRequestsReceived: number[];
        api_used: number;
        twofa_used: number;
        quit_count: number;
        friends_added: number;
        friends_removed: number;
        name_changed: number;
        picture_changed: number;
        profiles_searched: number;
        cancelled_count: number;
        refused_count: number;
    }>;
}
export {};
