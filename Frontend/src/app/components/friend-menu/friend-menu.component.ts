import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BACKEND } from 'src/app/env';
import { CustomSocket } from 'src/app/chat/sockets/custom-socket';


@Component({
  selector: 'app-friend-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-menu.component.html',
  styleUrls: ['./friend-menu.component.scss']
})
export class FriendMenuComponent implements OnInit{
	username: string;
	@Input() id: number
	@Input() name: string

	constructor(private socket: CustomSocket,
		public http: HttpClient, private route:ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.socket.emit("findUser", this.id);
		this.socket.fromEvent("userFound").subscribe(() =>{

		});

		this.http.get<any>(BACKEND.URL + "users/" + this.id).subscribe (
		res => {                                       
			this.username = res['login'];
		})
	}

	deleteFriend()
	{
		this.http.patch(BACKEND.URL + 'users/' + localStorage.getItem('id') + '/RemoveFriend', {userId: this.id}).subscribe()
		{
			window.location.reload()
		}
	}


	inviteToPlay()/*invitedUser?: string, currentUser?: string*/
	{
		// console.
		this.socket.emit("invite_to_play?", this.id);
	}

}
