import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Ball } from '../models/ball.model';
import { Paddle } from '../models/paddle.model';
import { CustomSocket } from 'src/app/chat/sockets/custom-socket';


@Injectable({
  providedIn: 'root'
})
export class SocketDataService{

	constructor(private socket: CustomSocket) {}

  private baseUrl = 'http://localhost:3333';
  private isOnline: boolean = false;

  getData(): Observable<any[]> {
    const data = new Subject<any>();
    const dataObservable = from(data);

    this.socket.on('connect', () => {
      console.log("Connected");
    });
    this.socket.on('onGameRequest', (payload: {order: string}) =>{
      // console.log(payload)
      data.next(payload);
    });
    return dataObservable;
  }

  sendRequest(order: string)
  {
    this.socket.emit(order)
  }
}