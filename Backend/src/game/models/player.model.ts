import { Socket } from "socket.io";
import { Room } from "./room.model";
import { Paddle } from "./game-elements.model";

export class Player{
    socket: Socket;
    // username: string;
    score: number;
    room: Room;

    lookingForPlayer = false;

    constructor(socket: Socket){
        
        this.socket = socket;
        // this.username = username
        this.score = 0;
        console.log(socket.id + " player created.")
    }
}