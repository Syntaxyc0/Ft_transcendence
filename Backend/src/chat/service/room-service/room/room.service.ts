import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/room.entity';
import { RoomI } from 'src/chat/model/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomService {

	constructor(
		@InjectRepository(RoomEntity)								//Change to Prisma
		private readonly roomRepository: Repository<RoomEntity>		//Change to Prisma
	) {}

	async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {	//Change inteface
		const newRoom = await this.addCreatorToRoom(room, creator);
		return this.roomRepository.save(newRoom);					//change to prisma
	}

	async getRoomForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
		const query = this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'user')
			.where('user.id = :userId', {userId})
			.leftJoinAndSelect('room.users', 'all_users')
			.orderBy('room.updated_at', 'DESC');

		return paginate(query, options);
	}

	async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
		room.users.push(creator);
		return room;
	}
}
