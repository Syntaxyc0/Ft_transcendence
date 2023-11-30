import { Injectable } from "@angular/core";
import { CustomSocket } from "../sockets/custom-socket";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
  })
  export class SocketService {

	constructor(private socket: CustomSocket) { }

	emitGetCurrentLogin() {
		this.socket.emit('getCurrentUser');
	}

	getCurrentLogin(): Observable<string> {
		return this.socket.fromEvent('currentUser');
	}
  }