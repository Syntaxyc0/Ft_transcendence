import { Body, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket} from "socket.io"
import { Player } from './models/player.model'; 
import { Room} from './models/room.model';
import { MultiplayerService } from './services/multiplayer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserI } from 'src/chat/model/user.interface';
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';


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

  constructor(private prisma: PrismaService, private authService: AuthService, private userService: UserService, private gameService: GameService) {}

  onModuleInit(){
    console.log("Server up")
    this.server.on('connection', async (socket) => {
      let recovered : boolean = false

      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
            const user: UserI = await this.prisma.user.findUnique({
                where: { id: decodedToken.sub },
            });
      
      this.connectedPlayers.set(socket.id, new Player(socket, user.login))
      
      this.connectedPlayers.forEach((player, index) => {

        if(player.login == user.login && socket.id != player.socket.id)
        {
          if (player.room != undefined)
          {
            this.connectedPlayers.get(socket.id).room = player.room
            for (let i: number = 0; i < 2; i++)
              if (player.login == player.room.players[i].login)
              {
                player.room.players[i] = this.connectedPlayers.get(socket.id)
                player.room.multiplayer.reload(i)
              }
          }
          this.connectedPlayers.delete(index)
          console.log(player.login + ' recovered')
        }
      })

      socket.on('disconnect', () => {

        const player = this.connectedPlayers.get(socket.id)
        console.log(player.login + " has disconnected");

        player.status = false;

        const targetRoom = this.getRoom(socket.id)

        if (!targetRoom)
          return;
        if (!targetRoom.players[0].status && !targetRoom.players[1].status)
          this.disconnectRoom(socket.id);

      });
    });
  }

  async getId(login: string): Promise<number>{
    return this.userService.getUserIdFromLogin(login)
  }

  getRoom(clientId: string) : Room{
    if (!this.connectedPlayers.get(clientId))
      return undefined;
    const targetRoom = this.connectedPlayers.get(clientId).room;
    return targetRoom;
  }

  @SubscribeMessage('gameOver')
  gameOver(@ConnectedSocket() client:Socket)
  {
    this.disconnectRoom(client.id)
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

  @SubscribeMessage('gameExists')
  lookForGame(client: Socket)
  {
    const player = this.connectedPlayers.get(client.id)
    if (player.room != undefined)
    {
      for (let i: number = 0; i < 2; i++)
        if (player.login == player.room.players[i].login)
            player.room.multiplayer.reload(i)
    }
  }

  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket, @MessageBody() side: number)
  {
    const player = this.connectedPlayers.get(client.id)
    console.log(player.login + " is disconnecting")
    player.lookingForPlayer = false
    player.status = false
    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    if (!targetRoom.players[side * -1 + 1].status)
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
        this.rooms.push(new Room(this.rooms.length ,this.connectedPlayers.get(client.id), player, this.gameService))
        return;
      }
    }
    this.connectedPlayers.get(client.id).lookingForPlayer = true
  }
}