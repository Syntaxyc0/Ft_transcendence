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
    {
      client.emit('onGameRequest', {order: 'otherDisconnected'});
      this.searchMultiplayer(client);
    }
    return (targetSocket);
  }

  @SubscribeMessage('disconnectingClient')
  warnOther(@MessageBody() body:{secondPlayer: string}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.connectedSockets.get(body.secondPlayer);
    this.lookingForPlayerSockets.delete(client.id);
    if (targetSocket)
    {
      targetSocket.emit('onGameRequest', {order: 'otherDisconnected'});
      this.searchMultiplayer(targetSocket);
    }
  }

  @SubscribeMessage('gameRequest')
  GameRequest(@MessageBody() body: {order: string, secondPlayer: string}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.getTarget(client, body.secondPlayer);
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
        order: body.order
    });
  }

  @SubscribeMessage('newPaddlePos')
  newPaddlePos(@MessageBody() body: {secondPlayer: string, x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    console.log(body);
    const targetSocket = this.getTarget(client, body.secondPlayer);
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
      order:"paddleUp",
      x: body.x,
      y: body.y
    });
  }

  @SubscribeMessage('newBallPos')
  newBallPos(@MessageBody() body: {secondPlayer: string, angle: number, x: number, y: number}, @ConnectedSocket() client: Socket)
  {
    const targetSocket = this.getTarget(client, body.secondPlayer);
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
    console.log("Client looking for player: " + client.id);
    for (const [socketId, socket] of this.lookingForPlayerSockets) {
      if (socket.id != client.id)
      {
        client.emit('onGameRequest', {
          order: "newPlayer",
          player: socket.id,
          first: true
        });
        socket.emit('onGameRequest', {
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
