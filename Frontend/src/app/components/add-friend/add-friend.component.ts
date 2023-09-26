import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {

	constructor(public http: HttpClient) {};

	public AddFriendForm = new FormGroup({
		name: new FormControl(null, [Validators.required])
	});

	showModal = false;
	@Input() id:number = 0;

	toggleModal(){
	  this.showModal = !this.showModal;
	}
	
	addFriend(){
		this.toggleModal()
		this.http.patch("http://localhost:3333/users/" + this.id + "/AddFriend", {userName:this.AddFriendForm.value.name}).subscribe(
			res => {
				window.location.reload()
			},
            err => {
				alert(err.error.message);
			}
			);
		this.AddFriendForm.reset();
    }
	
	closeButton(){
		this.AddFriendForm.reset(); 
		this.toggleModal()
	}

	enterKey(){
		this.addFriend()
	  }
}
