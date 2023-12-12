import { Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {GameInfoDto } from './dto/GameInfor.dto';
import { GameService } from './game.service';
import { Player } from './interfaces/player.interface';

@Controller('game')
export class GameController {

	constructor(private gameService : GameService) {}

	// @Get()
	// async findAll(): Promise<Player[]>{
	// 	console.log("findAll")
	// 	return this.gameService.findAll();
	// }

	// @Post()
	// async create(@Body() createPlayerDto: CreatePlayerDto){
	// 	console.log("create")
	// 	this.gameService.create(createPlayerDto);
	// }
	
	@Post('newgame')
	newGame(@Body() dto: GameInfoDto){
		console.log(dto);
        return this.gameService.newgame(dto);
    }

	@Get(':uid/GameHistory')
	getGameHistory(@Param('uid', ParseIntPipe) uid: number){
        return this.gameService.getGameHistory(uid);
    }

	@Get(":gid/info")
	getGameInfo(@Param('gid', ParseIntPipe) gid: number){
        return this.gameService.getGameInfo(gid);
    }
}
