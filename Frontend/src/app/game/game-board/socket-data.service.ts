import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Ball } from '../models/ball.model';
import { Paddle } from '../models/paddle.model';

@Injectable({
  providedIn: 'root'
})
export class SocketDataService {
  private socket: Socket;
  private baseUrl = 'http://localhost:3333';
  private isOnline: boolean;

  getData(): Observable<any[]> {
    this.socket = io(this.baseUrl);
    const data = new Subject<any>();
    const dataObservable = from(data);

    this.socket.on('connect', () => {
      // console.log("Current Client: " + this.socket.id);
    });
    this.socket.on('onGameRequest', (payload: {order: string}) =>{
      data.next(payload);
    });
    this.socket.on('newPlayer', (payload: {order: string}) =>{
      this.isOnline = true;
      data.next(payload);
    });
    this.socket.on('otherDisconnected', (payload:{order: string})=> {
      this.isOnline = false;
      console.log(payload.order);
      data.next(payload);
    });
    return dataObservable;
  }

  disconnect()
  {
    if (this.isOnline)
      this.socket.emit('disconnectingClient');
    this.isOnline = false;
  }

  GameRequest(order: string){
    if (this.isOnline)
      this.socket.emit('gameRequest', {order});
  }

  multiplayerRequest(){
    if (!this.isOnline)
      this.socket.emit('multiplayerRequest');
  }

  newPaddlePos(x: number, y: number)
  {
    if (this.isOnline)
      this.socket.emit('newPaddlePos', {x, y});
  }

  newBallPos(angle: number, x: number, y: number)
  {
    if (this.isOnline)
      this.socket.emit('newBallPos', {angle, x, y});
  }
}