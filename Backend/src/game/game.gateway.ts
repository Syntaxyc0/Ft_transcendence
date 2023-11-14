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
  private pairedSockets: Map<string, string> = new Map();

  onModuleInit(){
    this.server.on('connection', (socket) => {
      
      this.connectedSockets.set(socket.id, socket);
      console.log(socket.id + ' has connected');

      socket.on('disconnect', () => {
        console.log(socket.id + " has disconnected");
        const targetId = this.pairedSockets.get(socket.id);
        const targetSocket = this.connectedSockets.get(targetId);

        this.disconnectClient(socket.id);
        this.connectedSockets.delete(socket.id);
        if (targetSocket)
          targetSocket.emit('otherDisconnected', {order: 'otherDisconnected'})
      });
    });
  }

  disconnectClient(clientId: string) {
    const targetId = this.pairedSockets.get(clientId);
    this.pairedSockets.delete(clientId);
    this.pairedSockets.delete(targetId); // Remove the target as well
    this.lookingForPlayerSockets.delete(clientId);
    this.lookingForPlayerSockets.delete(targetId); // Remove the target as well
    console.log("erase happened")
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
    targetSocket.emit('ongameRequest', {
        order: body.order
    });
  }  

  @SubscribeMessage('newScore')
  newScore(@MessageBody() body: {leftScore: number, rightScore: number}, @ConnectedSocket() client:Socket)
  {
    const targetSocket = this.connectedSockets.get(this.pairedSockets.get(client.id));
    if (!targetSocket)
      return;
    targetSocket.emit('ongameRequest', {
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
    targetSocket.emit('ongameRequest', {
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
    targetSocket.emit('ongameRequest', {
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
        console.log("Player found: " + socket.id);
        client.emit('newPlayer', {
          order: "newPlayer",
          first: true,
        });
        socket.emit('newPlayer', {
          order: "newPlayer",
          first: false,
        });
        this.lookingForPlayerSockets.delete(socket.id);
        this.pairedSockets.set(socket.id, client.id);
        this.pairedSockets.set(client.id, socket.id);
        return;
      }
    }
    this.lookingForPlayerSockets.set(client.id, client);
  }
}
