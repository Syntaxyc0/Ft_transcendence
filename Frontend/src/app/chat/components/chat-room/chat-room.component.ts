import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { CustomSocket } from '../../sockets/custom-socket';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
	MatDialog,
	MatDialogRef,
	MatDialogActions,
	MatDialogClose,
	MatDialogTitle,
	MatDialogContent,
	MatDialogModule,
  } from '@angular/material/dialog';
import { AddUsersComponent } from '../add-users/add-users.component';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  imports: [ ReactiveFormsModule,
			 CommonModule, 
			 MatInputModule, 
			 MatFormFieldModule, 
			 MatButtonModule, 
			 MatCardModule, 
			 RouterModule, 
			 MatIconModule, 
			 ChatMessageComponent,
			 MatDialogModule,
			 MatDialogActions,
			 MatDialogClose,
			 MatDialogTitle,
			 MatDialogContent,
			 AddUsersComponent,
			],

})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;
  @ViewChild('messages') private messagesScroller: ElementRef;

	
  currentId: UserI;
  mutedUserList: UserI[] | undefined;
  isCurrentMuted: boolean = this.isMuted();
  
  messages$: Observable<MessageI[]> = combineLatest([
	this.chatService.getMessage(), 
	this.chatService.getAddedMessage().pipe(startWith(null))
	]).pipe(
    map(([allMessages, message]) => {
      if (message && message.room.id === this.chatRoom.id && !allMessages.some(m => m.id === message.id)) {
        allMessages.push(message);
      }
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

  constructor(private chatService: ChatService, 
			  private userService: UserService,
			  public http: HttpClient,
			  private socket: CustomSocket,
			  private snackbar: MatSnackBar,
			  public dialog: MatDialog,
			  ) {}

  ngOnInit(): void {
	  this.currentId = JSON.parse(localStorage.getItem('id')!);
	  this.userService.changeRoom(this.chatRoom);

	  this.socket.emit("MutedUsers", this.chatRoom);
	  this.socket.fromEvent<UserI[] | undefined>("mutedUsersList").subscribe(value =>{
		  this.mutedUserList = value;
		  this.isCurrentMuted = this.isMuted();
	  });

	  this.socket.fromEvent<UserI[] | undefined>("mutedUserTrue").subscribe(value =>{
		this.mutedUserList = value;
		this.isCurrentMuted = true;
		this.snackbar.open(`You have been muted`, 'Close' ,{
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		} );
	  });

	  this.socket.fromEvent<UserI[] | undefined>("mutedUserFalse").subscribe(value =>{
		this.mutedUserList = value;
		this.isCurrentMuted = false;
	  });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.chatRoom) {
    	this.chatService.joinRoom(this.chatRoom);
		this.userService.changeRoom(this.chatRoom);
		this.userService.changeOption(false, undefined);
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
	this.userService.changeOption(false, undefined);
  }

  sendMessage() {
	if (this.isCurrentMuted) {
		this.snackbar.open(`You are muted`, 'Close' ,{
			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
		} );
		return;
	}

    this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight}, 1);
  }

  	isMuted(): boolean {
		if (!this.mutedUserList)
			return false;

		for(const user of this.mutedUserList)
			if (user.id === this.currentId)
				return true;
		return false;
	}

	openUserSearchDialog(): void {
		const dialogRef = this.dialog.open(AddUsersComponent, {
		  width: '300px',
		  data: { room: this.chatRoom }
		  // Ajoutez d'autres options de dialogue au besoin
		});
	
		dialogRef.afterClosed().subscribe(result => {
		  console.log('Dialog closed with result:', result);
		  // Ajoutez la logique de gestion des résultats de la recherche ici
		});
	}

}