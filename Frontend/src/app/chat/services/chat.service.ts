import { Injectable } from '@angular/core';
import { CustomSocket } from '../sockets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/chat/model/room.interface';
import { UserI } from 'src/app/chat/model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) { }

	sendMessage() {
	}

	getMessage() {
		return this.socket.fromEvent('message');
	}

	getMyRooms(): Observable<RoomPaginateI> {
		return this.socket.fromEvent<RoomPaginateI>('rooms');
	}

	getRooms(): Observable<RoomI[]> {
		return this.socket.fromEvent('roomsI');
	}

	emitPaginateRooms(limit: number, page: number) {
		this.socket.emit('roomsArray', {limit, page});
	}

	createRoom(room: RoomI) {
		console.log(room);
		this.socket.emit('createRoom', room);
		this.snackbar.open(`Room ${room.name} created succefully`, 'Close' ,{
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		} );
	}
}
