import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { RoomI } from '../../model/room.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invite-to-play',
  standalone: true,
  imports: [
	CommonModule,
	MatIconModule,
	MatDialogClose,
	MatDialogContent,
	MatDialogActions,
	MatButtonModule,
	MatDialogTitle,
],
  templateUrl: './invite_to_play.component.html',
  styleUrls: ['./invite_to_play.component.scss'],
})
export class invite_to_playComponent implements OnInit{

	login: string;
	currentUserId;
	
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		this.login = data.login;
	}


	ngOnInit() : void {
		this.currentUserId = JSON.parse(localStorage.getItem('id')!);
	}

}
		
		