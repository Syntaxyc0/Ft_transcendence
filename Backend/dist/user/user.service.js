"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const argon = require("argon2");
const mail_service_1 = require("../mail/mail.service");
var path = require('path');
let UserService = class UserService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async getUserFromId(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user;
    }
    async getUserIdFromLogin(login) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login
            },
        });
        if (!user) {
            throw new common_2.NotFoundException("User not found");
        }
        return user.id;
    }
    async updateUserStatus(id, status) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            data: {
                userStatus: status['status'],
            },
            where: {
                id: id,
            }
        });
    }
    async ChangeNick(uid, name) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid,
            }
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const checkname = await this.prisma.user.findUnique({
            where: {
                login: name,
            }
        });
        if (checkname) {
            throw new common_1.ConflictException(name + ' is already taken');
        }
        await this.prisma.user.update({
            data: {
                login: name
            },
            where: {
                id: uid,
            }
        });
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name_changed: {
                    increment: 1
                }
            }
        });
    }
    async GetUserStatus(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.userStatus;
    }
    async GetUserFriendlist(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.friendList;
    }
    async GetUserFriendRequestsReceived(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.FriendRequestsReceived;
    }
    async GetUserFriendRequestsSent(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.FriendRequestsEmitted;
    }
    async CancelRequest(uid, name) {
        const friend = await this.prisma.user.findUnique({
            where: {
                login: name
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const friendrequestsemitted = user.FriendRequestsEmitted;
        const friendrequestsreceived = friend.FriendRequestsReceived;
        const newfriendrequestsreceived = [];
        for (const i of friendrequestsreceived) {
            if (i != uid)
                newfriendrequestsreceived.push(i);
        }
        const newfriendrequestsemitted = [];
        for (const j of friendrequestsemitted) {
            if (j != friend.id)
                newfriendrequestsemitted.push(j);
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                FriendRequestsEmitted: newfriendrequestsemitted
            }
        });
        await this.prisma.user.update({
            where: {
                login: name,
            },
            data: {
                FriendRequestsReceived: newfriendrequestsreceived
            }
        });
        await this.prisma.user.update({
            where: {
                id: uid
            },
            data: {
                cancelled_count: {
                    increment: 1
                }
            }
        });
    }
    async RefuseRequest(uid, id) {
        const friend = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        const friendemitted = friend.FriendRequestsEmitted;
        const newfriendemitted = [];
        for (const i of friendemitted) {
            if (i != uid)
                newfriendemitted.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                FriendRequestsEmitted: newfriendemitted
            }
        });
        const userreceived = user.FriendRequestsReceived;
        const newuserreceived = [];
        for (const i of userreceived) {
            if (i != id)
                newuserreceived.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                FriendRequestsReceived: newuserreceived
            }
        });
        await this.prisma.user.update({
            where: {
                id: uid
            },
            data: {
                refused_count: {
                    increment: 1
                }
            }
        });
    }
    async AcceptRequest(uid, id) {
        const friend = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        await this.prisma.user.update({
            data: {
                friendList: {
                    push: uid
                }
            },
            where: {
                id: id,
            }
        });
        await this.prisma.user.update({
            data: {
                friendList: {
                    push: id
                }
            },
            where: {
                id: uid,
            }
        });
        const friendemitted = friend.FriendRequestsEmitted;
        const newfriendemitted = [];
        for (const i of friendemitted) {
            if (i != uid)
                newfriendemitted.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                FriendRequestsEmitted: newfriendemitted
            }
        });
        const friendreceived = friend.FriendRequestsReceived;
        const newfriendreceived = [];
        for (const i of friendreceived) {
            if (i != uid)
                newfriendreceived.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                FriendRequestsReceived: newfriendreceived
            }
        });
        const useremitted = user.FriendRequestsEmitted;
        const newuseremitted = [];
        for (const i of useremitted) {
            if (i != id)
                newuseremitted.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                FriendRequestsEmitted: newuseremitted
            }
        });
        const userreceived = user.FriendRequestsReceived;
        const newuserreceived = [];
        for (const i of userreceived) {
            if (i != id)
                newuserreceived.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                FriendRequestsReceived: newuserreceived
            }
        });
    }
    async AddFriend(uid, userName) {
        const friend = await this.prisma.user.findUnique({
            where: {
                login: userName
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        else if (user.login === friend.login) {
            throw new common_2.NotFoundException('You cannot add yourself to your friend list');
        }
        const friendlist = user.friendList;
        for (const i of friendlist) {
            {
                if (i == friend.id)
                    throw new common_1.ConflictException(friend.login + " is already a friend");
            }
        }
        const friendrequests = user.FriendRequestsEmitted;
        for (const i of friendrequests) {
            {
                if (i == friend.id)
                    throw new common_1.ConflictException(friend.login + " has already been added");
            }
        }
        await this.prisma.user.update({
            data: {
                FriendRequestsEmitted: {
                    push: friend.id
                }
            },
            where: {
                id: uid,
            }
        });
        await this.prisma.user.update({
            data: {
                FriendRequestsReceived: {
                    push: user.id
                }
            },
            where: {
                id: friend.id,
            }
        });
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                friends_added: {
                    increment: 1
                }
            }
        });
    }
    async RemoveFriend(uid, userId) {
        const newfriendlist = [];
        const newfriendlist2 = [];
        const friend = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const friendlist = user.friendList;
        for (const i of friendlist) {
            if (i != userId)
                newfriendlist.push(i);
        }
        const friendlist2 = friend.friendList;
        for (const i of friendlist2) {
            if (i != uid)
                newfriendlist2.push(i);
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                friendList: newfriendlist
            }
        });
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                friendList: newfriendlist2
            }
        });
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                friends_removed: {
                    increment: 1
                }
            }
        });
    }
    async uploadFile(uid, file) {
        if (!file) {
            console.log("unrecognized file");
            return;
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                avatar: file['filename']
            }
        });
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                picture_changed: {
                    increment: 1
                }
            }
        });
    }
    validate_extension(ext) {
        if (ext != '.png' && ext != '.jpeg' && ext != '.jpg' && ext != '.gif')
            return false;
        return true;
    }
    async getelo(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.elo;
    }
    async updateUserElo(uid, elo) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                elo: elo
            }
        });
    }
    async getlogin(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.login;
    }
    async get2faenabled(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.is2faenabled;
    }
    async get2favalidated(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        return user.is2favalidated;
    }
    async validate2FA(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                is2favalidated: true
            }
        });
    }
    async switch2fa(uid, activate) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                is2faenabled: activate['activated']
            }
        });
    }
    async verify2facode(uid, code) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const CodeMatches = await argon.verify(user.twofacode, code);
        if (!CodeMatches)
            throw new common_1.ForbiddenException("Wrong code");
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                is2favalidated: true
            }
        });
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                twofa_used: 1
            }
        });
        return true;
    }
    async get2facode(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        if (user.twofacode) {
            return user.twofacode;
        }
    }
    generateRandom6digitCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async logout(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        if (user.is2faenabled) {
            await this.prisma.user.update({
                where: {
                    id: uid,
                },
                data: {
                    is2favalidated: false
                }
            });
        }
        await this.prisma.user.update({
            where: {
                id: uid
            },
            data: {
                quit_count: {
                    increment: 1
                }
            }
        });
    }
    async updateSearches(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: {
                id: uid
            },
            data: {
                profiles_searched: {
                    increment: 1
                }
            }
        });
    }
    async achievements(uid) {
        const res = [];
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_2.NotFoundException('User not found');
        }
        const messages = await this.prisma.message.findMany({
            where: {
                userId: user.id,
            },
        });
        res.push(user.api_used);
        res.push(user.twofa_used);
        res.push(user.quit_count);
        res.push(messages.length);
        res.push(user.friends_added);
        res.push(user.friendList.length);
        res.push(user.friends_removed);
        res.push(user.name_changed);
        res.push(user.picture_changed);
        res.push(user.profiles_searched);
        res.push(user.gameHistory.length);
        res.push(user.gamesWon);
        res.push(user.gameHistory.length - user.gamesWon);
        res.push(0);
        res.push(user.cancelled_count);
        res.push(user.refused_count);
        return res;
    }
    async findAllByLogin(login) {
        const users = await this.prisma.user.findMany({
            where: {
                login: {
                    contains: login.toLowerCase()
                },
            },
        });
        return users;
    }
    async allUser() {
        return await this.prisma.user.findMany();
    }
};
exports.UserService = UserService;
__decorate([
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateUserStatus", null);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map