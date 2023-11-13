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
	score: number = 0;

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
	
	handleOrder(order:string, payload:any)
	{
		switch(order){
			case "paddleUp":
				if (this.paddleRight.currentUser)
				this.paddleLeft.newMultiPos(payload.x, payload.y);
				else if (this.paddleLeft.currentUser)
				this.paddleRight.newMultiPos(payload.x, payload.y);
			break;
			case "ballUp":
				this.ball.newMultiPos(payload.angle, payload.x, payload.y);break;
			case "scoreUp":
				this.paddleLeft.score = payload.leftScore;
				this.paddleRight.score = payload.rightScore;
			break;
			case "stopGame":
				this.isGameRunning = false;break;
			case "startGame":
				this.startGame(false);break;
			case "newPlayer":
				this.newPlayer(payload.first);break;
			case "resetRequest":
				this.reset(false);break;
			case "resetDone":
				this.reset(false);
				this.draw();
			break;
			case "otherDisconnected":
				this.resetOnline();
				this.multiplayer();
			break;
		}
	}

	disconnect()
	{
		this.requestedMatchmaking = false;
		this.resetOnline();
		this.firstPlayer.disconnect();
	}

	resetOnline()
	{
		this.isOnline = false;
		this.stopGame();
		this.requestedMatchmaking = false;
		this.paddleLeft.currentUser = true;
		this.paddleRight.currentUser = false;
		this.reset(false);
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
		this.sendScore();
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

	sendScore()
	{
		if (this.paddleLeft.currentUser)
			this.firstPlayer.newScore(this.paddleLeft.score, this.paddleRight.score);
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