import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { Player } from './models/player.model'; 
import { Room} from './models/room.model';
import { MultiplayerService } from './services/multiplayer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserI } from 'src/chat/model/user.interface';


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

  constructor(private prisma: PrismaService, private authService: AuthService) {}

  onModuleInit(){
    console.log("Server up")
    this.server.on('connection', async (socket) => {

      console.log(socket.id + ' has connected');
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
            const user: UserI = await this.prisma.user.findUnique({
                where: { id: decodedToken.sub },
            });

      this.connectedPlayers.set(socket.id, new Player(socket, user.login))

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

  @SubscribeMessage('loginRequest')
  loginRequest(@ConnectedSocket() client:Socket)
  {
    client.emit('login', this.connectedPlayers.get(client.id).login)
  }

  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket, @MessageBody() side: number)
  {
    console.log(this.connectedPlayers.get(client.id).login + " is disconnecting")
    this.connectedPlayers.get(client.id).lookingForPlayer = false
    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    targetRoom.players[side * -1 + 1].socket.emit('onGameRequest', {order: "otherDisconnected"})
    // this.getRoom(client.id).players[side * -1 + 1].socket.emit("otherDisconnected")
    this.disconnectRoom(client.id)
  }

  @SubscribeMessage('newPaddlePosition')
  setPaddle(@ConnectedSocket() client: Socket, @MessageBody() paddle: {y: number, side: number})
  {
    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    targetRoom.multiplayer.paddleData(paddle);
  }

  @SubscribeMessage('logRequest')
  log(@ConnectedSocket() client: Socket)
  {
    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    targetRoom.log()
  }

  @SubscribeMessage('multiplayerRequest')
  searchMultiplayer(@ConnectedSocket() client: Socket) {
    if (this.connectedPlayers.get(client.id).room)
      return;
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