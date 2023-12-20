import { Injectable } from "@angular/core";
import { CustomSocket } from "../sockets/custom-socket";
import { Observable } from "rxjs";
import { UserI } from "../model/user.interface";

@Injectable({
	providedIn: 'root'
  })
  export class SocketService {

	constructor(private socket: CustomSocket) { }

	emitGetCurrentUser() {
		this.socket.emit('getCurrentUser');
	}

	getCurrentUser(): Observable<UserI> {
		return this.socket.fromEvent('currentUser');
	}
  }