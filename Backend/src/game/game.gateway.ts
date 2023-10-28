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

  onModuleInit(){
    this.server.on('connection', (socket) => {
      
      this.connectedSockets.set(socket.id, socket);
      console.log(socket.id + ' has connected');

      socket.on('disconnect', () => {
        this.connectedSockets.delete(socket.id);
        console.log(socket.id + " has disconnected");
      });
    });

    
  }

  @SubscribeMessage('GameRequest')
  GameRequest(@MessageBody() body: {order: string, secondPlayer: string})
  {
    const targetSocket = this.connectedSockets.get(body.secondPlayer);
    if (!targetSocket)
      return;
    targetSocket.emit('onGameRequest', {
        order: body.order
    });
  }


  @SubscribeMessage('newData')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log(client.id);
    console.log(body);
    this.server.emit('reading', {
      msg: 'New Data',
      content: body,
    });
  }

  @SubscribeMessage('newBallPos')
  newBallPos(@MessageBody() body: {secondPlayer: string, angle: number, x: number, y: number})
  {
    const targetSocket = this.connectedSockets.get(body.secondPlayer);
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
    for (const [socketId, socket] of this.connectedSockets) {
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
        return;
      }
    }
  }

}
