import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
	 @Input() current: Friend = new Friend('','')
}

export class Friend {
	name:string =''
	avatar:string = ''
	constructor(input1:string, input2:string) {
		this.name = input1;
		this.avatar = input2
	}
}