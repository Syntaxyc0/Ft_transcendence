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
	currentLead: boolean = true;
	// private isPageVisible: boolean = true;
	otherVisible: boolean = false;

	data: Observable<any>;
	oldTimeStamp = 0;


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
			// console.log(payload.order)
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
			case "changeLead":
				this.currentLead = !this.currentLead;
				this.firstPlayer.gameRequest("leadChanged")
				console.log("changeLead: " + this.currentLead)
			break;
			case "leadChanged":
				this.currentLead = !this.currentLead;
				console.log("LeadChanged: " + this.currentLead)
			break;
			case "visibleChange":
				this.otherVisible = !this.otherVisible;
				console.log("otherVisible: " + this.otherVisible)
			break;
			case "giveData":
				this.sendData();break;
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
		this.currentLead = true;
		this.stopGame();
		this.requestedMatchmaking = false;
		this.paddleLeft.currentUser = true;
		this.paddleRight.currentUser = false;
		this.reset(false);
	}

	newPlayer(first:boolean)
	{
		this.currentLead = first;
		this.paddleLeft.currentUser = first;
		this.paddleRight.currentUser = !first;
		this.isOnline = true;
		this.requestedMatchmaking = false;
		if (document.visibilityState === 'visible')
			this.changeVisibility(!this.otherVisible && !this.currentLead)
		this.reset(true);
		this.sendBall();
	}

	changeVisibility(condition: boolean)
	{
		this.firstPlayer.gameRequest("visibleChange")
		if (condition)
			this.firstPlayer.gameRequest("changeLead")
	}

	@HostListener('document:visibilitychange', ['$event'])
	onVisibilityChange(event: Event): void {
		if (document.visibilityState === 'visible')
				this.changeVisibility(!this.otherVisible && !this.currentLead)

		else
			this.changeVisibility(this.otherVisible && this.currentLead)
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
		if (!this.currentLead)
		{
			if (request)
				this.firstPlayer.gameRequest("resetRequest");
			return;
		}
		this.ball.reset();
		this.draw();
		this.sendBall();
		this.sendScore();
		this.firstPlayer.gameRequest("resetDone");
	}

	startGame(request: boolean) {
		if (this.isGameRunning)
			return;
		this.isGameRunning = true;
		if (request)
			this.firstPlayer.gameRequest("startGame");
		this.oldTimeStamp = Date.now()
		this.gameLoop();
	}

	stopGame() {
		this.isGameRunning = false;
		this.firstPlayer.gameRequest("stopGame");
	}

	gameLoop()
	{
		if(!this.isGameRunning)
			return;
		const timeStamp = Date.now();
		const secondsPassed = Math.min((timeStamp - this.oldTimeStamp)/1000, 0.1);
		// secondsPassed = Math.min(secondsPassed, 0.1);
		this.oldTimeStamp = timeStamp;

		this.paddleLeft.y = this.lerp(this.paddleLeft.y, this.paddleLeft.targetY, 25 * secondsPassed)
		this.paddleRight.y = this.lerp(this.paddleRight.y, this.paddleRight.targetY, 25 * secondsPassed)
		this.ball.updatePosition();
		this.ball.x = this.lerp(this.ball.x, this.ball.targetX, this.ball.speed * secondsPassed)
		this.ball.y = this.lerp(this.ball.y, this.ball.targetY, this.ball.speed * secondsPassed)
		this.draw();
		requestAnimationFrame(this.gameLoop);
	}
	private lerp(start: number, end: number, t: number): number {
		return start + t * (end - start);
	  }

	updatePaddle(paddle: Paddle ,secondsPassed: number){
		// this.paddleLeft.x += (1000 * secondsPassed)
		const diff = (paddle.targetY - paddle.y)
		// paddle.y += (diff * secondsPassed)
		if (diff > 0)
		{
			console.log(paddle.y + " " + diff)
			if (diff < 750)
				paddle.y -= (diff * secondsPassed)
			else
				paddle.y -= (750 * secondsPassed)
		}
		else if (paddle.targetY > paddle.y)
		{
			paddle.y += (750 * secondsPassed)
		}
	}

	// updateBall(secondsPassed: number)
	// {
	// 	if (this.ball.targetX > this.ball.x)
	// 		this.ball.x += (750 * secondsPassed)
	// 	else if (this.ball.targetX < this.ball.x)
	// 		this.ball.x -= (750 * secondsPassed)
	// }


	sendData()
	{
		this.sendBall()
		this.sendPaddle()
		this.sendScore()
	}

	sendScore()
	{
		if (this.currentLead)
			this.firstPlayer.newScore(this.paddleLeft.score, this.paddleRight.score);
	}

	beOtherPlayer(){
		this.paddleLeft.currentUser = !this.paddleLeft.currentUser;
		this.paddleRight.currentUser = !this.paddleRight.currentUser;
	}

	sendBall()
	{
		if (this.currentLead)
			this.firstPlayer.newBallPos(this.ball.angle, this.ball.x, this.ball.y);
	}

	sendPaddle()
	{
		this.firstPlayer.newPaddlePos(this.paddleLeft.x, this.paddleLeft.targetY);
		this.firstPlayer.newPaddlePos(this.paddleRight.x, this.paddleRight.targetY);
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
		const top = this.height - paddle.height
		const bottom = paddle.height
		if(paddle && paddle.y < top && (event == 'ArrowDown' || event == 's'))
		{
			paddle.targetY = paddle.y + paddle.speed
			this.firstPlayer.newPaddlePos(paddle.x, paddle.targetY);
		}
		if(paddle && paddle.y > bottom && (event == 'ArrowUp' || event == 'w'))
		{
			paddle.targetY = paddle.y - paddle.speed
			this.firstPlayer.newPaddlePos(paddle.x, paddle.targetY);

		}
	}

}