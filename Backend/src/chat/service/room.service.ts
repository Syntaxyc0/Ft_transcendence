import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Room, User } from '@prisma/client';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService{
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(room: Room, creator: User): Promise<Room> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.prisma.room.create({
      data: newRoom,
    });
  }

  async getRoomForUser(userId: number, options: IPaginationOptions): Promise<Room[]> {
	const parsedLimit = typeof options.limit === 'string' ? parseInt(options.limit, 10) : options.limit || 10;
	const parsedPage = typeof options.page === 'string' ? parseInt(options.page, 10) : options.page || 1;
  
	const skip = (parsedPage - 1) * parsedLimit;
  
	const where = {
	  users: {
		some: {
		  id: userId,
		},
	  },
	};
  
	const rooms = await this.prisma.room.findMany({
	  where,
	  orderBy: {
		updated_at: 'desc',
	  },
	  take: parsedLimit,
	  skip,
	  include: {
		users: true,
	  },
	});
  
	return rooms;
  }
  
  
  
  
  
  async addCreatorToRoom(room: Room, creator: User): Promise<Room> {
	return this.prisma.room.update({
	  where: { id: room.id },
	  data: {
		users: {
		  connect: [{ id: creator.id }],
		},
	  },
	});
  }
  
}
