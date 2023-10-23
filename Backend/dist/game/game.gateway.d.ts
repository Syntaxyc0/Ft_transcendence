import { OnModuleInit } from '@nestjs/common';
import { Server } from "socket.io";
export declare class GameGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handleMessage(body: any): void;
}
