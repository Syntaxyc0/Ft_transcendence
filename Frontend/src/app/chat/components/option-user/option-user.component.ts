import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserI } from '../../model/user.interface';
import { RoomI } from '../../model/room.interface';
import { CustomSocket } from '../../sockets/custom-socket';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { invite_to_playComponent } from '../invite_to_play/invite_to_play.component';


@Component({
  selector: 'app-option-user',
  standalone: true,
  templateUrl: './option-user.component.html',
  imports: [ CommonModule,
			MatCardModule,
			MatListModule,
			MatIconModule,
			MatButtonModule,
			invite_to_playComponent,
			],
  styleUrls: ['./option-user.component.scss']
})
export class OptionUserComponent implements OnInit{

	user: UserI | undefined;
	room: RoomI | undefined;
	current_user: UserI | undefined = this.userService.getLoggedInUser();
	
	adminArray: UserI[] | undefined;
	blockedUserList: UserI[] | undefined;
	mutedUserList: UserI[] | undefined;
	banList: UserI[] | undefined;

	adminUser: boolean;
	adminCurrent: boolean;

	isUserCreator: boolean;
	isCurrentCreator: boolean;

	isUserBlocked: boolean;

	isUserMuted: boolean;

	isUserBan: boolean;

  constructor(	private userService: UserService,
				private socket: CustomSocket,
				private socketService: SocketService,
				private router: Router,
				public dialog: MatDialog) {}
  
  	ngOnInit(): void {
		// Current user ?
		this.socketService.emitGetCurrentUser();
		this.socketService.getCurrentUser().pipe(take(1)).subscribe( value => {
			this.current_user = value;
		});

		// User on click ? 
		this.userService.user$.subscribe(value => {
			this.user = value;

			// Current room ?
			this.userService.room$.subscribe(value => {
				this.room = value;
			});

			// Admin ?
			this.getAdminArray().subscribe(value => {
				this.adminArray = value;
				this.adminUser = this.isAdmin(this.user);
				this.adminCurrent = this.isAdmin(this.current_user) 
			});

			// Creator ?
			this.socket.emit("getCreatorId", this.room);  
			this.socket.fromEvent("creatorId").subscribe(value => {
				if(this.user?.id === value) {
					this.isUserCreator = true;
				} else {
					this.isUserCreator = false;
				}
				if(this.current_user?.id === value) {
					this.isCurrentCreator = true;
				} else {
					this.isCurrentCreator = false;
				}
			});

			// BlockedUser ?
			this.socket.emit("blockedUsers");
			this.socket.fromEvent<UserI[] | undefined>("blockedUsersList").subscribe(value =>{
				this.blockedUserList = value;
				this.isUserBlocked = this.isBlocked();
			});
			
			// Muted ?
			this.socket.emit("MutedUsers", this.room);
			this.socket.fromEvent<UserI[] | undefined>("mutedUsersList").subscribe(value =>{
				this.mutedUserList = value;
				this.isUserMuted = this.isMuted();
			});

			this.socket.emit("getBanList", this.room);
			this.socket.fromEvent<UserI[] | undefined>("banList").subscribe(value =>{
				this.banList = value;
				this.isUserBan = this.isBan();
			});
		});

	}

	inviteToPlay()/*invitedUser?: string, currentUser?: string*/
	{
		this.socket.emit("invite_to_play?", this.user);
	}

	goToProfile()
	{
		this.router.navigate(['/user'], { queryParams: { id: this.user?.id } })
	}

	getAdminArray(): Observable<UserI[]> {
		this.socket.emit("getAdminList", this.room);
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

	isBlocked(): boolean {
		if (!this.blockedUserList )
			return false;

		for(const user of this.blockedUserList)
			if (user.id === this.user?.id)
				return true;
		return false;
	}

	isMuted(): boolean {
		if (!this.mutedUserList)
			return false;

		for(const user of this.mutedUserList)
			if (user.id === this.user?.id)
				return true;
		return false;
	}
	  
	setAsAdmin() {
		this.socket.emit("setAsAdmin", { user: this.user, room: this.room });
		this.closeOption();
	}

	unsetAsAdmin() {
		this.socket.emit("unsetAsAdmin", { user: this.user, room: this.room });
		this.closeOption();
	}

	blockUser() {
		this.socket.emit("blockUser", this.user);
		this.closeOption();
	}

	unblockUser() {
		this.socket.emit("unblockUser", this.user);
		this.closeOption();
	}

	muteUser() {
		this.socket.emit("muteUser", { user: this.user, room: this.room });
		this.closeOption();
	}

	kickUser() {
		this.socket.emit("kickUser", { user: this.user, room: this.room });
		this.closeOption();
	}

	banUser() {
		this.socket.emit("banUser", { user: this.user, room: this.room });
		this.closeOption();
	}

	unbanUser() {
		this.socket.emit("unbanUser", { user: this.user, room: this.room });
		this.closeOption();
	} 

	isBan(): boolean {
		if ( !this.banList )
			return false;

		for(const user of this.banList)
			if (user.id === this.user?.id)
				return true;
		return false;
	}
}