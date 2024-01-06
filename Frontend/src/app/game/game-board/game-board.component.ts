import { Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import { PADDLE_HEIGHT, Paddle } from '../models/paddle.model';
import { Ball } from '../models/ball.model';
import { Socket } from 'socket.io-client';
import { SocketDataService } from 'src/app/game/game-board/socket-data.service';
import { Observable, first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from 'src/app/components/headerbar/headerbar.component';

export const WIDTH = 1000
export const HEIGHT = 640 

@Component({
	selector: 'app-game-board',
	standalone: true,
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
	providers:[],
	imports: [CommonModule, HeaderbarComponent]
  })

  export class GameBoardComponent implements OnInit{

	@ViewChild('canvas', {static: true}) gameCanvas!: ElementRef;
	context!: CanvasRenderingContext2D;

	constructor(private player: SocketDataService) {}

	data: Observable<any>;
	
	ball: Ball;

	userPaddle: Paddle;
    paddles: Paddle[] = [];

	isGameRunning: boolean = false;
	isOnline: boolean = false;
	matchmaking: boolean = false;
	showRules: boolean = false;
	multiWindow: boolean = false;
	// requestOver: boolean = true;

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

		this.player.sendRequest("gameExists")
		console.log("onInit")
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}

	handleOrder(order:string, payload:any)
	{
		if (this.multiWindow == true)
			return;
		switch(order){
			case "ballPosition":
				this.newMovement(payload.angle, payload.x, payload.y)
			break;
			case "ballReset":
				this.movementQueue = []
				this.ball.reset(payload.angle, payload.x, payload.y)
			break;
			case "resetPaddle":
				this.paddles[payload.side].reset(payload.x, payload.y, payload.score)
			break;
			case "paddlePosition":
				this.paddles[payload.side].newPosition(payload.y)
			break;
			case "usersPaddle":
				this.userPaddle = this.paddles[payload.side]
				this.userPaddle.login = this.player.getLogin();
				this.userPaddle.side = payload.side;
				this.paddles[payload.side * -1 + 1].login = payload.login
			break;
			// case "paddleReload":
			// 	console.log("paddleReload: " + payload)
			// 	this.paddles[payload.side].x = payload.x
			// 	this.paddles[payload.side].y = payload.y
			case "multiWindow":
				console.log("Many windows are open!")
				this.multiWindow = true;
				this.drawBoard()
				this.context.font = '30px Arial';
    			this.context.fillStyle = 'white';
				this.context.fillText(`There is another game instance on this profile, you can close this window.`, 10, HEIGHT/2);
			break;
			case "setGameBoard":
				this.matchmaking = false
				this.isOnline = true
				this.draw()
			break;
			case "startGame":
				this.startGame()
			break;
			case "otherDisconnected":
				this.resetOnline()
			break;
			case "stopGame":
				this.stopGame()
			break;
			case "resetBoard":
				this.resetOnline()
				this.drawBoard()
			break;
			case "newScore":
				this.paddles[payload.side].score++
			break;
			case "gameWon":
				this.stopGame()
				this.draw()
				this.context.fillText(`${this.paddles[payload.side].login} WINS`, WIDTH / 2 * payload.side + WIDTH / 6, HEIGHT / 2);
				this.context.fillText(`${this.paddles[payload.side * -1 + 1].login} LOSES`, WIDTH / 2 * (payload.side * -1 + 1) + WIDTH / 6, HEIGHT / 2)
				this.player.sendRequest("gameOver")
				this.disconnect()

			break;
		}
	}

	resetOnline()
	{
		console.log("resetOnline")
		this.isOnline = false
		this.isGameRunning = false;
		this.paddles[0].score = 0;
		this.paddles[1].score = 0;
		this.paddles.forEach((paddle) => {
			paddle.login = undefined
		})
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
		this.player.sendRequest("logRequest")
		console.log(" ************* ")
        for (let i = 0; i < 2; i++)
        {
            console.log("player: " + this.paddles[i].login)
            console.log("paddle " + this.paddles[i].side)
			console.log("x: " + this.paddles[i].x + " / y: " + this.paddles[i].y)
            console.log(" -------------------------- ")
            
        }
		console.log("ball: x: " + this.ball.x + " / y: " + this.ball.y)
		console.log(" ************* ")

	}


	gameLoop()
	{
		if (!this.isGameRunning)
			return
		// const timeStamp = Date.now();
		// const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
		let y = this.lerp(this.userPaddle.y, this.userPaddle.targetY, 0.2)
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
		this.context.font = '30px Arial';
    	this.context.fillStyle = 'white';
    	this.context.fillText(`${this.paddles[0].score} - ${this.paddles[1].score}`, WIDTH / 2 - 50, 50);
	}

	multiplayerRequest()
	{
		if(this.isOnline || this.multiWindow)
			return;
		this.player.sendRequest("gameExists")

		this.player.sendRequest("multiplayerRequest")
		this.matchmaking = true
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
		this.gameLoop();
	}

	stopGame()
	{
		this.isGameRunning = false;
	}

	disconnect()
	{
		// this.player.sendRequest("disconnectingClient")
		if (this.isOnline || this.multiWindow)
			this.player.disconnect(this.userPaddle.side)
		this.resetOnline()
		this.matchmaking = false

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

	showPongRules() {
		console.log(this.showRules)
		this.showRules = true;
	  }
	  
	  closePongRules() {
		this.showRules = false;
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