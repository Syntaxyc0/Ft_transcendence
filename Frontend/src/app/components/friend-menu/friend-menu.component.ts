import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-friend-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-menu.component.html',
  styleUrls: ['./friend-menu.component.scss']
})
export class FriendMenuComponent implements OnInit{
	username: string;
	@Input() id
	@Input() name

	constructor(public http: HttpClient, private route:ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe (
		res => {                                       
			this.username = res['login'];
		})
	}

	deleteFriend()
	{
		this.http.patch('http://localhost:3333/users/' + localStorage.getItem('id') + '/RemoveFriend', {userId: this.id}).subscribe()
		{
			window.location.reload()
		}
	}

	pairPlayers()
	{
		console.log(this.username + " " + this.name)
	}

}
