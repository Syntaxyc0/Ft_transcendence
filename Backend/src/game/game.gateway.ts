import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { Player } from './services/room.service'; 
import { Room} from './services/room.service';
import { User } from '@prisma/client';

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

      socket.on('disconnect', () => {
        console.log(socket.id + " has disconnected");

        this.disconnectClient(socket.id);

        this.connectedPlayers.delete(socket.id)
        if (targetSocket)
          targetSocket.emit('otherDisconnected', {order: 'otherDisconnected'})
      });
    });
  }

  @SubscribeMessage("socketInit")
  initPlayer(@ConnectedSocket() client: Socket)
  {
    this.connectedPlayers.set(client.id, new Player(client, client.data.user.login))
    client.emit("onGameRequest",{order: "initPlayer", username: client.data.user.login})
  }

  disconnectClient(clientId: string) {

}

  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    this.disconnectClient(client.id);
    if (targetSocket)
      targetSocket.emit('otherDisconnected', {order: 'otherDisconnected'});
  }

  @SubscribeMessage('gameRequest')
  gameRequest(@MessageBody() body: {order: string}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
        order: body.order
    });
  }  

  @SubscribeMessage('newScore')
  newScore(@MessageBody() body: {leftScore: number, rightScore: number}, @ConnectedSocket() client:Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
      order: "scoreUp",
      leftScore: body.leftScore,
      rightScore: body.rightScore
    });
  }

  @SubscribeMessage('newPaddlePos')
  newPaddlePos(@MessageBody() body: {x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
      order:"paddleUp",
      x: body.x,
      y: body.y
    });
  }

  @SubscribeMessage('newBallPos')
  newBallPos(@MessageBody() body: {angle: number, x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
      order:"ballUp",
      angle: body.angle,
      x: body.x,
      y: body.y
    });
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    console.log("looking for player: " + this.connectedPlayers.get(client.id).username);
    for (const [socketId, player] of this.connectedPlayers) {
      if (player.socket.id != client.id)
      {
        console.log("Player found: " + player.socket.id);
        client.emit('newPlayer', {
          order: "newPlayer",
          first: true,
        });
        player.socket.emit('newPlayer', {
          order: "newPlayer",
          first: false,
        });

        this.rooms.push(new Room(this.connectedPlayers.get(client.id), player))
        return;
      }
    }
    // this.lookingForPlayerSockets.set(client.id, client);
    this.connectedPlayers.get(client.id).lookingForPlayer = true
  }
}
