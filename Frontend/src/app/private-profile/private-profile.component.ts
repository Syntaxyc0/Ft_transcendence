import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { PictureComponent } from '../components/picture/picture.component';

@Component({
  selector: 'app-private-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent, HttpClientModule, RouterModule, ProfilePictureComponent, GamehistoryComponent, PictureComponent],
  templateUrl: './private-profile.component.html',
  styleUrls: ['./private-profile.component.scss']
})
export class PrivateProfileComponent {
	id:number = 0;
	elo:number = 0;
	friendrequestsreceived: number[] = [];

	constructor(public http: HttpClient, public router:Router, private route: ActivatedRoute){}
	ngOnInit()
	{
		this.id = JSON.parse(localStorage.getItem('id')!)
		this.getuserElo()
		this.http.get<number[]>("http://localhost:3333/users/" + this.id + "/friendrequestsreceived").subscribe(res => {
			this.friendrequestsreceived = res;
		})
	}
	getuserElo()
	{
		this.http.get<number>('http://localhost:3333/users/' + this.id + '/getelo').subscribe(
			res => {
				this.elo = res
			},
			err => {
				console.log(err)
			}
		)
	}
}
