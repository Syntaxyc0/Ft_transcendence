import { GameBoardComponent, HEIGHT, WIDTH } from "../game-board/game-board.component";
import { Paddle } from "./paddle.model";
export class Ball{
	public speed: number = 30;
	public radius: number = 15;
	public angle: number =  Math.random() * 360;
	public x: number = 0
	public y: number = 0

	public targetX!:number;
	public targetY!:number;

	constructor(public context: CanvasRenderingContext2D, public gameBoard: GameBoardComponent)
	{
		// this.reset();
	}
	reset(angle: number, x: number, y: number)
	{
		this.x = x;
		this.y = y;
		this.targetX = x;
		this.targetY = y;
		this.angle = angle;
	}
	
	newPos(angle: number, x: number, y: number)
	{
		console.log("x: " + x + " y: " + y)
		this.targetX += x;
		this.targetY += y;
		this.angle = angle;
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