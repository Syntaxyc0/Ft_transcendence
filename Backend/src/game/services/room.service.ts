import { Socket } from "socket.io";
import { GameService } from "./game.service";
import { Injectable } from "@nestjs/common";
import { Player } from "../interfaces/player.interface";


@Injectable()
export class RoomService{

    constructor(player1: Player, player2: Player){}
    
}