import { GameBoardComponent } from "../game-board/game-board.component";
import { Paddle } from "./paddle.model";
export class Ball{
	public speed!: number;
	public radius: number = 15;
	public angle: number =  Math.random() * 360;
	public x!: number;
	public y!: number;
	constructor(public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		this.reset();
	}
	
	newMultiPos(angle: number, x: number, y: number)
	{
		this.angle = angle;
		this.x = x;
		this.y = y;
	}

	updatePosition()
	{
		let hx: number = Math.cos((this.angle * Math.PI) / 180) * this.speed + this.x;
		let hy: number = Math.sin((this.angle * Math.PI) / 180) * this.speed + this.y;
		if (this.isCollidingPaddle(hx, hy, this.gameBoard.paddleLeft))
		{
			this.angle = this.calculateReflectionAngle(hy - (this.gameBoard.paddleLeft.y - this.gameBoard.paddleLeft.height / 2), this.gameBoard.paddleLeft.height);
			this.x = this.gameBoard.paddleLeft.width + this.radius;
			this.gameBoard.sendBall();
			return;
		}
		if (hx < this.gameBoard.width - this.radius && hx >= this.radius && hy < this.gameBoard.height - this.radius && hy > this.radius)
		{
			this.x = hx;
			this.y = hy;
			return;
		}
		else {
			if (hx <= this.radius || hx >= this.gameBoard.width - this.radius)
			{
				if (hx <= this.radius)
					this.gameBoard.paddleRight.score++;
				else
					this.gameBoard.paddleLeft.score++;
				this.gameBoard.sendScore()
				this.reset();
				this.gameBoard.sendBall();
			}
			if (hy <= this.radius || hy >= this.gameBoard.height - this.radius)
			{
				this.angle = (-this.angle) % 360;
				this.gameBoard.sendBall();
			}
	  	}
	
	}

	isCollidingPaddle(x:number, y:number ,paddle: Paddle) : boolean
	{
		if (x > this.radius + paddle.width)
			return false;
		if (y <= paddle.y + paddle.height / 2 + this.radius && y >= paddle.y - paddle.height / 2 - this.radius)
			return true;
		return false;
	}

	reset()
	{
		this.speed = 30;
		this.x = this.gameBoard.width / 2;
		this.y = this.gameBoard.height / 2;
		this.angle = Math.random() * 360;
		while((this.angle >= 75 && this.angle <= 105) || (this.angle >= 255 && this.angle <= 285) )//|| (this.angle >= 0 && this.angle <= 15)
			this.angle = Math.random() * 360;
	}

	draw()
	{
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.context.fillStyle = 'blue';
		this.context.fill();
		this.context.closePath();
	}

	calculateReflectionAngle(ballY: number, paddleHeight: number): number {
		// Define angle range for mapping (e.g., -45 degrees to 45 degrees)
		const minAngle = -45;  // Angle at the bottom of the paddle
		const maxAngle = 45;   // Angle at the top of the paddle
		const relativePosition = ballY / paddleHeight;
		const newAngle = minAngle + (maxAngle - minAngle) * relativePosition;
	
		return newAngle;
	}
}