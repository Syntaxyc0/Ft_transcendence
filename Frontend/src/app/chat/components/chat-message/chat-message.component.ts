import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageI } from '../../model/message.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule ],
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;
  user = this.userService.getLoggedInUser();
  
  constructor(private socketService: SocketService, private userService: UserService) {}
  
  ngOnInit(): void {
		this.socketService.emitGetCurrentUser();
		this.socketService.getCurrentUser().pipe(take(1)).subscribe( value => {
			this.user = value;
		});
	}
}