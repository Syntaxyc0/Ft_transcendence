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
  private secondPlayer: string;

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
    this.socket.on('newPlayer', (payload:{order: string, player: string}) =>{
      this.secondPlayer = payload.player;
      data.next(payload);
    });
    this.socket.on('otherDisconnected', (payload:{order: string})=> {
      console.log(payload.order);
      this.secondPlayer = '';
      data.next(payload);
    });
    return dataObservable;
  }

  disconnect()
  {
    console.log(this.secondPlayer);
    if (this.secondPlayer)
      this.socket.emit('disconnectingClient', {secondPlayer: this.secondPlayer});
      this.secondPlayer = '';
  }

  GameRequest(order: string){
    if (this.secondPlayer)
      this.socket.emit('gameRequest', {order, secondPlayer: this.secondPlayer});
  }

  multiplayerRequest(){
    if (!this.secondPlayer)
      this.socket.emit('multiplayerRequest');
  }

  newPaddlePos(x: number, y: number)
  {
    if (this.secondPlayer)
      this.socket.emit('newPaddlePos', {secondPlayer: this.secondPlayer, x, y});
  }

  newBallPos(angle: number, x: number, y: number)
  {
    if (this.secondPlayer)
      this.socket.emit('newBallPos', {secondPlayer: this.secondPlayer, angle, x, y});
  }
}