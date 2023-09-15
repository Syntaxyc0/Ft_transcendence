import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ],
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {

	constructor(public http: HttpClient) {}

	@Input() id:number = 0;
	name:string = '';
	avatar_url:string = '';

	ngOnInit() {
        this.retrieveUser();
	}
	retrieveUser() {
	 this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe(
		res => {
			this.name = res['login'];
			this.avatar_url = "http://localhost:3333/" + res['avatar'];
			console.log(this.avatar_url);
		},
		err => {
			alert("user doesn't exist");
		})
	}


}
