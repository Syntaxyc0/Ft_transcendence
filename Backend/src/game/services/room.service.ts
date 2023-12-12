import { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";

export const WIDTH = 1000
export const HEIGHT = 640

export class Player{
    socket: Socket;
    username: string;
    score: number;
    room: Room;

    lookingForPlayer = false;

    constructor(socket: Socket, username: string){
        
        this.socket = socket;
        this.username = username
        this.score = 0;
        console.log(this.username + " player created.")
    }
}

// @Injectable()
export class Room{

    playerOne: Player
    playerTwo: Player

    height: number = 640;
    width: number = 1000;

    ball: Ball

    constructor(playerOne: Player, playerTwo: Player){
        playerOne.room = this
        playerTwo.room = this

        this.playerOne = playerOne
        this.playerTwo = playerTwo

        this.playerOne.lookingForPlayer = false
        this.playerTwo.lookingForPlayer = false

        console.log(playerOne.username + " and " + playerTwo.username + " entered a room.")

    }
    
}

class Paddle{
    velocity!:number;
	acceleration!:number;
	deceleration!: number;
	step!: number;

	height: number = 150;
	width: number = 25;

	x!: number;
	y!: number;
	targetY: number;

	score: number = 0;

}

class Ball{
    x: number
    y: number
    angle: number = Math.random() * 360;
    speed: number;
    radius: number = 15;

    targetX: number;
    targetY: number;

    constructor(){
        this.reset()
    }

    reset()
	{
		this.speed = 30;
		this.x = WIDTH / 2;
		this.y = HEIGHT / 2;
		this.angle = Math.random() * 360;
		while((this.angle >= 75 && this.angle <= 105) || (this.angle >= 255 && this.angle <= 285) )//|| (this.angle >= 0 && this.angle <= 15)
			this.angle = Math.random() * 360;
		this.targetX = this.x;
		this.targetY = this.y;
	}
}

