import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { Paddle } from '../models/paddle.model';
import { Ball } from '../models/ball.model';
import { Socket } from 'socket.io-client';
import { SocketDataService } from 'src/app/game/game-board/socket-data.service';
import { Observable, first } from 'rxjs';
import { CommonModule } from '@angular/common';


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

	width: number = 1000;
	height: number = 640;

	paddleLeft!: Paddle;
	paddleRight!: Paddle;
	ball!: Ball;

	isGameRunning: boolean = false;
	requestedMatchmaking = false;
	isOnline = false;

	data: Observable<any>;


	constructor(private firstPlayer: SocketDataService) {}

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.context?.fillRect(0,0 , this.width, this.height);
		this.paddleLeft = new Paddle(true, this.context, this);
		this.paddleRight = new Paddle(false, this.context, this);
		this.ball = new Ball(this.context, this);
		this.data = this.firstPlayer.getData();
		this.data.subscribe((payload: any) =>{
			if (!payload.order)
				return;
			this.handleOrder(payload.order, payload);
		});
		this.reset(false);
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}
	
	handleOrder(order:string, payload: any)
	{
		if (order == "paddleUp")
		{
			if (this.paddleRight.currentUser)
				this.paddleLeft.newMultiPos(payload.x, payload.y);
			else if (this.paddleLeft.currentUser)
				this.paddleRight.newMultiPos(payload.x, payload.y);
		}
		if (order == "ballUp" && !this.paddleLeft.currentUser)
			this.ball.newMultiPos(payload.angle, payload.x, payload.y);
		else if(order == "stopGame")
			this.isGameRunning = false;
		else if (order == "startGame")
			this.startGame(false);
		else if (order == "newPlayer")
			this.newPlayer(payload.first);
		else if (order == "resetRequest")
			this.reset(false);
		else if (order == "resetDone")
		{
			this.reset(false);
			this.draw();
		}
		else if (order == "otherDisconnected")
		{
			this.resetOnline();
			this.multiplayer();
		}
	}

	disconnect()
	{
		this.requestedMatchmaking = false;
		this.firstPlayer.disconnect();
		this.resetOnline();
	}

	resetOnline()
	{
		this.stopGame();
		this.isOnline = false;
		this.paddleLeft.currentUser = true;
		this.paddleRight.currentUser = false;
	}

	newPlayer(first:boolean)
	{
		this.paddleLeft.currentUser = first;
		this.paddleRight.currentUser = !first;
		this.isOnline = true;
		this.requestedMatchmaking = false;
		this.reset(true);
		this.sendBall();
	}

	draw()
	{
		this.context.fillStyle = 'black';
		this.context.clearRect(0, 0, this.width, this.height);
		this.context?.fillRect(0,0 , this.width, this.height);
		this.ball.draw();
		this.paddleLeft.draw();
		this.paddleRight.draw();
	}

	multiplayer(){
		if (this.isOnline)
			return;
		this.requestedMatchmaking = true;
		this.firstPlayer.multiplayerRequest();
	}

	reset(request: boolean) {
		this.stopGame();
		this.paddleLeft.reset();
		this.paddleRight.reset();
		if (!this.paddleLeft.currentUser)
		{
			if (request)
				this.firstPlayer.GameRequest("resetRequest");
			return;
		}
		this.ball.reset();
		this.draw();
		this.sendBall();
		this.firstPlayer.GameRequest("resetDone");
	}

	startGame(request: boolean) {
		if (this.isGameRunning)
			return;
		this.isGameRunning = true;
		if (request)
			this.firstPlayer.GameRequest("startGame");
		this.gameLoop();
	}

	stopGame() {
		this.isGameRunning = false;
		this.firstPlayer.GameRequest("stopGame");
	}

	gameLoop()
	{
		if(!this.isGameRunning)
			return;
		this.ball.updatePosition();
		this.draw();
		requestAnimationFrame(this.gameLoop);
	}

	sendBall()
	{
		if (this.paddleLeft.currentUser)
			this.firstPlayer.newBallPos(this.ball.angle, this.ball.x, this.ball.y);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent)
	{
		event.preventDefault();
		this.startGame(true)
		if(this.paddleLeft.currentUser)
			this.updatePaddlePosition(this.paddleLeft, event.key)
		else if(this.paddleRight.currentUser)
			this.updatePaddlePosition(this.paddleRight, event.key);
	}

	updatePaddlePosition(paddle: Paddle, event: string)
	{
		if(paddle && paddle.y < this.height - paddle.height/2 && (event == 'ArrowDown' || event == 's'))
		{
			paddle.y += paddle.speed;
			this.firstPlayer.newPaddlePos(paddle.x, paddle.y);
		}
		if(paddle && paddle.y > paddle.height/2 && (event == 'ArrowUp' || event == 'w'))
		{
			paddle.y -= paddle.speed;
			this.firstPlayer.newPaddlePos(paddle.x, paddle.y);

		}
	}

}