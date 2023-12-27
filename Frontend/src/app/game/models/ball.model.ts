import { GameBoardComponent, HEIGHT, WIDTH } from "../game-board/game-board.component";
import { Paddle } from "./paddle.model";
export class Ball{
	public speed: number;
	public radius: number = 15;
	public angle: number;
	public x: number = 0
	public y: number = 0

	movementQueue: { deltaX: number; deltaY: number, angle: number}[] = [];

	public targetX!:number;
	public targetY!:number;

	constructor(public context: CanvasRenderingContext2D)
	{

	}
	reset(angle: number, x: number, y: number)
	{
		this.x = this.targetX + x;
		this.y = this.targetY + y;
		this.targetX = this.x;
		this.targetY = this.y;
		this.angle += angle;
	}
	
	newPos(angle: number, deltaX: number, deltaY: number)
	{

		// this.targetX += x;
		// this.targetY += y;
		// this.angle += angle;

	}

	
	draw()
	{
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.context.fillStyle = 'blue';
		this.context.fill();
		this.context.closePath();
	}
}