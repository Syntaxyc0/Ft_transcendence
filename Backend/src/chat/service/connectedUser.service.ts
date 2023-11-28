import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConnectedUserI } from "../model/connectedUser.interface";
import { UserI } from "../model/user.interface";
import { User } from "@prisma/client";

@Injectable()
export class ConnectedUserService{
  constructor(private readonly prisma: PrismaService) {}

	async	create(connectedUserI: ConnectedUserI) {
		const createdConnectedUser = await this.prisma.connectedUser.create({
			data: {
			socketId: connectedUserI.socketId,
			user: {
				connect: {
				id: connectedUserI.user.id,
				},
			},
			},
		});
		
		return createdConnectedUser;
	}

	async deleteBySocketId(socketId: string): Promise<void> {
		await this.prisma.connectedUser.deleteMany({
		where: {
			socketId: socketId,
		},
		});
	}

	async findByUser(user_find: User) {
		return await this.prisma.connectedUser.findMany({
		  where: {
			user: user_find,
		  },
		});
	}
}