import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Ball } from '../models/ball.model';
import { Paddle } from '../models/paddle.model';
import { CustomSocket } from 'src/app/chat/sockets/custom-socket';
import { strings } from '@material/form-field';


@Injectable({
  providedIn: 'root'
})
export class SocketDataService{

	constructor(private socket: CustomSocket) {}

  // private baseUrl = 'http://localhost:3333';

  private login!: string;

getData(): Observable<any[]> {
    const data = new Subject<any>();
    const dataObservable = from(data);

    this.sendRequest("loginRequest")

    this.socket.on('connect', () => {
      console.log("Connected");
    });
    this.socket.on('login', (login: string) => {
      this.login = login
    });
   
    this.socket.on('onGameRequest', (payload: {order: string}) =>{
      data.next(payload);
    });
    return dataObservable;
  }

  getLogin(): string
  {
    return this.login;
  }

  disconnect()
  {
    this.socket.emit("disconnectingClient")
  }

  sendRequest(order: string)
  {
    this.socket.emit(order);
  }

  newPaddlePosition(paddle: {y: number, side: number})
  {
    this.socket.emit("newPaddlePosition", paddle)
  }


}