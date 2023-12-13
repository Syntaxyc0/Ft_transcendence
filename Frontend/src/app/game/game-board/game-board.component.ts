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
	paddleLeft: Paddle;
	paddleRight: Paddle;

	isGameRunning: false;

	ngOnInit(): void {
		this.context = this.gameCanvas.nativeElement.getContext('2d');
		this.data = this.player.getData();
		this.data.subscribe((payload: any) =>{
			if (!payload.order)
				return;
			console.log(payload.order)
			this.handleOrder(payload.order, payload);
		});
		this.gameLoop = this.gameLoop.bind(this);
		requestAnimationFrame(this.gameLoop);
	}

	gameLoop()
	{
		this.draw();
		requestAnimationFrame(this.gameLoop);
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

	handleOrder(order:string, payload:any)
	{
		switch(order){
			

		}
	}

  }