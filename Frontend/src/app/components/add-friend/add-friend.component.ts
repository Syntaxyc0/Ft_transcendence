import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent {
	showModal = false;
	toggleModal(){
	
	  this.showModal = !this.showModal;
	}
}
