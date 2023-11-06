// import { UnauthorizedException } from '@nestjs/common';

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { PageI } from 'src/chat/model/page.interface';
import { Prisma } from '@prisma/client'; // Importez les types Prisma ici
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: Prisma.User | null = await this.prisma.user.findUnique({
        where: { id: decodedToken.user.id },
      });

      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.prisma.room.findMany({
          where: { userId: user.id },
          take: 10,
          skip: 0,
        });

        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: Prisma.RoomCreateInput): Promise<Prisma.Room> {
    if (!socket.data.user) {
      throw new UnauthorizedException();
    }

    room.userId = socket.data.user.id;

    const createdRoom = await this.prisma.room.create({
      data: room,
    });

    console.log('creator: ' + socket.data.user);
    console.log('room' + room);

    return createdRoom;
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    if (!socket.data.user) {
      throw new UnauthorizedException();
    }

    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page = page.page + 1;

    const rooms = await this.prisma.room.findMany({
      where: { userId: socket.data.user.id },
      take: page.limit,
      skip: (page.page - 1) * page.limit,
    });

    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
