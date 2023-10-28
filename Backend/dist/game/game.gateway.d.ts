import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from "socket.io";
export declare class GameGateway implements OnModuleInit {
    server: Server;
    private connectedSockets;
    onModuleInit(): void;
    GameRequest(body: {
        order: string;
        secondPlayer: string;
    }): void;
    handleMessage(body: any, client: Socket): void;
    newBallPos(body: {
        secondPlayer: string;
        angle: number;
        x: number;
        y: number;
    }): void;
    searchMultiplayer(client: Socket): void;
}
