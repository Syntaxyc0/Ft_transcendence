import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { Paddle } from '../models/paddle.model';
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
	isOnline: boolean;

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.paddleLeft = new Paddle(this.context, this);
		this.paddleRight = new Paddle(this.context, this);
		this.ball = new Ball(this.context, this);
		this.data = this.player.getData();
		this.data.subscribe((payload: any) =>{
			if (!payload.order)
				return;
			// console.log(payload.order)
			this.handleOrder(payload.order, payload);
		});
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}

	handleOrder(order:string, payload:any)
	{
		switch(order){
			case "ballPosition":
				this.ball.newPos(payload.angle, payload.x, payload.y)
			break;
			case "ballReset":
				this.ball.reset(payload.angle, payload.x, payload.y)
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
			break;
			case "setGameBoard":
				this.isOnline = true
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

	gameLoop()
	{
		if (!this.isGameRunning)
			return
		const timeStamp = Date.now();
		const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
		this.ball.x = this.lerp(this.ball.x, this.ball.targetX, this.ball.speed * secondsPassed)
		this.ball.y = this.lerp(this.ball.y, this.ball.targetY, this.ball.speed * secondsPassed)
		this.oldTimeStamp = timeStamp
		this.draw();
		requestAnimationFrame(this.gameLoop);

	}

	private lerp(start: number, end: number, t: number): number {
		return start + t * (end - start);
	  }

	draw()
	{
		console.log("drawing")
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
		this.isOnline = false
	}

	disconnect()
	{
		this.player.sendRequest("disconnectingClient")
	}

	newPaddlePosition(paddle: Paddle, x: number, y: number)
	{
		paddle.x = x;
		paddle.y = y;
	}

  }