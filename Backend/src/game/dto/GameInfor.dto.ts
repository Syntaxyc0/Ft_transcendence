import { IsNumber } from "class-validator"
import { Type } from "class-transformer"


export class GameInfoDto {

	@IsNumber()
	@Type(() => Number)
	userId1: number
	
	@Type(() => Number)
	@IsNumber()
	userId2: number
	
	@Type(() => Number)
	@IsNumber()
	scoreUser1: number
	
	@Type(() => Number)
	@IsNumber()
	scoreUser2: number
	
	@Type(() => Number)
	@IsNumber()
	winnerId: number
}