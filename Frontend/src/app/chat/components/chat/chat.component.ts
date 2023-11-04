import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RoomPaginateI } from '../../model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit{
	
	rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms();
	selectedRoom = null;

	constructor(private route:ActivatedRoute, private router: Router, private chatService: ChatService) {}

	ngOnInit() {
		this.chatService.emitPaginateRooms(10, 0);
	}

	ngAfterViewInit() {
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
