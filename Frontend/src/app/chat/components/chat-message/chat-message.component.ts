import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageI } from '../../model/message.interface';
import { UserService } from '../../services/user.service';
import { UserI } from '../../model/user.interface';
import { CustomSocket } from '../../sockets/custom-socket';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule ],
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

	@Input() message: MessageI;
	id;
	blockedUserList;

	constructor(private socketService: SocketService, 
				private socket: CustomSocket,
				private userService: UserService) {}

	ngOnInit(): void {
		this.id = JSON.parse(localStorage.getItem('id')!);

		// BlockedUser ?
		this.socket.emit("blockedUsers");
		this.socket.fromEvent<UserI[] | undefined>("blockedUsersList").subscribe(value =>{
			this.blockedUserList = value;
		});
	}

	openOption(user_: UserI | undefined) {
		this.userService.changeOption(true, user_);
	}

	isBlocked(id: number | undefined) {
		if(!id)
			return false;

		for(const user of this.blockedUserList)
			if (user.id === id)
				return true;
		return false;
	}
}