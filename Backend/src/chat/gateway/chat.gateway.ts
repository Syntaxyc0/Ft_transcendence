// import { UnauthorizedException } from '@nestjs/common';

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PageI } from 'src/chat/model/page.interface';
import { Prisma, User, Room } from '@prisma/client'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserI } from '../model/user.interface';

@WebSocketGateway({ cors: { origin: ['http://localhost:3333', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	constructor( private authService: AuthService, private prisma: PrismaService ) {}

	async handleConnection( socket: Socket ) {
		try {
			console.log("\nHandleCo1")
			const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
			const user: UserI = await this.prisma.user.findUnique({
				where: { id: decodedToken.sub },
			});
			if ( !user ) {
				console.log("user not found");
				return this.disconnect(socket);
			} else {
				socket.data.user = user;
				const rooms = await this.prisma.room.findMany({
					where: { users: { some: { id: user.id } } },
					take: 10,
					skip: 0,
				});

				return this.server.to(socket.id).emit('roomsI', rooms);
			}
		} catch {
			console.log("catch disconnect")
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
	async onCreateRoom(socket: Socket, roomInput: Prisma.RoomCreateInput): Promise<Room> {

		if (!socket.data.user) {
			throw new UnauthorizedException();
		}

		const user = await this.prisma.user.findUnique({
			where: { id: socket.data.user.id },
		});

		if (!user) {
			throw new UnauthorizedException();
		}

		const usersConnectArray = (roomInput.users as Array<{ id: number }>).map(user => ({ id: user.id }));

		const createdRoom = await this.prisma.room.create({
			data: {
			  ...roomInput,
			  users: {
			    connect: usersConnectArray,
			  },
			},
		});

		return createdRoom;
	}


	// @SubscribeMessage('paginateRooms')
	// async onPaginateRoom(socket: Socket, page: PageI) {
	// 	if (!socket.data.user) {
	// 		console.log("1e except")
	// 		throw new UnauthorizedException();
	// 	}
		
	// 	page.limit = page.limit > 100 ? 100 : page.limit;
	// 	page.page = page.page + 1;

	// 	const user = await this.prisma.user.findUnique({
	// 		where: { id: socket.data.user.id },
	// 			include: { rooms: { take: page.limit, skip: (page.page - 1) * page.limit } },
	// 	});

	// 	if (!user) {
	// 		console.log("2e except")
	// 		throw new UnauthorizedException();
	// 	}

	// 	const rooms = user.rooms;
	// 	console.log("on paginate room",rooms)

	// 	return this.server.to(socket.id).emit('rooms', rooms);
	// }

	@SubscribeMessage('roomsArray')
	async getRooms(socket: Socket, page: PageI) {
		const user = await this.prisma.user.findUnique({
			where: { id: socket.data.user.id },
			include: {
			  rooms: true,
			},
		  });

		const room = user.rooms;
		
		return this.server.to(socket.id).emit('roomsI', room);
	}
}
