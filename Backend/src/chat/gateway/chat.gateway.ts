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

				await this.connectedUserService.create({ socketId: socket.id, user });

				return this.server.to(socket.id).emit('roomsI', await this.allowedRooms(user.id));
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

		let usersArray = [];
		
// La room est privé
		if (!roomInput.public) {

			usersArray = (roomInput.users as Array<{ id: number }>).map(user => ({ id: user.id }));
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
					admin: {
						connect: {
							id: user.id
						},
					},
				},
				include : { users: true }
			});

			for (const user of createdRoom.users) {
				const connected_users: ConnectedUser[] = await this.connectedUserService.findByUser({id: user.id});
				
				for (const connection of connected_users) {
					await this.server.to(connection.socketId).emit('roomsI', await this.allowedRooms(connection.userId));
				}
			}
			return createdRoom;
			
// La room est public
		} else {
			const { users, ...roomDataWithoutUsers } = roomInput;

			const createdRoom = await this.prisma.room.create({
				data: {
					...roomDataWithoutUsers,
					creator: {
						connect: {
							id: user.id
						},
					},
					admin: {
						connect: {
							id: user.id
						},
					},
				},
			});

			const connectedUser = await this.prisma.connectedUser.findMany();
			for (const user of connectedUser) {

				await this.server.to(user.socketId).emit('roomsI', await this.allowedRooms(user.userId));
			}
		}
	}
	
	@SubscribeMessage('roomsArray')
	async getRooms(socket: Socket) {

		if(!socket.data.user)
			return;
		
		return await socket.emit("roomsI", await this.allowedRooms(socket.data.user.id));
	}

	@SubscribeMessage('getCurrentUser')
	async currentUser (socket: Socket) {
		return await socket.emit('currentUser', socket.data.user)
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

	@SubscribeMessage('getAdminList')
	async isAdmin(socket: Socket, current_room: RoomI) {

		const room = await this.prisma.room.findUnique({
			where: { id: current_room.id },
			include: { admin: true },
		});
      	return await socket.emit('isAdmin', room.admin);
	}

	@SubscribeMessage('setAsAdmin')
	async setAsAdmin(socket: Socket, data: { user: UserI, room: RoomI }) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id}
		});

		await this.prisma.room.update({
			where: { id: room_.id },
			data: {
			  admin: { connect: { id: user_.id } },
			},
		  });
		await socket.emit("adminList", room_);
	}

	@SubscribeMessage('unsetAsAdmin')
	async unsetAsAdmin(socket: Socket, data: { user: UserI, room: RoomI }) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id}
		});

		await this.prisma.room.update({
			where: { id: room_.id },
			data: {
			  admin: { disconnect: { id: user_.id } },
			},
		  });
		await socket.emit("adminList", room_);
	}

	@SubscribeMessage("getCreatorId")
	async getCreatorId(socket: Socket, room: RoomI) {

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: {
				creator: true
			}
		});
		return await socket.emit("creatorId", room_.creatorId);
	}

	@SubscribeMessage('blockedUsers')
	async blockedUserList(socket: Socket) {

		const user = await this.prisma.user.findUnique({
			where: { id: socket.data.user.id },
			include: { blockedUsers: true },
		});

      	return await socket.emit('blockedUsersList', user.blockedUsers);
	}

	@SubscribeMessage('blockUser')
	async blockUser(socket: Socket, user: UserI) {

		const current = await this.prisma.user.findUnique({
			where: { id: socket.data.user.id },
			include: { blockedUsers: true}
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id }
		});

		await this.prisma.user.update({
			where: { id: current.id },
			data: {
			  blockedUsers: { connect: { id: user_.id } },
			},
		});

		await socket.emit("blockedUsersList", current.blockedUsers);
	}

	@SubscribeMessage('unblockUser')
	async unblockUser(socket: Socket, user: UserI) {

		const current = await this.prisma.user.findUnique({
			where: { id: socket.data.user.id },
			include: { blockedUsers: true}
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id}
		});

		await this.prisma.user.update({
			where: { id: current.id },
			data: {
			  blockedUsers: { disconnect: { id: user_.id } },
			},
		});

		await socket.emit("blockedUsersList", current.blockedUsers);
	}

	@SubscribeMessage('MutedUsers')
	async MutedUserList(socket: Socket, room: RoomI) {

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: { mutedUsers: true },
		});

      	return await socket.emit('mutedUsersList', room_.mutedUsers);
	}

	@SubscribeMessage('muteUser')
	async muteUser(socket: Socket, data: { user: UserI, room: RoomI }) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: { mutedUsers: true },
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id}
		});

		await this.prisma.room.update({
			where: { id: room_.id },
			data: {
			  mutedUsers: { connect: { id: user_.id } },
			},
		  });

		await socket.emit('mutedUsersList', room_.mutedUsers);

		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const user of connectedUser) {
			if (user.userId === user_.id) {
				await this.server.to(user.socketId).emit('mutedUserTrue', room_.mutedUsers);
			}
		}

		setTimeout( async () =>{

			await this.prisma.room.update({
				where: { id: room_.id },
				data: {
				  mutedUsers: { disconnect: { id: user_.id } },
				},
			  });

			await socket.emit('mutedUsersList', room_.mutedUsers);

			for (const user of connectedUser) {
				if (user.userId === user_.id) {
					await this.server.to(user.socketId).emit('mutedUserFalse', room_.mutedUsers);
				}
			}
			
		}, 15000);
	}

	@SubscribeMessage('kickUser')
	async kickUser(socket: Socket, data: { user: UserI, room: RoomI }) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
		});


		// delete user_ from the current room
		await this.prisma.room.update({
			where: { id: room_.id },
			data: {
			  users: { disconnect: { id: user.id } },
			},
		});
		
		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			if (User.userId === user.id) {
				await this.server.to(User.socketId).emit('roomsI', await this.allowedRooms(User.userId));
				await this.server.to(User.socketId).emit('kicked');
			}
		}
	}

	@SubscribeMessage('AddUser')
	async AddUser(socket: Socket, data: { user: UserI, room: RoomI }) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
		});
		
		// add user_ from the current room
		await this.prisma.room.update({
			where: { id: room_.id },
			data: {
				users: { connect: { id: user.id } },
			},
		});
		
		
		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			if (User.userId === user.id) {
				await this.server.to(User.socketId).emit("roomsI", await this.allowedRooms(User.userId));
			}
		}
	}

	@SubscribeMessage('getUsersRoom')
	async getUsersRoom( socket: Socket, room: RoomI ) {

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: { users: true }
		});

		await socket.emit('UsersRoom', room_.users);
	}	

	@SubscribeMessage('banUser')
	async banUser( socket: Socket, data: { user: UserI, room: RoomI } ) {

		this.kickUser(socket, data);

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: {BanUsers: true, users: true}
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id},
		});

		await this.prisma.room.update({
			where: {id: room_.id},
			data: {
				BanUsers: { connect: { id: user_.id } },
			}
		});

		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			for(const users of room_.users)
				if(users.id === User.userId) {
					await this.server.to(User.socketId).emit("banList", room_.BanUsers);
				}
		}
	}

	@SubscribeMessage('unbanUser')
	async unbanUser( socket: Socket, data: { user: UserI, room: RoomI } ) {

		const { user, room } = data;

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: { BanUsers: true, users: true }
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: user.id },
		});

		await this.prisma.room.update({
			where: {id: room_.id},
			data: {
				BanUsers: { disconnect: { id: user_.id } },
			}
		});

		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			for(const users of room_.users)
				if(users.id === User.userId) {
					await this.server.to(User.socketId).emit('roomsI', await this.allowedRooms(User.userId));
					await this.server.to(User.socketId).emit("banList", room_.BanUsers);
				}
		}
	}

	@SubscribeMessage('getBanList')
	async getBanList( socket: Socket, room: RoomI ) {

		const room_ = await this.prisma.room.findUnique({
			where: { id: room.id },
			include: { BanUsers: true },
		});

		return await socket.emit('banList', room_.BanUsers);
	}

	@SubscribeMessage('invite_to_play?')
	async invite_to_play( socket: Socket, user: UserI ) {

		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			if(user.id === User.userId) {
				// socket("isVisible")
				await this.server.to(User.socketId).emit("invited to play", { inviterI: socket.data.user });

				// return;
			}

		}
	}

	@SubscribeMessage('acceptGame')
	async acceptGame( socket: Socket, user: UserI ) 
	{
		// console.log("game accepted")
		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser) {
			if(user.id === User.userId) {
				await this.server.to(User.socketId).emit("accepted to play", {
					inviterI: socket.data.user,
					// inviter_socket: socket,
					invited_login: user.login,
				});
			}
		}
	}
	

	@SubscribeMessage('refuseGame')
	async refuseGame( socket: Socket, user: UserI ) {

		const connectedUser = await this.prisma.connectedUser.findMany();
		for (const User of connectedUser)
			if(user.id === User.userId)
				await this.server.to(User.socketId).emit("refuse to play", socket.data.user.login)

				
	}

	async allowedRooms( userId: number ) {
		
		const publicRooms = await this.prisma.room.findMany({
			where: {
			  public: true,
			  BanUsers: {
				none: {
				  id: userId,
				},
			  },
			},
		});

		const user_ = await this.prisma.user.findUnique({
			where: { id: userId},
			include: {rooms: true},
		});

		const userRooms = user_.rooms;
		const rooms = [...publicRooms, ...userRooms]

		return rooms;
	}
}
