import { Player } from "../models/player.model";
import { Room } from "../models/room.model";
import { Ball, Paddle } from "../models/game-elements.model";

export class MultiplayerService{

    lastFrameTime: number = 0;
    deltaTime: number = 0;

    constructor(private room: Room){}

    gameRequest(payload: any)
    {
        for (let i: number = 0; i < 2; i++)
            this.room.players[i].socket.emit('onGameRequest', payload)
    }

    ballData(ball: Ball)
    {
        this.gameRequest({order: "ballPosition", x: ball.x, y: ball.y, angle: ball.angle})
    }

    gameLoop()
	{
		if (!this.room || !this.room.isGameRunning) {
            return;
        }
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.lastFrameTime;
        this.room.ball.updatePosition(this.room.paddleLeft, this.room.paddleRight)
		this.ballData(this.room.ball)

        setTimeout(() => {
            this.gameLoop();
        }, 1000 / 30);
	}

    setPaddle(paddle: Paddle)
    {
        this.gameRequest({order: "paddlePosition", side: paddle.side, x: paddle.x, y: paddle.y})
        this.room.players[0].socket.emit('usersPaddle', {order: 'usersPaddle', side: 0})
        this.room.players[1].socket.emit('usersPaddle', {order: 'usersPaddle', side: 1})

    }


    gameBoardInit()
    {
        if (!this.room) {
            return;
        }
        this.ballData(this.room.ball)
        this.setPaddle(this.room.paddleLeft)
        this.setPaddle(this.room.paddleRight)
        this.gameRequest({order: "setGameBoard"})
        this.room.isGameRunning = true;
        this.gameRequest({order: "startGame"})
		this.gameLoop = this.gameLoop.bind(this);
        this.gameLoop()
    }

}