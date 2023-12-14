import { Player } from "../models/player.model";
import { Room } from "../models/room.model";
import { Ball, Paddle } from "../models/game-elements.model";

export class MultiplayerService{

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

    setPaddle(paddle: Paddle)
    {
        this.gameRequest({order: "paddlePosition", side: paddle.side, x: paddle.x, y: paddle.y})
        this.room.players[0].socket.emit('usersPaddle', {order: 'usersPaddle', side: 0})
        this.room.players[1].socket.emit('usersPaddle', {order: 'usersPaddle', side: 1})

    }


    gameBoardInit()
    {
        this.ballData(this.room.ball)
        this.setPaddle(this.room.paddleLeft)
        this.setPaddle(this.room.paddleRight)
        this.gameRequest({order: "setGameBoard"})
    }

}