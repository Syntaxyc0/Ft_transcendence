import { Component, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserI } from '../../model/user.interface';
import { MessageI } from '../../model/message.interface';
import { User } from 'src/app/helpers/types';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  imports: [ CommonModule ],
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit{

  @Input() message: MessageI;
  user: Observable<UserI>;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
	this.socketService.emitGetCurrentUser();
	this.user = this.socketService.getCurrentUser();
  }
}