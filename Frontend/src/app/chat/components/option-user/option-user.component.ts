import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Observable, of, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserI } from '../../model/user.interface';
import { RoomI } from '../../model/room.interface';
import { CustomSocket } from '../../sockets/custom-socket';


@Component({
  selector: 'app-option-user',
  standalone: true,
  templateUrl: './option-user.component.html',
  imports: [ CommonModule,
			MatCardModule,
			MatListModule,
			MatIconModule,
			MatButtonModule,
			],
  styleUrls: ['./option-user.component.scss']
})
export class OptionUserComponent {

	user: UserI | undefined;
	room: RoomI | undefined;
	current_user;
  
  constructor(private userService: UserService, private socket: CustomSocket) {}
  
  	ngOnInit(): void {
		// import user on click
		this.userService.user$.subscribe(value => {
			this.user = value;
		});

		// import current room
		this.userService.room$.subscribe(value => {
			this.room = value;
		});
	}

	isAdmin(): Observable<boolean> {
		this.socket.emit("getIsAdmin", this.room);
		console.log(this.socket.fromEvent("isAdmin"));
		return of(true);
	}

	closeOption() {
		this.userService.changeOption(false, undefined);
	}
}