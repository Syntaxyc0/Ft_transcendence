import { Player } from "../models/player.model";
import { Room } from "../models/room.model";
import { Ball, Paddle } from "../models/game-elements.model";
import { Injectable } from "@nestjs/common";

export class MultiplayerService{

   oldtimeStamp : number;


    previousBallState: {x: number, y : number, angle: number};

    constructor(private room: Room){}

    gameRequest(payload: any)
    {
        for (let i: number = 0; i < 2; i++)
            this.room.players[i].socket.emit('onGameRequest', payload)
    }


    ballData(ball: Ball)
    {
        const deltaX = ball.x - this.previousBallState.x
        const deltaY = ball.y - this.previousBallState.y
        const deltaAngle = ball.angle - this.previousBallState.angle

        this.gameRequest({order: "ballPosition", x: deltaX, y: deltaY, angle: deltaAngle})

        this.previousBallState.x = ball.x
        this.previousBallState.y = ball.y
        this.previousBallState.angle = ball.angle
    }

    ballReset(ball: Ball)
    {
        this.gameRequest({order: "ballReset", x: ball.x, y: ball.y, angle: ball.angle})
    }

    paddleData(paddle: {y: number, side: number})
    {
        this.room.paddles[paddle.side].y += paddle.y
        if (paddle.side == 1)
          this.room.players[0].socket.emit("onGameRequest", {order: "paddlePosition", side: paddle.side, y: paddle.y})
        else
          this.room.players[1].socket.emit("onGameRequest", {order: "paddlePosition", side: paddle.side, y: paddle.y})
    }

    paddleReset(paddle: Paddle)
    {
        this.gameRequest({order: "resetPaddle", side: paddle.side, x: paddle.x, y: paddle.y})
    }

    sendScore(side: number)
    {
        this.gameRequest({order: "newScore", side: side})
    }

    gameLoop()
	{
		if (!this.room || !this.room.isGameRunning) {
            return;
        }
        this.room.ball.updatePosition(this.room.paddles)
		this.ballData(this.room.ball)

        setTimeout(() => {
            this.gameLoop();
        }, 1000 / 60);
	}

    gameBoardInit()
    {
        if (!this.room) {
            return;
        }
        this.room.players[0].socket.emit('onGameRequest', {order: 'usersPaddle', side: 0, login: this.room.players[1].login})
        this.room.players[1].socket.emit('onGameRequest', {order: 'usersPaddle', side: 1, login: this.room.players[0].login})
        this.gameRequest({order: "setGameBoard", speed: this.room.ball.speed, x: this.room.ball.x, y: this.room.ball.y, angle: this.room.ball.angle})
        this.room.isGameRunning = true
        this.gameRequest({order: "startGame"})
		this.gameLoop = this.gameLoop.bind(this)
        this.gameLoop()
    }

}