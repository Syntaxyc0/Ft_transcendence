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
    async getUserFromLogin(login) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login
            },
        });
        if (!user) {
            throw new common_2.NotFoundException("User not found");
        }
        return user;
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
    async AddFriend(uid, userName) {
        const friend = await this.prisma.user.findUnique({
            where: {
                login: userName
            },
        });
        if (!friend) {
            throw new common_2.NotFoundException('User not found');
        }
        console.log(friend.email);
        await this.mail.sendEmail(friend.email, 'transcendance 2FA', `Please enter this code : 123456`);
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
        await this.prisma.user.update({
            data: {
                friendList: {
                    push: friend.id
                }
            },
            where: {
                id: uid,
            }
        });
    }
    async RemoveFriend(uid, userId) {
        const newfriendlist = [];
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
        await this.prisma.user.update({
            where: {
                id: uid,
            },
            data: {
                friendList: newfriendlist
            }
        });
    }
    async uploadFile(uid, file) {
        console.log(file);
        if (file.size > 1000000) {
            console.log("file is too big");
            console.log(file.size);
            return;
        }
        else if (!this.validate_extension(path.extname(file.filename))) {
            console.log('Wrong file extension');
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
                avatar: file['originalname']
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
        if (activate['activated'] == true) {
            const code = this.generateRandom6digitCode();
            await this.prisma.user.update({
                where: {
                    id: uid,
                },
                data: {
                    twofacode: code
                }
            });
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
        if (user.twofacode !== code) {
            throw new common_1.BadRequestException('Wrong code provided');
        }
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