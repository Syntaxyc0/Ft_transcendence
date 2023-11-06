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
      take: options.limit || 10,
      skip: (options.page - 1) * (options.limit || 10),
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

    return paginate<Room>(rooms, { ...options, totalItems });
  }

  async addCreatorToRoom(room: Prisma.RoomCreateInput, creator: User): Promise<Prisma.RoomCreateInput> {
    if (!room.users) {
      room.users = {
        connect: [{ id: creator.id }],
      };
    } else {
      room.users.connect = room.users.connect || [];
      room.users.connect.push({ id: creator.id });
    }

    return room;
  }
}
