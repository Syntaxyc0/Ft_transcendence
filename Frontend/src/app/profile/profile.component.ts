import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent, HttpClientModule, RouterModule, ProfilePictureComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

	login:string= "";

	constructor(public http: HttpClient, public router:Router){}
	ngOnInit()
	{
		this.getMe();
	}
	getMe(): void
	{
		
		this.http.get<any>("http://localhost:3333/users/" + this.login).subscribe(
			res => {
				res;
				console.log(res);
			},
			err => {
				// alert("users error")
			})
	}
}
