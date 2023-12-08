import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from 'src/app/chat/model/message.interface';
import { SocketService } from '../../services/socket.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/helpers/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule ],
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit{

  @Input() message: MessageI;
  user: Observable<User>;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
	this.socketService.emitGetCurrentUser();
	this.user = this.socketService.getCurrentUser();
  }
}