import { GameInfoDto } from './dto/GameInfor.dto';
import { GameService } from './game.service';
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    newGame(dto: GameInfoDto): Promise<void>;
    getGameHistory(uid: number): Promise<number[]>;
    getGameInfo(gid: number): Promise<{
        id: number;
        userId1: number;
        userId2: number;
        scoreUser1: number;
        scoreUser2: number;
        winnerId: number;
    }>;
}
