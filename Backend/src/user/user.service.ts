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

	async getUserIdFromLogin(login: string) {
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
		return user.id
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

	async ChangeNick(uid:number, name:string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: uid,
			}
		})
		if (!user) {
            throw new NotFoundException('User not found')
        }
		const checkname = await this.prisma.user.findUnique({
			where: {
				login: name,
			}
		})
		if (checkname) {
            throw new ConflictException( name + ' is already taken')
        }
		await this.prisma.user.update({
			data: {
				login: name
			},
			where: {
				id: uid,
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

	async GetUserFriendRequestsSent(uid: number)
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
		return user.FriendRequestsEmitted
	}

	async CancelRequest(uid:number, name:string)
	{
		const friend = await this.prisma.user.findUnique({
			where: {
				login: name
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
		const friendrequestsemitted = user.FriendRequestsEmitted
		const friendrequestsreceived = friend.FriendRequestsReceived
		const newfriendrequestsreceived = []
		for (const i of friendrequestsreceived) {
			if (i != uid)
				newfriendrequestsreceived.push(i)
		}
		const newfriendrequestsemitted = []
		for (const j of friendrequestsemitted) {
			if (j != friend.id)
				newfriendrequestsemitted.push(j)
	}
	await this.prisma.user.update({
		where: {
			id: uid,
		},
		data: {
			FriendRequestsEmitted : newfriendrequestsemitted
		}
	})
	await this.prisma.user.update({
		where: {
			login: name,
		},
		data: {
			FriendRequestsReceived : newfriendrequestsreceived
		}
	})
	}
	
	async RefuseRequest(uid:number, id:number)
	{
		const friend = await this.prisma.user.findUnique({
			where: {
				id:	id,
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
		const friendemitted = friend.FriendRequestsEmitted
		const newfriendemitted = []
		for (const i of friendemitted) {
			if (i != uid)
				newfriendemitted.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				FriendRequestsEmitted : newfriendemitted
			}
		})
		const userreceived = user.FriendRequestsReceived
		const newuserreceived = []
		for (const i of userreceived) {
			if (i != id)
				newuserreceived.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: uid,
			},
			data: {
				FriendRequestsReceived : newuserreceived
			}
		})

	}
	
	async AcceptRequest(uid:number, id:number)
	{
		const friend = await this.prisma.user.findUnique({
			where: {
				id:	id,
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
		await this.prisma.user.update({
			data: {
				friendList :{
					push: uid
						}	
					},
			where: {
				id: id,
			}
		})
		await this.prisma.user.update({
			data: {
				friendList :{
					push: id
						}	
					},
			where: {
				id: uid,
			}
		})
		const friendemitted = friend.FriendRequestsEmitted
		const newfriendemitted = []
		for (const i of friendemitted) {
			if (i != uid)
				newfriendemitted.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				FriendRequestsEmitted : newfriendemitted
			}
		})
		const friendreceived = friend.FriendRequestsReceived
		const newfriendreceived = []
		for (const i of friendreceived) {
			if (i != uid)
				newfriendreceived.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				FriendRequestsReceived : newfriendreceived
			}
		})
		const useremitted = user.FriendRequestsEmitted
		const newuseremitted = []
		for (const i of useremitted) {
			if (i != id)
				newuseremitted.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: uid,
			},
			data: {
				FriendRequestsEmitted : newuseremitted
			}
		})
		const userreceived = user.FriendRequestsReceived
		const newuserreceived = []
		for (const i of userreceived) {
			if (i != id)
				newuserreceived.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: uid,
			},
			data: {
				FriendRequestsReceived : newuserreceived
			}
		})

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
		const newfriendlist2 = []
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
		const friendlist2 = friend.friendList
		for (const i of friendlist2) {
			if (i != uid)
				newfriendlist2.push(i)
		}
		await this.prisma.user.update({
			where: {
				id: uid,
			},
			data: {
				friendList : newfriendlist
			}
		})
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				friendList : newfriendlist2
			}
		})
		

	}

	async uploadFile(uid:number, file: Express.Multer.File)
	{
		if (!file)
		{
			console.log("unrecognized file")
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
                avatar: file['filename']
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

