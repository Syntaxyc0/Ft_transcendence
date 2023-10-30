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

	data: Observable<any>;
	secondPlayer: string;
	requestedMatchmaking = false;


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
		this.reset();
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
			this.startGame(true);
		else if (order == "newPlayer" && !this.secondPlayer)
		{
			this.newPlayer(payload.player, payload.first);
			this.sendBall();
		}
		else if (order == "resetRequest")
			this.reset();
		else if (order == "resetDone")
		{
			this.paddleLeft.reset();
			this.paddleRight.reset();
			this.draw();
		}
		else if (order == "otherDisconnected")
			this.resetOnline();
	}

	disconnect()
	{
		this.requestedMatchmaking = false;
		const secondPlayer = this.secondPlayer;
		if (secondPlayer)
		{
			this.secondPlayer = '';
			this.firstPlayer.disconnect(secondPlayer);
			this.resetOnline();
		}
	}

	resetOnline()
	{
		this.stopGame();
		this.secondPlayer = '';
		this.paddleLeft.currentUser = true;
		this.paddleRight.currentUser = false;
		this.reset();
	}

	newPlayer(secondPlayer: string, first:boolean)
	{
		this.secondPlayer = secondPlayer;
		this.paddleLeft.currentUser = first;
		this.paddleRight.currentUser = !first;
		this.reset();
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
		if (!this.secondPlayer)
		{
			this.requestedMatchmaking = true;
			this.firstPlayer.multiplayerRequest();
		}
	}

	reset() {
		this.stopGame();
		if (this.secondPlayer && !this.paddleLeft.currentUser)
		{
			this.firstPlayer.GameRequest("resetRequest", this.secondPlayer);
			return;
		}
		this.paddleLeft.reset();
		this.paddleRight.reset();
		this.ball.reset();
		this.draw();
		this.sendBall();
		if (this.secondPlayer)
			this.firstPlayer.GameRequest("resetDone", this.secondPlayer);
	}

	startGame(request: boolean) {
		if (this.isGameRunning)
			return;
		this.isGameRunning = true;
		if (this.secondPlayer && !request)
			this.firstPlayer.GameRequest("startGame", this.secondPlayer);
		this.gameLoop();
	}

	stopGame() {
		this.isGameRunning = false;
		if (this.secondPlayer)
			this.firstPlayer.GameRequest("stopGame", this.secondPlayer);
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
		if (this.secondPlayer && this.paddleLeft.currentUser)
			this.firstPlayer.newBallPos(this.secondPlayer, this.ball.angle, this.ball.x, this.ball.y);
	}

	sendPaddle(paddle: Paddle)
	{
		if(this.secondPlayer)
		{
				this.firstPlayer.newPaddlePos(this.secondPlayer, paddle.x, paddle.y);
		}
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent)
	{
		event.preventDefault();
		if(this.paddleLeft.currentUser)
		{
			this.startGame(false);
			this.updatePaddlePosition(this.paddleLeft, event.key)
		}
		else if(this.paddleRight.currentUser)
		{
			this.startGame(true);
			this.updatePaddlePosition(this.paddleRight, event.key);
		}
	}

	updatePaddlePosition(paddle: Paddle, event: string)
	{
		if(paddle && paddle.y < this.height - paddle.height/2 && (event == 'ArrowDown' || event == 's'))
		{
			paddle.y += paddle.speed;
			this.sendPaddle(paddle);
		}
		if(paddle && paddle.y > paddle.height/2 && (event == 'ArrowUp' || event == 'w'))
		{
			paddle.y -= paddle.speed;
			this.sendPaddle(paddle);

		}
	}

}