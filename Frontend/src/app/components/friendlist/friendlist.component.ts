import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendComponent, Friend } from '../friend/friend.component';

@Component({
  selector: 'app-friendlist',
  standalone: true,
  imports: [CommonModule, FriendComponent],
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent {

//   testing purpose

friendList = [
		new Friend("test", "https://bellard.org/bpg/2.png"),
		new Friend("friend2", "https://bellard.org/bpg/3.png"),
		new Friend("friend3", "https://bellard.org/bpg/3.png"),
		new Friend("friend4", "https://bellard.org/bpg/2.png"),
		new Friend("friend5", "https://bellard.org/bpg/3.png"),
		new Friend("friend6", "https://bellard.org/bpg/2.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
		new Friend("friend7", "https://bellard.org/bpg/3.png"),
	]
}

