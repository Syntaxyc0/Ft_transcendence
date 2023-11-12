import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException, Body, Injectable, ConflictException, ConsoleLogger, ForbiddenException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import { stat } from "fs";
import * as argon from 'argon2'
import { MailService } from "src/mail/mail.service";

var path = require('path');


@Injectable()
export class UserService
{
	constructor(private prisma: PrismaService, private mail: MailService) {}

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

	async GetUserFriendRequestsReceived(uid: number)
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
		return user.FriendRequestsReceived
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
		else if (user.login === friend.login)
		{
			throw new NotFoundException('You cannot add yourself to your friend list')
		}
		const friendlist = user.friendList
		for (const i of friendlist)
		{
			{
				if ( i == friend.id)
					throw new ConflictException(friend.login + " is already a friend")
			}
		}
		const friendrequests = user.FriendRequestsEmitted
		for (const i of friendrequests)
		{
			{
				if ( i == friend.id)
					throw new ConflictException(friend.login + " has already been added")
			}
		}
		await this.prisma.user.update({
			data: {
				FriendRequestsEmitted :{
					push: friend.id
						}	
					},
			where: {
				id: uid,
			}
		})
		await this.prisma.user.update({
			data: {
				FriendRequestsReceived :{
					push: user.id
						}	
					},
			where: {
				id: friend.id,
			}
		})
		

	}

	async RemoveFriend(uid:number, userId: number)
	{
		const newfriendlist = []
		const friend = await this.prisma.user.findUnique({
			where: {
				id: userId
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
		const friendlist = user.friendList
		for (const i of friendlist) {
			if (i != userId)
				newfriendlist.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: uid,
			},
			data: {
				friendList : newfriendlist
			}
		})
		

	}

	async uploadFile(uid:number, file: Express.Multer.File)
	{
		console.log(file);
		if (file.size > 1000000)
		{
			console.log("file is too big")
			console.log(file.size)
			return 

		}
		else if (!this.validate_extension(path.extname(file.filename)))
		{
			console.log('Wrong file extension')
			return 
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
		await this.prisma.user.update({
			where: {
				id: uid,
            },
			data: {
                avatar: file['originalname']
            }
		});
	}

	validate_extension(ext: string)
	{
		if (ext != '.png' && ext != '.jpeg' && ext != '.jpg' && ext != '.gif')
			return false
		return true
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

	async	get2faenabled(uid:number)
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
		return user.is2faenabled
	}

	async	get2favalidated(uid:number)
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
		return user.is2favalidated
	}

	async validate2FA(uid:number)
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
				is2favalidated: true
			}
		})
	}

	async switch2fa(uid, activate)
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
				is2faenabled: activate['activated']
			}
		})
	}

	async verify2facode(uid, code)
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
		const CodeMatches = await argon.verify(user.twofacode, code);
        if (!CodeMatches)
            throw new ForbiddenException("Wrong code");
		await this.prisma.user.update({
			where: {
				id: uid,
            },
            data: {
				is2favalidated:true
			}
		})
		return true
		
	}

	async get2facode(uid)
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
		if (user.twofacode)
		{
			return user.twofacode
		}
	}

	generateRandom6digitCode()
    {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

	async logout(uid)
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
		if (user.is2faenabled)
		{
			await this.prisma.user.update({
				where: {
					id: uid,
				},
				data: {
					is2favalidated:false
				}
			})
		}
		await this.prisma.user.update({
			where: {
				id: uid,
            },
            data: {
				userStatus: 'OFFLINE'
			}
		})

	}
}

