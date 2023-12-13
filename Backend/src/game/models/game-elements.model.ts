import { WIDTH, HEIGHT } from "../game.service";

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

    constructor(public currentUser: boolean, public context: CanvasRenderingContext2D)
	{
        this.reset()
        if (!currentUser)
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

    constructor(){
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
}