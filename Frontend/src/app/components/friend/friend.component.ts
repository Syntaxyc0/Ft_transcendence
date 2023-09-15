import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
	constructor(public http: HttpClient) {}

	@Input() id:number = 0

	 name:string = 'undefined';
	 avatar_url:string = '';

	ngOnInit() {
        this.retrieveFriend();
	}
	retrieveFriend() {
	 this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe(
		res => {
			this.name = res['login'];
			this.avatar_url = res['avatar'];
		},
		err => {
			alert("user doesn't exist");
		})
	}


}

export class Friend {
	name:string =''
	avatar:string = ''
	constructor(input1:string, input2:string) {
		this.name = input1;
		this.avatar = input2
	}
}