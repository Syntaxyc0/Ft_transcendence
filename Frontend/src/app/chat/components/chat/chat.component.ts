import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, take } from 'rxjs';
import { RoomI } from '../../model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { UserService } from '../../services/user.service';
import { OptionUserComponent } from '../option-user/option-user.component';
import { SocketService } from '../../services/socket.service';
import { CustomSocket } from '../../sockets/custom-socket';
import { HeaderbarComponent } from 'src/app/components/headerbar/headerbar.component';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,
			MatCardModule,
			MatButtonModule,
			MatListModule,
			MatDividerModule,
			MatPaginatorModule,
			MatFormFieldModule,
			MatIconModule,
			HttpClientModule,
			RouterModule,
			ChatRoomComponent,
			OptionUserComponent,
			HeaderbarComponent,
			],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit, OnInit{
	
	room$: Observable<RoomI[]> = this.chatService.getRooms();
	selectedRoom = null;
	userList :object[] = []
	login;
	option: boolean;


	constructor(private route:ActivatedRoute,
		private router: Router,
		private chatService: ChatService,
		private socketService: SocketService,
		public http: HttpClient,
		private userService: UserService,
		private socket: CustomSocket) {}

	ngOnInit(): void {
		this.retrieveUser();
		this.userService.option$.subscribe(value => {
			this.option = value;
		  });
	}

	retrieveUser() {
		const id = JSON.parse(localStorage.getItem('id')!);

		this.http.get<any>("http://localhost:3333/users/" + id).subscribe (
		   res => {
			   this.login = res['login'];
		   },
		   err => {
			   alert("user doesn't exist");
		   })
	   }

	ngAfterViewInit() {
		this.chatService.emitRooms();
	}

	onSelectRoom(event: MatSelectionListChange) {
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	  }

	  LaunchCreateRoom()
	  {
		  this.router.navigate(['chat','create-room']);
	  }
}
