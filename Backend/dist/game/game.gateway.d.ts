import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from "socket.io";
export declare class GameGateway implements OnModuleInit {
    server: Server;
    private connectedSockets;
    private lookingForPlayerSockets;
    private pairedSockets;
    onModuleInit(): void;
    getTarget(client: Socket, id: string): Socket;
    warnOther(body: {
        secondPlayer: string;
    }, client: Socket): void;
    GameRequest(body: {
        order: string;
        secondPlayer: string;
    }, client: Socket): void;
    newPaddlePos(body: {
        secondPlayer: string;
        x: number;
        y: number;
    }, client: Socket): void;
    newBallPos(body: {
        secondPlayer: string;
        angle: number;
        x: number;
        y: number;
    }, client: Socket): void;
    searchMultiplayer(client: Socket): void;
}
