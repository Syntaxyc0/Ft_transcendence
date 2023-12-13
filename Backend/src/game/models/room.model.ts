import { Player } from "./player.model";
import { Ball, Paddle } from "./game-elements.model";
import { MultiplayerService } from "../services/multiplayer.service";

export class Room{

    multiplayer: MultiplayerService
    players: Player[] = [];

    height: number = 640;
    width: number = 1000;

    roomId: number;

    ball: Ball

    constructor(roomId: number, playerOne: Player, playerTwo: Player){

        this.roomId = roomId
        this.players.push(playerOne)
        this.players.push(playerTwo)

        for (let i: number = 0; i < 2; i++)
        {
            this.players[i].lookingForPlayer = false
            this.players[i].room = this
        }

        console.log("two players entered room " + roomId)

        this.multiplayer.gameBoardInit(this)

    }

    // destroyRoom()
    // {
    //     for (let i: number = 0; i < 2; i++)
    //     {
    //         this.players[i].room = undefined
    //     }
    // }
    
}