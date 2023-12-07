import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
export declare class CreatePlayerDto {
    user: string;
    score: number;
    socket: Socket;
    prismaClient: PrismaClient;
    constructor(user: string, score: number, socket: Socket, prismaClient: PrismaClient);
}
export declare class GameInfoDto {
    userId1: number;
    userId2: number;
    scoreUser1: number;
    scoreUser2: number;
    winnerId: number;
}
