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

  constructor(private socket: CustomSocket) { }

  sendMessage() {
  }

  getMessage() {
	return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateI> {
	return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
	this.socket.emit('paginateRooms', {limit, page});

  }

  createRoom(room: RoomI) {
	this.socket.emit('createRoom', room);
  }
}
