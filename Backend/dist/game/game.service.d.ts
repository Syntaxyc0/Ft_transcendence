import { GameInfoDto } from './dto/GameInfor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from './interfaces/player.interface';
export declare class GameService {
    private prisma;
    private readonly players;
    constructor(prisma: PrismaService);
    create(player: Player): void;
    findAll(): Player[];
    newgame(gameinfo: GameInfoDto): Promise<void>;
    getGameHistory(uid: number): Promise<number[]>;
    getGameInfo(id: number): Promise<{
        id: number;
        userId1: number;
        userId2: number;
        scoreUser1: number;
        scoreUser2: number;
        winnerId: number;
    }>;
}
