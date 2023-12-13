import { Player } from "../models/player.model";
import { Room } from "../models/room.model";


export class MultiplayerService{


    gameRequest(room: Room, payload: any)
    {
        for (let i: number = 0; i < 2; i++)
            room.players[i].socket.emit('onGameRequest', payload)
    }

    gameBoardInit(room: Room)
    {
        this.gameRequest(room, {order: "test"})
    }



}