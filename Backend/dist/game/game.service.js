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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameService = exports.GameService = class GameService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async newgame(gameinfo) {
        const game = await this.prisma.gameInfo.create({
            data: {
                userId1: gameinfo.userId1,
                userId2: gameinfo.userId2,
                scoreUser1: gameinfo.scoreUser1,
                scoreUser2: gameinfo.scoreUser2,
                winnerId: gameinfo.winnerId,
            }
        });
        const user1 = await this.prisma.user.findUnique({
            where: {
                id: gameinfo.userId1
            }
        });
        const user2 = await this.prisma.user.findUnique({
            where: {
                id: gameinfo.userId2
            }
        });
        if (!user1 || !user2)
            throw new common_1.NotFoundException("user not found");
        await this.prisma.user.update({
            where: {
                id: gameinfo.userId1,
            },
            data: {
                gameHistory: {
                    push: game.id
                }
            }
        });
        await this.prisma.user.update({
            where: {
                id: gameinfo.userId2,
            },
            data: {
                gameHistory: {
                    push: game.id
                }
            }
        });
        console.log(game);
    }
    async getGameHistory(uid) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: uid
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.gameHistory;
    }
    async getGameInfo(id) {
        const game = await this.prisma.gameInfo.findUnique({
            where: {
                id: id
            }
        });
        if (!game) {
            throw new common_1.NotFoundException('Game not found');
        }
        return game;
    }
};
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
//# sourceMappingURL=game.service.js.map