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
	current_user: UserI | undefined = this.userService.getLoggedInUser();
	adminArray: UserI[] | undefined;
  
  constructor(private userService: UserService, private socket: CustomSocket, private socketService: SocketService) {}
  
  	ngOnInit(): void {
		// import current user 
		this.socketService.emitGetCurrentUser();
		this.socketService.getCurrentUser().pipe(take(1)).subscribe( value => {
			this.current_user = value;
		});

		// import user on click
		this.userService.user$.subscribe(value => {
			this.user = value;
		});

		// import current room
		this.userService.room$.subscribe(value => {
			this.room = value;
		});
		// import admin list
		this.getAdminArray().subscribe(value =>{
			this.adminArray = value;
		});
	}

	getAdminArray(): Observable<UserI[]> {
		this.socket.emit("getIsAdmin", this.room);
		return this.socket.fromEvent("isAdmin");
	}

	closeOption() {
		this.userService.changeOption(false, undefined);
	}

	isAdmin(user: UserI | undefined): boolean {
		if (!this.adminArray)
			return false;

		for(const admin of this.adminArray)
			if (admin.id === user?.id)
				return true;
		return false;
	}

	setAsAdmin() {
		this.socket.emit("setAsAdmin", { user: this.user, room: this.room });
	}
}