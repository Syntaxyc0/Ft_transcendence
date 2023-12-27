import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserI } from '../../model/user.interface';
import { MessageI } from '../../model/message.interface';
import { CdkMenu, CdkMenuItem, CdkMenuModule } from '@angular/cdk/menu'; 

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule, CdkMenuModule, CdkMenuItem, CdkMenu ],
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
	}
}