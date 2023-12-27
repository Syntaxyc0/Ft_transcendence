import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { Player } from './models/player.model'; 
import { Room} from './models/room.model';
import { MultiplayerService } from './services/multiplayer.service';
import { connected } from 'process';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
  }
})
export class GameGateway implements OnModuleInit{
  @WebSocketServer()
  server: Server;


  private connectedPlayers: Map<string, Player> = new Map()
  private rooms: Room[] = []

  onModuleInit(){
    console.log("Server up")
    this.server.on('connection', (socket) => {

      console.log(socket.id + ' has connected');
      this.connectedPlayers.set(socket.id, new Player(socket))

      socket.on('disconnect', () => {
        console.log(socket.id + " has disconnected");

        this.disconnectRoom(socket.id);
        this.connectedPlayers.delete(socket.id)

      });
    });
  }

  getRoom(clientId: string) : Room{
    if (!this.connectedPlayers.get(clientId))
      return undefined;
    const targetRoom = this.connectedPlayers.get(clientId).room;
    return targetRoom;
  }

  disconnectRoom(clientId: string){
    if (!this.connectedPlayers.get(clientId))
      return;
    const targetRoom = this.connectedPlayers.get(clientId).room;
    if (targetRoom)
    {
      console.log("Destroying Room " + targetRoom.id)
      targetRoom.destroyRoom()
      this.rooms.splice(targetRoom.id, 1);
    }
  }

  disconnectClient(clientId: string) {
    this.disconnectRoom(clientId)
}

  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket)
  {
    this.connectedPlayers.get(client.id).lookingForPlayer = false
    this.disconnectRoom(client.id)
  }

  @SubscribeMessage('newPaddlePosition')
  setPaddle(@ConnectedSocket() client: Socket, @MessageBody() paddle: {x: number, y: number, side: number})
  {
    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    
    targetRoom.paddles[paddle.side].y = paddle.y
    if (paddle.side == 1)
    {
      targetRoom.players[0].socket.emit("onGameRequest", {order: "paddlePosition", side: paddle.side, x: paddle.x, y: paddle.y})
    }
    else
      targetRoom.players[1].socket.emit("onGameRequest", {order: "paddlePosition", side: paddle.side, x: paddle.x, y: paddle.y})
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    if (this.connectedPlayers.get(client.id).room)
      return;
    // console.log(client.data.login + " is looking for another player.")
    for (const [socketId, player] of this.connectedPlayers) {
      if (player.socket.id != client.id && player.lookingForPlayer)
      {
        this.rooms.push(new Room(this.rooms.length ,this.connectedPlayers.get(client.id), player))
        return;
      }
    }
    this.connectedPlayers.get(client.id).lookingForPlayer = true
  }
}


 // targetSocket.emit('onGameRequest', {
    //   order: "scoreUp",
    //   leftScore: body.leftScore,
    //   rightScore: body.rightScore
    // });