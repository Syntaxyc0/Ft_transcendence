// import { UnauthorizedException } from '@nestjs/common';

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PageI } from 'src/chat/model/page.interface';
import { Prisma, User, Room, ConnectedUser, Message } from '@prisma/client'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserI } from '../model/user.interface';
import { ConnectedUserService } from '../service/connectedUser.service';
import { JoinedRoomService } from '../service/joined-room.service';
import { MessageService } from '../service/message.service';
import { MessageI } from '../model/message.interface';
import { RoomI } from '../model/room.interface';
import { JoinedRoomI } from '../model/joinedRoom.interface';
import { RoomService } from '../service/room.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:3333', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	constructor( 
		private authService: AuthService,
		private prisma: PrismaService,
		private roomService: RoomService,
		private connectedUserService: ConnectedUserService,
		private joinedRoomService: JoinedRoomService,
		private messageService: MessageService) { }

	async onModuleInit() {
		await this.connectedUserService.deleteAll();
		await this.joinedRoomService.deleteAll();
	}

	async handleConnection( socket: Socket ) {
		try {
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

				await this.connectedUserService.create({ socketId: socket.id, user });

				return this.server.to(socket.id).emit('roomsI', rooms);
			}
		} catch {
			console.log("catch disconnect")
			return this.disconnect(socket);
		}
	}


	async handleDisconnect(socket: Socket) {
		await this.connectedUserService.deleteBySocketId(socket.id);
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

		const usersArray = (roomInput.users as Array<{ id: number }>).map(user => ({ id: user.id }));
		usersArray.push({ id: socket.data.user.id });

		const createdRoom = await this.prisma.room.create({
			data: {
				...roomInput,
				users: {
					connect: usersArray,
				},
				creator: {
					connect: {
						id: user.id
					},
				},
			},
			include : { users: true }
		});

		// emit room if user is connected
		for (const user of createdRoom.users) {
			const connected_users: ConnectedUser[] = await this.connectedUserService.findByUser({id: user.id});
			
			const rooms = await this.prisma.room.findMany({
				where: { users: { some: { id: user.id } } },
				take: 10,
				skip: 0,
			});
			for (const connection of connected_users) {
				await this.server.to(connection.socketId).emit('roomsI', rooms);
			}
		  }

		return createdRoom;
	}
	
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

	@SubscribeMessage('getCurrentUser')
	currentUser (socket: Socket) {
		return socket.emit('currentUser', socket.data.user)
	}

	@SubscribeMessage('joinRoom')
	async onJoinRoom(socket: Socket, room: RoomI) {
	  const messages = await this.messageService.findMessagesForRoom(room);
	  // Save Connection to Room
	  await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room });
	  // Send last messages from Room to User
	  await this.server.to(socket.id).emit('messages', messages);
	}
  
	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket) {
	  // remove connection from JoinedRooms
	  await this.joinedRoomService.deleteBySocketId(socket.id);
	}
  
	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI) {
		const { id, ...messageWithoutId } = message;
		const createdMessage = await this.prisma.message.create({
			data: {
				...messageWithoutId,
				user: {
					connect: { id: socket.data.user.id},
				},
				room: {
					connect: { id: messageWithoutId.room.id }, 
				},
			},
			include: {
				room: true,
			}
		});
		
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);

		const joinedUsers: JoinedRoomI[] = await this.prisma.joinedRoom.findMany({
			where: {
			  roomId: room.id,
			},
			include: {
				room: true,
				user: true,
			}
		  });

		const messages = await this.messageService.findMessagesForRoom(room);
	    for(const user of joinedUsers) {
      		await this.server.to(user.socketId).emit('messageAdded', { ...createdMessage, user: socket.data.user });
    	}
	}
}
