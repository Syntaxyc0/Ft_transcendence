import { Injectable } from "@angular/core";
import { io, Socket} from "socket.io-client";
import { OnInit } from "@angular/core";

@Injectable()
export class SocketClient implements OnInit{
    public socketClient: Socket;
    constructor() {
        this.socketClient = io('http://localhost:3333');
    }

    ngOnInit() {
        this.registerConsumerEvents();
    }

    private registerConsumerEvents(){
        // this.socketClient.emit('newMessage', {msg : "hello!"});
        this.socketClient.on('connect', () => {
            console.log('Connected to Gateway');
        });
        this.socketClient.on('onMessage', (payload: any) => {
            console.log("Socket:");
            console.log(payload);
        })
    }
}