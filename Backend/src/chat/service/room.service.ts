import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Room, User } from '@prisma/client';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(room: Prisma.RoomCreateInput, creator: User): Promise<Room> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.prisma.room.create({
      data: newRoom,
    });
  }

  async getRoomForUser(userId: number, options: IPaginationOptions): Promise<Pagination<Room>> {
	const parsedLimit = typeof options.limit === 'string' ? parseInt(options.limit, 10) : options.limit || 10;
	const parsedPage = typeof options.page === 'string' ? parseInt(options.page, 10) : options.page || 1;
  
	const rooms = await this.prisma.room.findMany({
	  where: {
		users: {
		  some: {
			id: userId,
		  },
		},
	  },
	  orderBy: {
		updated_at: 'desc',
	  },
	  take: parsedLimit,
	  skip: (parsedPage - 1) * parsedLimit,
	  include: {
		users: true,
	  },
	});
  
	const totalItems = await this.prisma.room.count({
	  where: {
		users: {
		  some: {
			id: userId,
		  },
		},
	  },
	});
  
	return paginate<Room>(rooms, { limit: parsedLimit, page: parsedPage, totalItems });
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
