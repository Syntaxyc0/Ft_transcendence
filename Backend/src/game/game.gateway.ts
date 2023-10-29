import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
  }
})
export class GameGateway implements OnModuleInit{
  @WebSocketServer()
  server: Server;

  private connectedSockets: Map<string, Socket> = new Map();
  private lookingForPlayerSockets: Map<string, Socket> = new Map();

  onModuleInit(){
    this.server.on('connection', (socket) => {
      
      this.connectedSockets.set(socket.id, socket);
      console.log(socket.id + ' has connected');

      socket.on('disconnect', () => {
        this.connectedSockets.delete(socket.id);
        this.lookingForPlayerSockets.delete(socket.id);
        console.log(socket.id + " has disconnected");
      });
    });

    
  }

  getTarget(client: Socket, id: string): Socket
  {
    const targetSocket = this.connectedSockets.get(id);
    if (!targetSocket)
      client.emit('otherDisconnected', {order: 'otherDisconnected'});
    return (targetSocket);
  }

  @SubscribeMessage('disconnectingClient')
  warnOther(@MessageBody() body:{secondPlayer: string}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(body.secondPlayer);
    if (targetSocket)
    {
      targetSocket.emit('otherDisconnected', {order: 'otherDisconnected'});
      this.lookingForPlayerSockets.set(targetSocket.id, targetSocket);
    }
    this.lookingForPlayerSockets.delete(client.id);
  }

  @SubscribeMessage('GameRequest')
  GameRequest(@MessageBody() body: {order: string, secondPlayer: string}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.getTarget(client, body.secondPlayer);
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
        order: body.order
    });
  }

  @SubscribeMessage('newBallPos')
  newBallPos(@MessageBody() body: {secondPlayer: string, angle: number, x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.getTarget(client, body.secondPlayer);
    if (!targetSocket)
      return;
    targetSocket.emit('onBall', {
      order:"ballUp",
      angle: body.angle,
      x: body.x,
      y: body.y
    });
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    console.log("Client looking for player: " + client.id);
    for (const [socketId, socket] of this.lookingForPlayerSockets) {
      if (socket.id != client.id)
      {
        client.emit('playerFound', {
          order: "newPlayer",
          player: socket.id,
          first: true
        });
        socket.emit('playerFound', {
          order: "newPlayer",
          player: client.id,
          first: false
        });
        this.lookingForPlayerSockets.delete(socket.id);
        return;
      }
    }
    this.lookingForPlayerSockets.set(client.id, client);
  }

}
