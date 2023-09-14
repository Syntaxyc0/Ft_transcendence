import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendComponent, Friend } from '../friend/friend.component';
import { AddFriendComponent } from '../add-friend/add-friend.component';

@Component({
  selector: 'app-friendlist',
  standalone: true,
  imports: [CommonModule, FriendComponent, AddFriendComponent],
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent {

//   testing purpose

friendList = [1]
}

