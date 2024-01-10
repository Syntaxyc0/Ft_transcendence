import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, take } from 'rxjs';
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
import { HostListener } from '@angular/core';
import { BACKEND } from 'src/app/env';


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
export class ChatComponent implements AfterViewInit, OnInit, OnDestroy{
	
	room$: Observable<RoomI[]> = this.chatService.getRooms();
	selectedRoom: RoomI | null = null;
	userList :object[] = []
	login;
	option: boolean;

	invitedToPlaySubscription: Subscription;
	subOption: Subscription;
	subKick: Subscription;
	subAccept: Subscription;
	subRefuse: Subscription;
	subGoOn: Subscription;
	subInGame: Subscription;
	subMP: Subscription;


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

		this.subOption = this.userService.option$.subscribe(value => {
			this.option = value;
		});

		this.subKick = this.socket.fromEvent("kicked").subscribe(() => {
			this.selectedRoom = null;
		});

		this.invitedToPlaySubscription = this.socket.fromEvent("invited to play").subscribe(async (value: any) => {

			const { inviterI } = value;
			if(!this.isVisible())
			{
				this.socket.emit("notInChat");
				this.dialog.closeAll();
				return;
			}
			console.log("invited" + this.isVisible())

			const dialogRef = this.dialog.open(invite_to_playComponent, {
				width: '300px',
				data: { login: inviterI.login }
			});
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.dialog.closeAll()
					this.socket.emit('checkAndAccept', inviterI)
					this.router.navigate(['/game'])

				} else {
					this.dialog.closeAll()
					this.socket.emit("refuseGame", inviterI);
				}
			});
		});

		// this.subAccept = this.socket.fromEvent("accepted to play").subscribe((value:any)=>{
		// 	this.socket.emit("checkAndLaunch", {currentUser: value.inviterI.login, /*inviterSocket: inviter_socket,*/ invitedUser: value.invited_login})
		// 	this.router.navigate(['/game'])
		// });

		// this.subRefuse = this.socket.fromEvent("refuse to play").subscribe((value) => {
		// 	this.snackbar.open(`${value} has refused to play with you`, 'Close' ,{
		// 		duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
		// 	});
		// });
		
		// this.subGoOn = this.socket.fromEvent("go on page").subscribe((value:any)=>{
		// 	this.router.navigate(['/game'])
		// });

		// this.subInGame = this.socket.fromEvent("player in game").subscribe((value) => {
		// 	this.snackbar.open(`${value} is in game`, 'Close' ,{
		// 		duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
		// 	});
		// });

		this.socket.fromEvent<RoomI>("MessageToUser").subscribe((value) => {
				console.log("MP");
				this.selectedRoom = value;
		});
	}
	
	ngOnDestroy(): void {
			// Unsubscribe to avoid memory leaks
		this.invitedToPlaySubscription.unsubscribe();
		this.subOption.unsubscribe;
		this.subKick.unsubscribe;
		// this.subAccept.unsubscribe;
		// this.subRefuse.unsubscribe;
		// this.subGoOn.unsubscribe;
		// this.subInGame.unsubscribe;
	}

	@HostListener('document:visibilitychange', ['$event'])
	onVisibilityChange(event: Event): void {
		if(!this.isVisible())
			this.dialog.closeAll()
	 }

	 isVisible(): boolean
	 {
		if (document.visibilityState === 'visible') 
			return true;
		else 
			return false;
	 }

	retrieveUser() {
		const id = JSON.parse(localStorage.getItem('id')!);

		this.http.get<any>(BACKEND.URL + "users/" + id).subscribe (
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
		console.log(typeof event.source.selectedOptions.selected[0].value);
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	}

	LaunchCreateRoom() {
		this.router.navigate(['chat','create-room']);
	}
}
