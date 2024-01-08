import { Component, Input } from '@angular/core';
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
export class FriendMenuComponent {
	@Input() id

	constructor(public http: HttpClient, private route:ActivatedRoute, private router: Router) {}

	deleteFriend()
	{
		this.http.patch('http://localhost:3333/users/' + localStorage.getItem('id') + '/RemoveFriend', {userId: this.id}).subscribe()
		{
			window.location.reload()
		}
	}

	pairPlayers()
	{
		
	}

}
