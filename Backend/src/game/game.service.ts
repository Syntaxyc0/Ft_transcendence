import { Injectable, NotFoundException } from '@nestjs/common';
import { GameInfoDto } from './dto/GameInfor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from './interfaces/player.interface';

@Injectable()
export class GameService {

	// private readonly players: Player[] = []

	constructor(private prisma: PrismaService) {}

	// create(player: Player){
	// 	this.players.push(player)
	// }
	
	// findAll(): Player[]{
	// 	return this.players;
	// }
	
	// async getLogin(user)
	// {
	// 	return this.prisma.user.findMany({
	// 		where: { user}
	// })
	// }

	async newgame(gameinfo: GameInfoDto)
	{
		const game = await this.prisma.gameInfo.create(
			{
				data: {
				userId1: gameinfo.userId1,
                userId2: gameinfo.userId2,
                scoreUser1: gameinfo.scoreUser1,
                scoreUser2: gameinfo.scoreUser2,
                winnerId: gameinfo.winnerId,
				}
			})
		const user1 = await this.prisma.user.findUnique({
			where: {
                id: gameinfo.userId1
            }
		})
		const user2 = await this.prisma.user.findUnique({
            where: {
                id: gameinfo.userId2
            }
        })
		if (!user1 || !user2)
			throw new NotFoundException("user not found")
		await this.prisma.user.update({
			where: {
				id: gameinfo.userId1,
			},
			data: {
				gameHistory : {
					push : game.id
				}
			}
		})
		await this.prisma.user.update({
			where: {
				id: gameinfo.userId2,
			},
			data: {
				gameHistory : {
					push : game.id
				}
			}
		})
		console.log(game)
	}

	async getGameHistory(uid: number)
	{
		const user = await this.prisma.user.findUnique(
			{
				where: {
					id: uid
				},
			})
			if (!user)
			{
				throw new NotFoundException('User not found')
			}
			return user.gameHistory
	}

	async getGameInfo(id: number)
	{
		const game = await this.prisma.gameInfo.findUnique(
            {
				where: {
                    id: id
                }
			})
			if (!game)
			{
                throw new NotFoundException('Game not found')
            }
			return game
	}
}
