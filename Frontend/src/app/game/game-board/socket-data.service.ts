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
    return dataObservable;
  }

  disconnect(secondPlayer: string)
  {
    this.socket.emit('disconnectingClient', {secondPlayer});
  }

  getSocket(): Socket{
    return(this.socket);
  }

  GameRequest(order: string, secondPlayer: string){
    this.socket.emit('gameRequest', {order, secondPlayer});
  }

  multiplayerRequest(){
      this.socket.emit('multiplayerRequest');
  }

  newPaddlePos(secondPlayer: string, x: number, y: number)
  {
    this.socket.emit('newPaddlePos', {secondPlayer, x, y});
  }

  newBallPos(secondPlayer: string, angle: number, x: number, y: number)
  {
    this.socket.emit('newBallPos', {secondPlayer, angle, x, y});
  }
}