import { Player } from "./player.model";
import { Ball, Paddle } from "./game-elements.model";
import { MultiplayerService } from "../services/multiplayer.service";
import { WIDTH } from "../game.service";

export class Room{

    multiplayer: MultiplayerService;
    players: Player[] = [];

    id: number;

    ball: Ball
    paddles: Paddle[] = [];

    isGameRunning: boolean = false

    constructor(roomId: number, playerOne: Player, playerTwo: Player){

        this.multiplayer = new MultiplayerService(this)

        this.id = roomId
        this.players.push(playerOne)
        this.players.push(playerTwo)

        this.ball = new Ball(this.multiplayer)

        this.paddles.push(new Paddle(0, this.multiplayer))
        this.paddles.push(new Paddle(1, this.multiplayer))

        for (let i: number = 0; i < 2; i++)
        {
            this.players[i].lookingForPlayer = false
            this.players[i].room = this
        }

        console.log(playerOne.socket.data.login + " and " + playerTwo.socket.data.login + " entered room " + roomId)
        this.multiplayer.gameBoardInit()

    }

    log()
    {
		console.log(" ************* ")
        this.paddles.forEach((paddle) => {
			console.log("paddle " + paddle.side)
			console.log("x: " + paddle.x + " / y: " + paddle.y)
            console.log(" -------------------------- ")
		})
		console.log("ball: x: " + this.ball.x + " / y: " + this.ball.y)
		console.log(" ************* ")

    }

    destroyRoom()
    {
        this.multiplayer.gameRequest({order: "stopGame"})
        this.isGameRunning = false
        for (let i: number = 0; i < 2; i++)
        {
            this.players[i].room = undefined
        }
    }
    
}