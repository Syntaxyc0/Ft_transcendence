import { Body, OnModuleInit, PayloadTooLargeException } from '@nestjs/common';
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
import { pbkdf2 } from 'crypto';


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
      await this.connection(socket)


      socket.on('disconnect', () => {
        this.disconnect(socket)
        
      });
    });
  }

  async connection(socket:Socket)
  {
    const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
            const user: UserI = await this.prisma.user.findUnique({
                where: { id: decodedToken.sub },
            });
      
      this.connectedPlayers.set(socket.id, new Player(socket, user.login))
  }

  async lookForGame(client: Socket): Promise<boolean>
  {
    let player = this.connectedPlayers.get(client.id)
    if (!player)
      await this.connection(client);
    this.playerExists(this.connectedPlayers.get(client.id))
    player = this.connectedPlayers.get(client.id)
    if (!player)
    {
      client.emit('onGameRequest', {order: "gameChecked", exists: false})
      return false;
    }
    if (player.room != undefined)
    {
      for (let i: number = 0; i < 2; i++)
        if (player.login == player.room.players[i].login)
        {
            player.room.players[i] = this.connectedPlayers.get(client.id)
            player.room.multiplayer.reload(i)
        }
    }
    client.emit('onGameRequest', {order: "gameChecked", exists: true})
    return true;
  }



  playerExists(newPlayer: Player)
  {
    // if (!newPlayer.login)
    //   return;
    this.connectedPlayers.forEach((player, index) => {
      if (!player || player.login != newPlayer.login || newPlayer.socket.id == player.socket.id)
        return;
      if(player.status == false)
      {
        if (player.room != undefined)
          newPlayer.room = player.room
        newPlayer.socket.emit('onGameRequest', {order: "reload"})
        player.socket.emit('onGameRequest', {order: "multiWindow"})
        this.connectedPlayers.delete(index)
      }
      else if(player.status == true)
      {
        newPlayer.socket.emit('onGameRequest', {order: "multiWindow"})
        this.connectedPlayers.delete(newPlayer.socket.id)
      }
    })
  }

  @SubscribeMessage('checkAndAccept')
  async checkAndAccept(@ConnectedSocket() client : Socket, @MessageBody() user: UserI)
  {
    await this.lookForGame(client)
    const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			if(user.id === User.userId) {
				await this.server.to(User.socketId).emit("accepted to play", {
					inviterI: client.data.user,
					// inviter_socket: socket,
					invited_login: user.login,
				});
			}
		}
  }


  @SubscribeMessage('checkAndLaunch')
  async checkAndLaunch(@ConnectedSocket() client : Socket, @MessageBody() payload: any)
  {
    await this.lookForGame(client)
    this.pairPlayers({currentUser: payload.currentUser, invitedUser: payload.invitedUser})

  }




  @SubscribeMessage('gameExists')
  gameExist(client:Socket)
  {
    this.lookForGame(client)
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
    if (this.connectedPlayers.get(client.id))
    client.emit('login', this.connectedPlayers.get(client.id).login)
  }


  getPlayer(login: string): Player
  {
    for (const [socketId, player] of this.connectedPlayers) {
      if (login == player.login)
        return player;
    }
    return undefined
  }

  // @SubscribeMessage('pairPlayers')
  /*async */pairPlayers(/*@ConnectedSocket() client: Socket, @MessageBody() */players: {currentUser: string, invitedUser: string})
  {
    // await this.lookForGame(client)
    const invitedPlayer = this.getPlayer(players.invitedUser)
    const currentPlayer = this.getPlayer(players.currentUser)
    if (!invitedPlayer || !currentPlayer || currentPlayer.room || invitedPlayer.room)
      return;

    invitedPlayer.socket.emit("go on page")
    currentPlayer.socket.emit("go on page")
    this.rooms.push(new Room(this.rooms.length , currentPlayer, invitedPlayer, this.gameService))
  }




  @SubscribeMessage('disconnectingClient')
  warnOther(@ConnectedSocket() client: Socket)
  {
    this.disconnect(client)
  }

  disconnect(client: Socket)
  {
    const player = this.connectedPlayers.get(client.id)
    if (!player)
      return
    console.log(player.login + " has disconnected");
    player.connected = false;
    player.status = false;
    player.lookingForPlayer = false

    const targetRoom = this.getRoom(client.id)
    if (!targetRoom)
      return;
    if (!targetRoom.players[0].status && !targetRoom.players[1].status)
      this.disconnectRoom(client.id);
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
    const matchPlayer = this.connectedPlayers.get(client.id)
    if (!matchPlayer || matchPlayer.room != undefined)
      return;
    for (const [socketId, player] of this.connectedPlayers) {
      if (player.socket.id != client.id && player.lookingForPlayer)
      {
        this.rooms.push(new Room(this.rooms.length ,matchPlayer, player, this.gameService))
        return;
      }
    }
    matchPlayer.lookingForPlayer = true
    matchPlayer.socket.emit('onGameRequest', {order: "playerNotFound"})
  }
}