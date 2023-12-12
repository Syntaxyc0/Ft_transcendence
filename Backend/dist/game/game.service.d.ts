import { GameInfoDto } from './dto/GameInfor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class GameService {
    private prisma;
    constructor(prisma: PrismaService);
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
