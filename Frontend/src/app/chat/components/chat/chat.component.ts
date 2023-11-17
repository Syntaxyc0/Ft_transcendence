import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RoomPaginateI } from '../../model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';

import { HttpClientModule, HttpClient } from '@angular/common/http';


import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { RouterModule } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatDividerModule, MatPaginatorModule, MatFormFieldModule, HttpClientModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
	
	rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
	selectedRoom = null;
	userList :object[] = []


	constructor(private route:ActivatedRoute, private router: Router, private chatService: ChatService, public http: HttpClient) {}

	ngOnInit() {
		console.log("OnInit");
		this.chatService.emitPaginateRooms(10, 0);
	}

	// ngAfterViewInit() {
	// 	console.log("Viewinit");
	// 	this.chatService.emitPaginateRooms(10, 0);
	// }

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
