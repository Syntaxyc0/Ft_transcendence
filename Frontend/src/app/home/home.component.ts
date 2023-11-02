import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from '../components/friendlist/friendlist.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { User } from '../helpers/types';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FriendlistComponent, HeaderbarComponent, ProfilePictureComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	constructor(public http: HttpClient, private route:ActivatedRoute, private router: Router) {}


	id:number = 1;
	code: string 
	ngOnInit() {
		
		  this.id = JSON.parse(localStorage.getItem('id')!)
	
	  }

	LaunchGame()
	{
		this.router.navigate(['game']);
	}

	LaunchChat()
	{
		this.router.navigate(['chat']);
	}
}
