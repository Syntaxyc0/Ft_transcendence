import { Injectable } from "@angular/core";
import { CustomSocket } from "../sockets/custom-socket";
import { Observable } from "rxjs";
import { User } from "src/app/helpers/types";

@Injectable({
	providedIn: 'root'
  })
  export class SocketService {

	constructor(private socket: CustomSocket) { }

	emitGetCurrentUser() {
		this.socket.emit('getCurrentUser');
	}

	getCurrentUser(): Observable<User> {
		return this.socket.fromEvent('currentUser');
	}
  }