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

	paddleLeft: Paddle;
	paddleRight: Paddle;

	oldTimeStamp: number;
	isGameRunning: boolean;

	movementQueue: { deltaX: number; deltaY: number, angle: number}[] = [];

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.paddleLeft = new Paddle(this.context, this);
		this.paddleRight = new Paddle(this.context, this);
		this.ball = new Ball(this.context);
		this.data = this.player.getData();
		this.data.subscribe((payload: any) =>{
			if (!payload.order)
				return;
			// console.log(payload)
			this.handleOrder(payload.order, payload);
		});
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}

	handleOrder(order:string, payload:any)
	{
		switch(order){
			case "ballCollide":
				this.ball.reset(payload.angle, payload.x, payload.y)
				this.draw()
			break;
			case "ballPosition":
				this.newMovement(payload.angle, payload.x, payload.y)
			break;
			case "ballReset":
				this.ball.reset(payload.angle, payload.x, payload.y)
				this.draw()
			break;
			case "paddlePosition":
				if(!payload.side)
					this.newPaddlePosition(this.paddleLeft, payload.x, payload.y)
				else
					this.newPaddlePosition(this.paddleRight, payload.x, payload.y)
			break;
			case "usersPaddle":
				if (!payload.side)
					this.userPaddle = this.paddleLeft
				else
					this.userPaddle = this.paddleRight
				this.userPaddle.side = payload.side;
			break;
			case "setGameBoard":
				this.ball.speed = payload.speed
				this.ball.x = payload.x
				this.ball.y = payload.y
				this.ball.angle = payload.angle
				this.ball.targetX = this.ball.x
				this.ball.targetY = this.ball.y
				this.draw()
			break;
			case "startGame":
				this.startGame()
			break;
			case "stopGame":
				this.stopGame()
			break;
		}
	}

	newMovement(angle: number, deltaX: number, deltaY: number)
	{
		this.movementQueue.push({ deltaX: deltaX, deltaY: deltaY, angle: angle});
	}

	applyMovement(movement: { deltaX: number; deltaY: number, angle: number}, secondsPassed: number)
	{
		this.ball.x += movement.deltaX
		this.ball.y += movement.deltaY
		this.ball.angle += movement.angle
	}

	gameLoop()
	{
		if (!this.isGameRunning)
			return
		const timeStamp = Date.now();
		const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
		this.movementQueue.forEach((movement) => {
			this.applyMovement(movement, secondsPassed);
		  });
		this.movementQueue = [];
		this.oldTimeStamp = timeStamp
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
		this.paddleLeft.draw();
		this.paddleRight.draw();
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
		const top = HEIGHT - PADDLE_HEIGHT
		const bottom = PADDLE_HEIGHT

		if(paddle && paddle.y < top && (event == 'ArrowDown' || event == 's'))
		{
			// paddle.targetY = paddle.y + paddle.step
			paddle.y += paddle.step
			this.player.newPaddlePosition({x: paddle.x, y: paddle.y, side: paddle.side})

		}
		if(paddle && paddle.y > bottom && (event == 'ArrowUp' || event == 'w'))
		{
			// paddle.targetY = paddle.y - paddle.step
			paddle.y -= paddle.step
			this.player.newPaddlePosition({x: paddle.x, y: paddle.y, side: paddle.side})
		}
	}

	newPaddlePosition(paddle: Paddle, x: number, y: number)
	{
		paddle.x = x;
		paddle.y = y;
	}

  }