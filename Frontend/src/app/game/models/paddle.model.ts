import { GameBoardComponent } from "../game-board/game-board.component";

export class Paddle{

	velocity!:number;
	acceleration!:number;
	deceleration!: number;
	step!: number;

	height: number = 150;
	width: number = 25;

	x!: number;
	y!: number;
	targetY: number;

	score: number = 0;

	constructor(public currentUser: boolean, public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		if (!currentUser)
			this.x = this.gameBoard.width - this.width;
		else
			this.x = 0;
	}

	updatePosition(secondsPassed: number): void {
		// Accelerate towards the target position:number
		const direction = Math.sign(this.targetY - this.y);
		if (this.y !== this.targetY) {
		  
		  this.velocity += this.acceleration * direction * secondsPassed;
		//   console.log(direction + " " + this.acceleration * direction * secondsPassed)
		}
	
		// Apply deceleration when close to the target
		if (Math.abs(this.targetY - this.y) < 1) {
		  this.velocity *= Math.pow(this.deceleration, secondsPassed);
		}
	
		// Update the position based on velocity

		this.y += this.velocity * secondsPassed;
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
		this.targetY = y;
	}

	reset()
	{
		this.acceleration = 1000
		this.deceleration = 1000
		this.velocity = 20;
		this.step = 5;
		this.y = this.gameBoard.height / 2;
		this.score = 0;
		this.targetY = this.y
	}
}