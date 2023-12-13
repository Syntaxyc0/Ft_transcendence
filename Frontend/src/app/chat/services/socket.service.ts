import { Injectable } from "@angular/core";
import { CustomSocket } from "../sockets/custom-socket";
import { Observable } from "rxjs";
import { UserI } from "../model/user.interface";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
	providedIn: 'root'
  })
  export class SocketService {

	constructor(private socket: CustomSocket, private jwtService: JwtHelperService) { }

	emitGetCurrentUser() {
		this.socket.emit('getCurrentUser');
	}

	getCurrentUser(): Observable<UserI> {
		return this.socket.fromEvent('currentUser');
	}

	getCurrentUserByJwt() {
		const decodedToken = this.jwtService.decodeToken();
		return decodedToken.user;
	}
  }