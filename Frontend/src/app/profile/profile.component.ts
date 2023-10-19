import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { ActivatedRoute } from '@angular/router';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { PictureComponent } from '../components/picture/picture.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent, HttpClientModule, RouterModule, ProfilePictureComponent, GamehistoryComponent, PictureComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

	id:number = 0;
	name:string = "";
	avatar:string = "";

	constructor(public http: HttpClient, public router:Router, private route: ActivatedRoute){}
	ngOnInit()
	{
		this.getuserbyId();
	}
	getuserbyId(): void
	{
		this.route.queryParams.subscribe(params => {
			this.id = params['id'];
		})
	}
}
