import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { Paddle } from '../models/paddle.model';
import { Ball } from '../models/ball.model';
import { Socket } from 'socket.io-client';
import { SocketDataService } from 'src/app/game/game-board/socket-data.service';
import { Observable, first } from 'rxjs';


@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  providers:[],
})


export class GameBoardComponent implements OnInit{

	@ViewChild('canvas', {static: true}) gameCanvas!: ElementRef;
	context!: CanvasRenderingContext2D;

	width: number = 1000;
	height: number = 640;

	paddleLeft!: Paddle;
	paddleRight!: Paddle;
	ball!: Ball;

	private isGameRunning: boolean = false;

	data: Observable<any>;
	secondPlayer: string;

	constructor(private firstPlayer: SocketDataService) {}

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.context?.fillRect(0,0 , this.width, this.height);
		this.paddleLeft = new Paddle(true, this.context, this);
		this.paddleRight = new Paddle(false, this.context, this);
		this.ball = new Ball(this.context, this);
		this.data = this.firstPlayer.getData();
		this.data.subscribe((payload: any) =>{
			this.handleOrder(payload.order, payload);
		});
		this.reset();
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
		
	}
	
	handleOrder(order:string, payload: any)
	{
		// console.log(order);
		if(order == "stopGame")
			this.isGameRunning = false;
		else if (order == "startGame")
		{
			this.isGameRunning = true;
			this.gameLoop();
		}
		else if (order == "newPlayer" && !this.secondPlayer)
			this.newPlayer(payload.player, payload.first);
		else if (order == "ballUp" && !this.paddleLeft.currentUser)
			this.ball.newMultiPos(payload.angle, payload.x, payload.y);

	}

	newPlayer(secondPlayer: string, first:boolean)
	{
		this.secondPlayer = secondPlayer;
		this.paddleLeft.currentUser = first;
		this.paddleRight.currentUser = !first;
		// console.log("first: " + first);
		this.startGame();
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
			this.firstPlayer.multiplayerRequest();
	}

	moreSpeed() {
		this.paddleLeft.speed *= 1.5;
		this.paddleRight.speed *= 1.5;
		this.ball.speed *= 1.5;
	}

	reset() {
		this.stopGame();
		this.paddleLeft.reset();
		this.paddleRight.reset();
		this.ball.reset();
		this.sendData();
		this.draw();
	}

	startGame() {
		if (this.isGameRunning)
			return;
		this.isGameRunning = true;
		if (this.secondPlayer)
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
		this.draw()
		requestAnimationFrame(this.gameLoop);
	}

	sendData()
	{
		if (this.secondPlayer && this.paddleLeft.currentUser)
			this.firstPlayer.newBallPos(this.secondPlayer, this.ball.angle, this.ball.posx, this.ball.posy);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent)
	{
		event.preventDefault();
		this.startGame();
		if(this.paddleLeft && this.paddleLeft.posy < this.height - this.paddleLeft.height/2 && (event.key == 'ArrowDown' || event.key == 's'))
			this.paddleLeft.posy += this.paddleLeft.speed;
		if(this.paddleLeft && this.paddleLeft.posy > this.paddleLeft.height/2 && (event.key == 'ArrowUp' || event.key == 'w'))
			this.paddleLeft.posy -= this.paddleLeft.speed;
	}

}