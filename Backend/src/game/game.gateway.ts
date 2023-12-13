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
        this.disconnectClient(socket.id);
      });
    });
  }

  // @SubscribeMessage("socketInit")
  // initPlayer(@ConnectedSocket() client: Socket)
  // {
  //   this.connectedPlayers.set(client.id, new Player(client, client.data.user.login))
  //   client.emit("onGameRequest",{order: "initPlayer", username: client.data.user.login})
  // }

  disconnectClient(clientId: string) {
    this.rooms.splice(this.connectedPlayers.get(clientId).room.roomId, 1);
    this.connectedPlayers.delete(clientId)
}

  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket)
  {
    
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

  @SubscribeMessage('newBallPos')
  newBallPos(@MessageBody() body: {angle: number, x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    for (const [socketId, player] of this.connectedPlayers) {
      if (player.socket.id != client.id)
      {
        client.emit('newPlayer', {
          order: "newPlayer",
          first: true,
        });
        player.socket.emit('newPlayer', {
          order: "newPlayer",
          first: false,
        });

        this.rooms.push(new Room(this.rooms.length ,this.connectedPlayers.get(client.id), player))
        return;
      }
    }
    // this.lookingForPlayerSockets.set(client.id, client);
    this.connectedPlayers.get(client.id).lookingForPlayer = true
  }
}


 // targetSocket.emit('onGameRequest', {
    //   order: "scoreUp",
    //   leftScore: body.leftScore,
    //   rightScore: body.rightScore
    // });