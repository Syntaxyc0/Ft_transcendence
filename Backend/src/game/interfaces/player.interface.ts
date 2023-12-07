import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";

export interface Player {
    user: string;
    score: number;
    socket: Socket;
    prismaClient: PrismaClient;
}

