import { WIDTH, HEIGHT } from "../game.service";
import { MultiplayerService } from "../services/multiplayer.service";

export class Paddle{
    velocity!:number;
	acceleration!:number;
	deceleration!: number;
	step!: number;

	height: number = 150;
	width: number = 25;

	x: number = 0;
	y!: number;
	targetY: number;

	score: number = 0;

    constructor(public side: number)
	{
        this.reset()
        if (side)
			this.x = WIDTH - this.width;
		else
			this.x = 0;
	}

    reset()
	{
		this.acceleration = 1000
		this.deceleration = 1000
		this.velocity = 10;
		this.step = 20;
		this.y = HEIGHT / 2;
		this.score = 0;
		this.targetY = this.y
	}

}

export class Ball{
    x: number
    y: number
    angle: number = Math.random() * 360;
    speed: number;
    radius: number = 15;

    targetX: number;
    targetY: number;

	

    constructor(private multiplayer: MultiplayerService){
        this.reset()
    }
	
    reset()
	{
		this.speed = 30;
		this.x = WIDTH / 2;
		this.y = HEIGHT / 2;
		this.angle = Math.random() * 360;
		while((this.angle >= 75 && this.angle <= 105) || (this.angle >= 255 && this.angle <= 285) )//|| (this.angle >= 0 && this.angle <= 15)
			this.angle = Math.random() * 360;
		this.targetX = this.x;
		this.targetY = this.y;
	}

		calculateReflectionAngle(ballY: number, paddleHeight: number, minAngle: number, maxAngle: number){
		const relativePosition = ballY / paddleHeight;
		const newAngle = minAngle + (maxAngle - minAngle) * relativePosition;
		return newAngle;
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
		// console.log("allo3")
		this.multiplayer.ballData(this)

	}

	xIsColliding(paddleRight: Paddle, paddleLeft: Paddle, x: number) : number
	{
		console.log("paddleLeft: " + paddleLeft.width + paddleLeft.x)
		console.log("paddleRight: " + paddleRight.x)
		console.log("x: " + x)

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

	updatePosition(paddleLeft: Paddle, paddleRight: Paddle)
	{
		let hx: number = Math.cos((this.angle * Math.PI) / 180) * this.speed  + this.x;
		let hy: number = Math.sin((this.angle * Math.PI) / 180) * this.speed  + this.y;

		const bottom = this.radius;
		const top = HEIGHT - this.radius;

		const left = this.radius;
		const right = WIDTH - this.radius;
		console.log(hx + " " + hy)

		let playerColliding = this.xIsColliding(paddleRight, paddleLeft, hx)
		console.log(playerColliding)
		if (playerColliding != 0){
			if (playerColliding == 1 && this.yIsColliding(paddleRight, hy))
				return this.updateCollide(paddleRight, hy, hx, playerColliding)
			else if (this.yIsColliding(paddleLeft, hy) && playerColliding == -1)
				return this.updateCollide(paddleLeft, hy, hx, playerColliding)
		}
		if (hx < right && hx > left && hy < top && hy > bottom)
		{
			this.x = hx;
			this.y = hy;
			return;
		}
		if (hx <= left || hx >= right)
		{
			if (hx <= left)
				paddleRight.score++;
			else
				paddleLeft.score++;
			this.reset();
			this.multiplayer.ballData(this)
		}
		if (hy <= bottom || hy >= top)
		{

			this.angle = (-this.angle);
			this.multiplayer.ballData(this)

		}
	
	}
}