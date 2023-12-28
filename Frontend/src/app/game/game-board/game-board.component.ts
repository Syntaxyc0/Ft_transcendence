import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { PADDLE_HEIGHT, Paddle } from '../models/paddle.model';
import { Ball } from '../models/ball.model';
import { Socket } from 'socket.io-client';
import { SocketDataService } from 'src/app/game/game-board/socket-data.service';
import { Observable, first } from 'rxjs';
import { CommonModule } from '@angular/common';

export const WIDTH = 1000
export const HEIGHT = 640 

@Component({
	selector: 'app-game-board',
	standalone: true,
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
	providers:[],
	imports: [CommonModule]
  })

  export class GameBoardComponent implements OnInit{

	@ViewChild('canvas', {static: true}) gameCanvas!: ElementRef;
	context!: CanvasRenderingContext2D;

	constructor(private player: SocketDataService) {}

	data: Observable<any>;
	
	ball: Ball;

	userPaddle: Paddle;
    paddles: Paddle[] = [];

	oldTimeStamp: number;
	isGameRunning: boolean;

	movementQueue: { deltaX: number; deltaY: number, angle: number}[] = [];

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');

        this.paddles.push(new Paddle(this.context))
        this.paddles.push(new Paddle(this.context))

		this.ball = new Ball(this.context);
		this.data = this.player.getData();
		this.data.subscribe((payload: any) =>{
			if (!payload.order)
				return;
			this.handleOrder(payload.order, payload);
		});
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}

	handleOrder(order:string, payload:any)
	{
		switch(order){
			case "ballPosition":
				this.newMovement(payload.angle, payload.x, payload.y)
			break;
			case "ballReset":
				this.movementQueue = []
				this.ball.reset(payload.angle, payload.x, payload.y)
			break;
			case "resetPaddle":
				this.paddles[payload.side].reset(payload.x, payload.y)
			break;
			case "paddlePosition":
				this.paddles[payload.side].newPosition(payload.y)
			break;
			case "usersPaddle":
				this.userPaddle = this.paddles[payload.side]
				this.userPaddle.side = payload.side;
			break;
			case "setGameBoard":
				this.ball.speed = payload.speed
				this.draw()
			break;
			case "startGame":
				this.startGame()
			break;
			case "stopGame":
				this.stopGame()
			break;
			case "newScore":
				this.paddles[payload.side].score++
			break;
		}
	}

	newMovement(angle: number, deltaX: number, deltaY: number)
	{
		this.movementQueue.push({ deltaX: deltaX, deltaY: deltaY, angle: angle});
	}

	applyMovement(movement: { deltaX: number; deltaY: number, angle: number}/*, secondsPassed: number*/)
	{
		this.ball.x += movement.deltaX
		this.ball.y += movement.deltaY
		this.ball.angle += movement.angle
	}

	log()
	{
		console.log(" ************* ")
		this.player.sendRequest("logRequest")
		this.paddles.forEach((paddle) => {
			console.log("paddle " + paddle.side)
			console.log("x: " + paddle.x + " / y: " + paddle.y + " / targetY: " + paddle.targetY)
			console.log(" -------------------------- ")
		})
		console.log("ball: x: " + this.ball.x + " / y: " + this.ball.y)
		console.log(" ************* ")

	}

	gameLoop()
	{
		if (!this.isGameRunning)
			return
		// const timeStamp = Date.now();
		// const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
		let y = this.lerp(this.userPaddle.y, this.userPaddle.targetY, 0.3)
		this.player.newPaddlePosition({y: y - this.userPaddle.y, side: this.userPaddle.side})
		this.userPaddle.y = y;
		this.movementQueue.forEach((movement) => {
			this.applyMovement(movement);

		  });
		this.movementQueue = [];
		// this.oldTimeStamp = timeStamp
		this.draw();
		requestAnimationFrame(this.gameLoop);

	}

	private lerp(start: number, end: number, t: number): number {
		return start + t * (end - start);
	  }

	draw()
	{
		this.context.fillStyle = 'black';
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.context?.fillRect(0, 0, WIDTH, HEIGHT);
		this.ball.draw();
		this.paddles[0].draw();
		this.paddles[1].draw();
	}

	multiplayerRequest()
	{
		this.player.sendRequest("multiplayerRequest")
	}

	drawBoard()
	{
		this.ball.draw()
		this.context.fillStyle = 'black';
		this.context.clearRect(0, 0, WIDTH, HEIGHT);
		this.context?.fillRect(0, 0, WIDTH, HEIGHT);
	}

	startGame() {
		this.isGameRunning = true;
		this.oldTimeStamp = Date.now()
		this.gameLoop();
	}

	stopGame()
	{
		this.isGameRunning = false;
		this.paddles[0].score = 0;
		this.paddles[1].score = 0;
		this.drawBoard()
	}

	disconnect()
	{
		this.player.sendRequest("disconnectingClient")
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent)
	{
		if (!this.isGameRunning)
			return; 
		event.preventDefault();
		this.updatePaddlePosition(this.userPaddle, event.key)
	}

	updatePaddlePosition(paddle: Paddle, event: string)
	{
		const top = HEIGHT - (PADDLE_HEIGHT / 2)
		const bottom = PADDLE_HEIGHT / 2

		if (!paddle)
			return;
		if((event == 'ArrowDown' || event == 's'))
		{
			if (paddle.y + paddle.step < top)
				paddle.targetY = paddle.y + paddle.step
			else
				paddle.targetY = top

		}
		if((event == 'ArrowUp' || event == 'w'))
		{
			if (paddle.y - paddle.step > bottom)
				paddle.targetY = paddle.y - paddle.step
			else
				paddle.targetY = bottom
		}
	}

  }

  // this.paddles.forEach((paddle) => {
		// 	let y = this.lerp(
		// 		paddle.y,
		// 		paddle.targetY,
		// 		0.3
		// 	);
		// 	this.player.newPaddlePosition({y: y - paddle.y, side: paddle.side})
		// 	paddle.y = y

		// })