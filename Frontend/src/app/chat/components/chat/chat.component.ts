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
			OptionUserComponent
			],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements AfterViewInit, OnInit{
	
	room$: Observable<RoomI[]> = this.chatService.getRooms();
	selectedRoom = null;
	userList :object[] = []
	user = this.userService.getLoggedInUser();
	option: boolean;


	constructor(private route:ActivatedRoute,
		private router: Router,
		private chatService: ChatService,
		public http: HttpClient,
		private userService: UserService) {}

	ngOnInit(): void {
		this.userService.option$.subscribe(value => {
			this.option = value;
		  });
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
