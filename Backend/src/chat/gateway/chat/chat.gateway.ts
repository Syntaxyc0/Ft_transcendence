import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Subscriber } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { PageI } from 'src/chat/model/page.interface';
import { RoomI } from 'src/chat/model/room.interface';
import { RoomService } from 'src/chat/service/room-service/room/room.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

@WebSocketGateway({cors: { origin: ['https://hoppscotch.io', 'http://localhost:3000', 'http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{

	@WebSocketServer()
	server: Server;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private roomService: RoomService
		) {}

	async handleConnection(socket: Socket) {
		try {
			const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
			const user: UserI = await this.userService.getOne(decodedToken.user.id);
			if (!user) {
				return this.disconnect(socket);
			} else {
				socket.data.user = user;
				const rooms = await this.roomService.getRoomForUser(user.id, { page: 1, limit: 10 });
				rooms.meta.currentPage = rooms.meta.currentPage - 1;

				return this.server.to(socket.id).emit('rooms', rooms);
			}
		} catch  {
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
	async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
		console.log('creator: ' + socket.data.user);
		console.log('room' + room);
		return this.roomService.createRoom(room, socket.data.user);
	}

	@SubscribeMessage('paginateRooms')
	async onPaginateRoom(socket: Socket, page: PageI) {
		page.limit = page.limit > 100 ? 100 : page.limit;
		page.page = page.page + 1;
		const rooms = await this.roomService.getRoomForUser(socket.data.user.id, page);
		rooms.meta.currentPage = rooms.meta.currentPage - 1;
		return this.server.to(socket.id).emit('rooms', rooms);
	}
}
