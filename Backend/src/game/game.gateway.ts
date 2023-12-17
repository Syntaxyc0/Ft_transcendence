import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { Player } from './models/player.model'; 
import { Room} from './models/room.model';
import { MultiplayerService } from './services/multiplayer.service';

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

  // @SubscribeMessage("socketInit")
  // initPlayer(@ConnectedSocket() client: Socket)
  // {
  //   this.connectedPlayers.set(client.id, new Player(client, client.data.user.login))
  //   client.emit("onGameRequest",{order: "initPlayer", username: client.data.user.login})
  // }

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
    this.disconnectRoom(client.id)
  }

  @SubscribeMessage('gameRequest')
  gameRequest(@MessageBody() body: {order: string}, @ConnectedSocket() client: Socket)
  {

  }  

  @SubscribeMessage('newScore')
  newScore(@MessageBody() body: {leftScore: number, rightScore: number}, @ConnectedSocket() client:Socket)
  {
   
  }

  @SubscribeMessage('newPaddlePos')
  newPaddlePos(@MessageBody() body: {x: number, y: number}, @ConnectedSocket() client: Socket)
  {
   
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    console.log(client.data.login + " is looking for another player.")
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