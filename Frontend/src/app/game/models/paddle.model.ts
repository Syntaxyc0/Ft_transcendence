import { GameBoardComponent, WIDTH } from "../game-board/game-board.component";

export const PADDLE_HEIGHT = 150

export class Paddle{

	velocity!:number;
	acceleration!:number;
	deceleration!: number;
	step: number = 20;

	height: number = 150;
	width: number = 25;

	x!: number;
	y!: number;
	targetY: number;

	score: number = 0;
	side: number;

	constructor( public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		// if (!currentUser)
		// 	this.x = WIDTH - this.width;
		// else
		// 	this.x = 0;
	}


// 	updatePosition(secondsPassed: number): void {
// 		const direction = Math.sign(this.targetY - this.y);
// 		if (this.y !== this.targetY) {
		  
// 		  this.velocity += this.acceleration * direction * secondsPassed;
// 		//   console.log(direction + " " + this.acceleration * direction * secondsPassed)
// 		}
	
// 		// Apply deceleration when close to the target
// 		if (Math.abs(this.targetY - this.y) < 1) {
// 		  this.velocity *= Math.pow(this.deceleration, secondsPassed);
// 		}
// 	}
	  

	draw(){
		this.context.fillStyle = 'red';
		this.context.fillRect(this.x, this.y - this.height/2, this.width, this.height);
		this.context.fillRect(this.x, this.y - this.height/2, this.width, this.height);
	}

// 	newMultiPos(x: number, y: number)
// 	{
// 		this.x = x;
// 		this.targetY = y;
// 	}

// 	reset()
// 	{
// 		this.acceleration = 1000
// 		this.deceleration = 1000
// 		this.velocity = 10;
// 		this.step = 20;
// 		this.y = this.gameBoard.height / 2;
// 		this.score = 0;
// 		this.targetY = this.y
// 	}
}