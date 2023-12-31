import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, take } from 'rxjs';
import { RoomI } from '../../model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { UserService } from '../../services/user.service';
import { OptionUserComponent } from '../option-user/option-user.component';
import { CustomSocket } from '../../sockets/custom-socket';
import { HeaderbarComponent } from 'src/app/components/headerbar/headerbar.component';
import { invite_to_playComponent } from '../invite_to_play/invite_to_play.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,
			MatCardModule,
			MatButtonModule,
			MatListModule,
			MatDividerModule,
			MatPaginatorModule,
			MatFormFieldModule,
			MatIconModule,
			HttpClientModule,
			RouterModule,
			ChatRoomComponent,
			OptionUserComponent,
			HeaderbarComponent,
			invite_to_playComponent,
			MatDialogModule,
			],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit, OnInit{
	
	room$: Observable<RoomI[]> = this.chatService.getRooms();
	selectedRoom = null;
	userList :object[] = []
	login;
	option: boolean;


	constructor(
		private router: Router,
		private chatService: ChatService,
		public http: HttpClient,
		private userService: UserService,
		private socket: CustomSocket,
		public dialog: MatDialog,
		public snackbar: MatSnackBar,
		) {}

	ngOnInit(): void {
		this.retrieveUser();
		this.userService.option$.subscribe(value => {
			this.option = value;
		  });

		this.socket.fromEvent("kicked").subscribe(() => {
			location.reload();
		});

		this.socket.fromEvent("invited to play").subscribe(async (value: any) => {

			const { inviterI } = value;
			let invite: boolean = false;
			
			const dialogRef = this.dialog.open(invite_to_playComponent, {
				width: '300px',
				data: { login: inviterI.login }
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					// this.router.navigate(['/game']);
					this.socket.emit('checkAndAccept', inviterI)
					// this.dialog.closeAll();
				} else {
					this.socket.emit("refuseGame", inviterI);
					// this.dialog.closeAll();
				}
			});
		})

		this.socket.fromEvent("accepted to play").subscribe(async (value:any)=>{
			console.log("game accepted")
			// this.router.navigate(['/game'])

			this.socket.emit("checkAndLaunch", {currentUser: value.inviterI.login, /*inviterSocket: inviter_socket,*/ invitedUser: value.invited_login})
			// this.router.navigate(['/game'])
			// this.socket.emit("pairPlayers", {currentUser: value.inviterI.login, /*inviterSocket: inviter_socket,*/ invitedUser: value.invited_login})
		})

		this.socket.fromEvent("refuse to play").subscribe((value) => {
			this.snackbar.open(`${value} has refuse to play with you`, 'Close' ,{
				duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
			});
		})
		this.socket.fromEvent("go on page").subscribe(async (value:any)=>{
			this.router.navigate(['/game'])
		})
	}

	retrieveUser() {
		const id = JSON.parse(localStorage.getItem('id')!);

		this.http.get<any>("http://localhost:3333/users/" + id).subscribe (
		   res => {
			   this.login = res['login'];
		   },
		   err => {
			   alert("user doesn't exist");
		   })
	}

	ngAfterViewInit() {
		this.chatService.emitRooms();
	}

	onSelectRoom(event: MatSelectionListChange) {
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	  }

	  LaunchCreateRoom()
	  {
		  this.router.navigate(['chat','create-room']);
	  }
}
