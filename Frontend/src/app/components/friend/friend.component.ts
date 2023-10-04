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
	 avatar;

	ngOnInit() {
        this.retrieveFriend();
	}
	retrieveFriend() {
	 this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe(
		res => {
			this.name = res['login'];
		},
		err => {
			alert("user doesn't exist");
		})
		this.get_avatar().subscribe (data => {
			this.createImageFromBlob(data)
		})
	}

	createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.avatar = reader.result;
		 }, false);

		if (image) {
		   reader.readAsDataURL(image);
		}
	 }

	get_avatar() {
		return this.http.get<Blob>("http://localhost:3333/users/" + this.id + "/avatar", { responseType: 'Blob' as 'json' })
	}

	onRightClick(event) {
		console.log('test')
		event.preventDefault() //this will disable default action of the context menu
		//there will be your code for the expected right click action
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