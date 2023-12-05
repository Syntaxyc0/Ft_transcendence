import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomI } from '../model/room.interface';
import { MessageI } from '../model/message.interface';

@Injectable()
export class MessageService {

	constructor(private readonly prisma: PrismaService) {}


	async create(message: MessageI): Promise<Message> {
		return this.prisma.message.create({
			data:
				message
		});
	}
	  
	async findMessagesForRoom(room: RoomI): Promise<Message[]> {
		const messages = await this.prisma.message.findMany({
			where: {
				roomId: room.id,
			},
			include: {
				user: true,
				room: true,
			},
			orderBy: {
				created_at: 'desc',
			},
		});
		
		return messages
	}
	  
	  
}
