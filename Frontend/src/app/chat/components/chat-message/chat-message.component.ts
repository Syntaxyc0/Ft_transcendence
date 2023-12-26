import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserI } from '../../model/user.interface';
import { MessageI } from '../../model/message.interface';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule ],
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;
  user: UserI;
  
  constructor(private socketService: SocketService) {}
  
  ngOnInit(): void {
		this.socketService.emitGetCurrentUser();
		this.socketService.getCurrentUser().pipe(take(1)).subscribe( value => {
			this.user = value;
		});

		console.log(this.user);

	}
}