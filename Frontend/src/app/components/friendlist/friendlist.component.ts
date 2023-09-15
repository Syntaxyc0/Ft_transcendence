import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendComponent, Friend } from '../friend/friend.component';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-friendlist',
  standalone: true,
  imports: [CommonModule, FriendComponent, AddFriendComponent, HttpClientModule],
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent {
	constructor(public http:HttpClient){}

//   testing purpose
	@Input() id:number = 0;
	friendList :number[] = []

	ngOnInit() {
		this.http.get<number[]>("http://localhost:3333/users/" + this.id + "/friendlist").subscribe(res => {
			this.friendList = res;
	})
}

}

