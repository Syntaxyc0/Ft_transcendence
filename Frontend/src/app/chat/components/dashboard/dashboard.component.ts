import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from '../../chat-service/chat.service';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { RoomPaginateI } from 'src/app/chat/model/room.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{

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
		  this.router.navigate(['create-room']);
	  }
}
