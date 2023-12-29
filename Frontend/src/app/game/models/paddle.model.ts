import { GameBoardComponent, HEIGHT, WIDTH } from "../game-board/game-board.component";

export const PADDLE_HEIGHT = 200
export const PADDLE_WIDTH = 25

export class Paddle{
	step: number = 175;

	x!: number;
	y!: number;
	targetY: number;

	score: number = 0;
	side: number;
	login: string;
	

	constructor( public context: CanvasRenderingContext2D)
	{
	}
	  

	draw(){
		this.context.fillStyle = 'red';
		this.context.fillRect(this.x, this.y - PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT);
		this.context.fillRect(this.x, this.y - PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT);
	}


	reset(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.targetY = y;
	}

	newPosition(y: number)
	{
		this.y += y;
	}
}