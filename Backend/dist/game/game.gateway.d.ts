import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from "socket.io";
export declare class GameGateway implements OnModuleInit {
    server: Server;
    private connectedSockets;
    private lookingForPlayerSockets;
    private pairedSockets;
    onModuleInit(): void;
    warnOther(client: Socket): void;
    GameRequest(body: {
        order: string;
    }, client: Socket): void;
    getOther(client: Socket): Socket;
    newPaddlePos(body: {
        x: number;
        y: number;
    }, client: Socket): void;
    newBallPos(body: {
        angle: number;
        x: number;
        y: number;
    }, client: Socket): void;
    searchMultiplayer(client: Socket): void;
}
