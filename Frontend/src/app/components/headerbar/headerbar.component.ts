import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { CustomSocket } from 'src/app/chat/sockets/custom-socket';
import { HttpClient } from '@angular/common/http';
import { BACKEND } from 'src/app/env';
import { Subscription, Observable, Subject, from} from 'rxjs';
import { ContentObserver } from '@angular/cdk/observers';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { invite_to_playComponent } from 'src/app/chat/components/invite_to_play/invite_to_play.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-headerbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsComponent],
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss']
})
export class HeaderbarComponent implements OnInit, OnDestroy{

	constructor(
		private socket: CustomSocket,
		private http: HttpClient,
		public dialog: MatDialog,
		private router: Router,
		) {}

	dataSubscription: Subscription
	invitedSubscription: Subscription
	id: number = 0;
	login: string;

	ngOnInit()
	{
		this.retrieveUser();
		this.getId();
		this.dataSubscription = this.socket.fromEvent("onInviteRequest").subscribe((payload: any) =>{
			if (!payload.order)
				return;
			this.handleOrder(payload.order, payload);
		});
	}

	ngOnDestroy(): void {
		console.log("destroy")
		if (this.dataSubscription)
		{
			console.log("success")
			this.dataSubscription.unsubscribe();
		}
	}

	handleOrder(order:string, payload:any)
	{
		switch(order){

			case "invited to play":
				const inviterI = payload.inviterI;
				if(!this.isVisible())
				{
					this.socket.emit("notInChat");
					this.dialog.closeAll();
					return;
				}

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
				break;
				case "accepted to play":
					this.socket.emit("checkAndLaunch", {currentUser: payload.inviterI.login, invitedUser: payload.invited_login})
					this.router.navigate(['/game'])
				break;
		}
		
	}


// 	this.socket.fromEvent("accepted to play").subscribe((value:any)=>{
// 		this.socket.emit("checkAndLaunch", {currentUser: value.inviterI.login, /*inviterSocket: inviter_socket,*/ invitedUser: value.invited_login})
// 		this.router.navigate(['/game'])
// 	})

// 	this.socket.fromEvent("refuse to play").subscribe((value) => {
// 		this.snackbar.open(`${value} has refused to play with you`, 'Close' ,{
// 			duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
// 		});
// 	});
	
// 	this.socket.fromEvent("go on page").subscribe((value:any)=>{
// 		this.router.navigate(['/game'])
// 	})

// 	this.socket.fromEvent("player in game").subscribe((value) => {
// 		this.snackbar.open(`${value} is in game`, 'Close' ,{
// 			duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
// 		});
// 	})
// }

	isVisible(): boolean
	{
	   if (document.visibilityState === 'visible') 
		   return true;
	   else 
		   return false;
	}

	getId()
	{
		this.id = JSON.parse(localStorage.getItem('id')!);
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
}
