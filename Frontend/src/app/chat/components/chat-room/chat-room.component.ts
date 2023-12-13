import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, combineLatest, map, mergeMap, of, startWith, tap } from 'rxjs';
import { RoomI } from 'src/app/chat/model/room.interface';
import { MessageI } from '../../model/message.interface';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { UserI } from '../../model/user.interface';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  imports: [ ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, MatIconModule, ChatMessageComponent ],

})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;
  @ViewChild('messages') private messagesScroller: ElementRef;


  messages$: Observable<MessageI[]> = combineLatest([
	this.chatService.getMessage(), 
	this.chatService.getAddedMessage().pipe(startWith(null))
	]).pipe(
    map(([allMessages, message]) => {
      if (message && message.room.id === this.chatRoom.id && !allMessages.some(m => m.id === message.id)) {
        allMessages.push(message);
      }

	  console.log('allMessages:', allMessages);
	  console.log('addedMessage:', message);

	  const items = allMessages.sort((a, b) => {
		const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
		const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
		return dateA - dateB;
	  });

      allMessages = items;
      return allMessages;
    }),
    tap(() => this.scrollToBottom())
  )


  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.chatRoom) {
    	this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight}, 1);
  }
}