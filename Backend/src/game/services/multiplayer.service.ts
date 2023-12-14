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

    paddleData(paddle: Paddle)
    {
        this.gameRequest({order: "paddlePosition", x: paddle.x, y: paddle.y})
    }


    gameBoardInit()
    {
        this.gameRequest({order: "setGameBoard"})
        this.ballData(this.room.ball)
    }

}