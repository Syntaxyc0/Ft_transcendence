import { GameBoardComponent, HEIGHT, WIDTH } from "../game-board/game-board.component";
import { Paddle } from "./paddle.model";
export class Ball{
	public speed!: number;
	public radius: number = 15;
	public angle: number =  Math.random() * 360;
	public x!: number;
	public y!: number;

	public targetX!:number;
	public targetY!:number;
	constructor(public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		// this.reset();
	}
	
// 	newMultiPos(angle: number, x: number, y: number)
// 	{
// 		this.angle = angle;
// 		this.x = x;
// 		this.y = y;
// 	}

	updatePosition()
	{
		let hx: number = Math.cos((this.angle * Math.PI) / 180) + this.x;
		let hy: number = Math.sin((this.angle * Math.PI) / 180)  + this.y;

		const bottom = this.radius;
		const top = HEIGHT - this.radius;

		const left = this.radius;
		const right = WIDTH - this.radius;

		let playerColliding = this.xIsColliding(this.gameBoard.paddleRight, this.gameBoard.paddleLeft, hx)
		if (playerColliding != 0){
			if (playerColliding == 1 && this.yIsColliding(this.gameBoard.paddleRight, hy))
				return this.updateCollide(this.gameBoard.paddleRight, hy, hx, playerColliding)
			else if (this.yIsColliding(this.gameBoard.paddleLeft, hy) && playerColliding == -1)
				return this.updateCollide(this.gameBoard.paddleLeft, hy, hx, playerColliding)
		}
		if (hx < right && hx > left && hy < top && hy > bottom)
		{
			// this.x = hx;
			// this.y = hy;
			this.targetX = hx;
			this.targetY = hy;
			return;
		}
			if (hx <= left || hx >= right)
			{
				if (hx <= left)
					this.gameBoard.paddleRight.score++;
				else
					this.gameBoard.paddleLeft.score++;
			}
			if (hy <= bottom || hy >= top)
			{
				// this.angle = (-this.angle);
			}
	}
	


	updateCollide(paddle: Paddle, y: number, x: number, playerColliding: number)
	{
		// console.log(this.x)
		if (playerColliding == 1)
			this.angle = this.calculateReflectionAngle(y - (paddle.y - paddle.height / 2), paddle.height, 225, 135);
		else
			this.angle = this.calculateReflectionAngle(y - (paddle.y - paddle.height / 2), paddle.height, -45, 45);
		this.x = paddle.x + (-this.radius) * playerColliding + -playerColliding;
		if (playerColliding == -1)
			this.x += paddle.width;

		// console.log(this.x)
		// this.gameBoard.sendBall()
	}

	xIsColliding(paddleRight: Paddle, paddleLeft: Paddle, x: number) : number
	{
		if(x - this.radius <= paddleLeft.width + paddleLeft.x)
			return -1;
		else if (x + this.radius >= paddleRight.x)
			return 1;
		return 0;
	}

	yIsColliding(paddle: Paddle, y: number): boolean
	{
		let paddleMin = paddle.y - (paddle.height / 2)
		let paddleMax = paddle.y + (paddle.height / 2)

		let ballMin = -this.radius + y
		let ballMax = this.radius + y
		if((ballMax < paddleMax && ballMax > paddleMin) || (ballMin < paddleMax && ballMin > paddleMin))
			return true
		return false
	}

// 	reset()
// 	{
// 		this.speed = 30;
// 		this.x = this.gameBoard.width / 2;
// 		this.y = this.gameBoard.height / 2;
// 		this.angle = Math.random() * 360;
// 		while((this.angle >= 75 && this.angle <= 105) || (this.angle >= 255 && this.angle <= 285) )//|| (this.angle >= 0 && this.angle <= 15)
// 			this.angle = Math.random() * 360;
// 		this.targetX = this.x;
// 		this.targetY = this.y;
// 	}

	draw()
	{
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.context.fillStyle = 'blue';
		this.context.fill();
		this.context.closePath();
	}

	calculateReflectionAngle(ballY: number, paddleHeight: number, minAngle: number, maxAngle: number){
		const relativePosition = ballY / paddleHeight;
		const newAngle = minAngle + (maxAngle - minAngle) * relativePosition;
		return newAngle;
	}
}