import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, take } from 'rxjs';
import { RoomI, RoomPaginateI } from '../../model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CustomSocket } from '../../sockets/custom-socket';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { UserI } from '../../model/user.interface';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatDividerModule, MatPaginatorModule, MatFormFieldModule, MatIconModule, HttpClientModule, RouterModule, ChatRoomComponent ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
	
	room$: Observable<RoomI[]> = this.chatService.getRooms();
	selectedRoom = null;
	userList :object[] = []
	user: Observable<UserI>;


	constructor(private route:ActivatedRoute,
		private router: Router,
		private chatService: ChatService,
		public http: HttpClient,
		private customSocket: CustomSocket,
		private socketService: SocketService) {}

	ngOnInit() {
		this.user = this.socketService.getCurrentUser();
		this.chatService.emitPaginateRooms(10, 0);
	}

	onSelectRoom(event: MatSelectionListChange) {
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	  }

	onPaginateRooms(pageEvent: PageEvent) {
		this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
	  }

	  LaunchCreateRoom()
	  {
		  this.router.navigate(['chat','create-room']);
	  }
}
