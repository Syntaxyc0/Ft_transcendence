import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageI } from '../../model/message.interface';
import { UserService } from '../../services/user.service';
import { UserI } from '../../model/user.interface';

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



	constructor(private socketService: SocketService, private userService: UserService) {}

	ngOnInit(): void {
		this.id = JSON.parse(localStorage.getItem('id')!);
	}

	openOption(user_: UserI | undefined) {
		this.userService.changeOption(true, user_);
	}
}