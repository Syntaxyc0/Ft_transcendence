import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException, Body, Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { stat } from "fs";



@Injectable()
export class UserService
{
	constructor(private prisma: PrismaService) {}

	async getUserFromId(id: number) {
        const user = await this.prisma.user.findUnique(
			{
				where: {
					id: id
				},
			},
		)
		if (!user) {
			throw new NotFoundException('User not found')
		}
		return user;
    }

	async getUserFromLogin(login: string) {
        const user = await this.prisma.user.findUnique(
			{
				where: {
					login: login
				},
			},
		)
		if (!user) {
			throw new NotFoundException("User not found")
    	}
		return user
	}

	async updateUserStatus(id: number, @Body() status)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			}
		})
		if (!user) {
            throw new NotFoundException('User not found')
        }
		await this.prisma.user.update({
				data: {
					userStatus: status['status'] ,
				},
				where: {
					id: id,
				}
			})
	}

	async GetUserStatus(id: number)
	{
		const user = await this.prisma.user.findUnique(
			{
				where: {
					id: id
				},
			},
		)
		if (!user) {
            throw new NotFoundException('User not found')
        }
		return user.userStatus
	}

	async GetUserFriendlist(uid: number)
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
		return user.friendList
	}

	async AddFriend(uid:number, userName: string)
	{
		const friend = await this.prisma.user.findUnique({
			where: {
				login: userName
			},
		})
		if (!friend)
		{
			throw new NotFoundException('User not found')
		}
		const user = await this.prisma.user.findUnique({
			where: {
                id: uid
            },
		})
		if (!user)
		{
            throw new NotFoundException('User not found')
        }
		if (user.login === friend.login)
		{
			throw new NotFoundException('You cannot add yourself to your friend list')
		}
		await this.prisma.user.update({
			data: {
				friendList :{
					push: friend.id
						}	
					},
			where: {
				id: uid,
			}
		})
		

	}

	async RemoveFriend(uid:number, userName: string) // TODO
	{
		const friend = await this.prisma.user.findUnique({
			where: {
				login: userName
			},
		})
		if (!friend)
		{
			throw new NotFoundException('User not found')
		}
		const user = await this.prisma.user.findUnique({
			where: {
                id: uid
            },
		})
		if (!user)
		{
            throw new NotFoundException('User not found')
        }
		if (user.login === friend.login)
		{
			throw new NotFoundException('You cannot add yourself to your friend list')
		}
		await this.prisma.user.delete({
			where: {
				id: uid,
			}
		})
		

	}

	async uploadFile(uid:number, file: Express.Multer.File)
	{
		console.log(file)
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        })
		if (!user)
		{
            throw new NotFoundException('User not found')
        }
		await this.prisma.user.update({
			where: {
				id: uid,
            },
			data: {
                avatar: file['originalname']
            }
		});
		console.log(user)
	}

	async	getelo(uid:number)
	{
		const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        })
		if (!user)
		{
            throw new NotFoundException('User not found')
        }
		return user.elo
	}

	async updateUserElo(uid:number, elo: number)
	{
		const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        })
		if (!user)
		{
			throw new NotFoundException('User not found')
		}
		await this.prisma.user.update({
			where: {
				id: uid,
            },
            data: {
				elo: elo
			}
		})
	}

	async getlogin(uid:number)
	{
		const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        })
		if (!user)
		{
			throw new NotFoundException('User not found')
		}
		return user.login
	}
}

