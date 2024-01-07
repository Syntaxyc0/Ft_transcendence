import { Component, OnInit, Inject } from '@angular/core';
import { UserI } from 'src/app/chat/model/user.interface';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, of, switchMap, take, tap } from 'rxjs';
import { UserService } from 'src/app/chat/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SocketService } from '../../services/socket.service';
import { MatDialogClose } from '@angular/material/dialog';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI } from '../../model/room.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [
	CommonModule,
	MatFormFieldModule,
	MatInputModule,
	MatAutocompleteModule,
	MatOptionModule,
	MatChipsModule,
	FormsModule,
	MatIconModule,
	ReactiveFormsModule,
	MatDialogClose
],
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
})
export class AddUsersComponent implements OnInit{

	room: RoomI;
	UsersRoom: UserI[];

	searchLogin = new FormControl();
	filteredUsers: UserI[] = [];
	selectedUser: UserI | null = null;
	currentUser$: Observable<UserI>;
	currentUserId;
	
	constructor( private userService: UserService,
				 private socketService: SocketService,
				 private socket: CustomSocket,
				 @Inject(MAT_DIALOG_DATA) public data: any) {
		this.room = data.room;
	}


	ngOnInit() : void {
		this.currentUserId = JSON.parse(localStorage.getItem('id')!);

		this.socket.emit("getUsersRoom", this.room);
		this.socket.fromEvent<UserI[]>("UsersRoom").subscribe(value => {
			this.UsersRoom = value;
			
			this.searchLogin.valueChanges.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((login: string) => {
					if ( !login ) {
						this.filteredUsers = []
						return of([])
					}
					return this.userService.findByLogin(login).pipe(
						tap((users: UserI[]) => {
							for (const user of users)
								if (user.id === this.currentUserId || !this.inRoom(user.id))
									users.splice(users.indexOf(user), 1);
							this.filteredUsers = users
						})
					)
				})
			).subscribe();
		});

	}

	addUserToRoom() {
		if (this.selectedUser !== null) {
			this.socket.emit("AddUser", { user: this.selectedUser, room: this.room })
		}

		this.filteredUsers = [];
		this.selectedUser = null;
		this.searchLogin.setValue(null);		
	}

	inRoom(id: number | undefined) {
		for(const user of this.UsersRoom)
			if (id === user.id)
				return true;
		return false;
	}
	// addUserToForm() {
	// 	if (this.selectedUser !== null) {
	// 		this.addUser.emit(this.selectedUser);
	// 	}
	// 	this.filteredUsers = [];
	// 	this.selectedUser = null;
	// 	this.searchLogin.setValue(null);
	// }
	
	
	// removeUserFromForm(user: UserI) {
	// 	this.removeuser.emit(user);
	// }
	
	setSelectedUser(user: any) {
		this.selectedUser = user;
	}
	
	displayFn(user: UserI | undefined): string {
		if (user && user.login) {
			return user.login;
		} else {
			return '';
		}
	}
		}
		
		