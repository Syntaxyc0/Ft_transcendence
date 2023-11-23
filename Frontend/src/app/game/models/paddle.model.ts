import { GameBoardComponent } from "../game-board/game-board.component";

export class Paddle{
	speed!: number;
	height: number = 150;
	width: number = 25;
	x!: number;
	y!: number;
	targetY: number = 0;
	score: number = 0;
	constructor(public currentUser: boolean, public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		if (!currentUser)
			this.x = this.gameBoard.width - this.width;
		else
			this.x = 0;
	}

	draw(){
		this.context.fillStyle = 'red';
		if(!this.currentUser)
			this.context.fillRect(this.x, this.y - this.height/2, this.width, this.height);
		this.context.fillRect(this.x, this.y - this.height/2, this.width, this.height);
	}

	newMultiPos(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}

	reset()
	{
		this.speed = 100;
		this.y = this.gameBoard.height / 2;
		this.score = 0;
	}
}