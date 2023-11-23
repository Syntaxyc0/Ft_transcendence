import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from } from 'rxjs';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Ball } from '../models/ball.model';
import { Paddle } from '../models/paddle.model';


@Injectable({
  providedIn: 'root'
})
export class SocketDataService implements OnDestroy{
  private socket: Socket;
  private baseUrl = 'http://localhost:3333';
  private isOnline: boolean = false;

  getData(): Observable<any[]> {
    this.socket = io(this.baseUrl);
    const data = new Subject<any>();
    const dataObservable = from(data);

    this.socket.on('connect', () => {
      // //console.log("Current Client: " + this.socket.id);
      //console.log("Connected " + this.isOnline);
    });
    this.socket.on('onGameRequest', (payload: {order: string}) =>{
      data.next(payload);
    });
    this.socket.on('newPlayer', (payload: {order: string}) =>{
      //console.log("newPlayer " + this.isOnline);
      this.isOnline = true;
      data.next(payload);
    });
    this.socket.on('otherDisconnected', (payload:{order: string})=> {
    //console.log("otherDisconnected " + this.isOnline)
      this.isOnline = false;
      data.next(payload);
    });
    return dataObservable;
  }

  ngOnDestroy()
  {

  }

  disconnect()
  {
    //console.log("disconnect " + this.isOnline)
    this.socket.emit('disconnectingClient');
    this.isOnline = false;
  }

  gameRequest(order: string){
    if (this.isOnline)
      this.socket.emit('gameRequest', {order});
  }

  multiplayerRequest(){
    //console.log("multiplayerRequest " + this.isOnline)
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

  newScore(leftScore: number, rightScore:number)
  {
    if (this.isOnline)
      this.socket.emit('newScore', {leftScore, rightScore});
  }
}