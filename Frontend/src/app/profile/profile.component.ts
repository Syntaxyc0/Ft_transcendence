import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent, HttpClientModule, RouterModule, ProfilePictureComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

	id:number = 0;
	name:string = "";
	avatar_url:string = "";

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
		this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe(
			res => {
				console.log(res);
				this.name = res['login'];
				this.avatar_url = "https://bellard.org/bpg/2.png"; //todo: ajouter l'avatar depuis dossier statique
			},
			err => {
				alert("user doesn't exist");
			})
	}
}
