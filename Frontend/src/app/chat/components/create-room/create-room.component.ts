import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserI } from 'src/app/chat/model/user.interface';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectUsersComponent } from 'src/app/chat/components/select-users/select-users.component'

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { Observable, take } from 'rxjs';
import { User } from 'src/app/helpers/types';


@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, SelectUsersComponent ],
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

	form: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required]),
		description: new FormControl(null),
		users: new FormArray([],[Validators.required])
	});
	currentUser$: Observable<UserI> = this.socketService.getCurrentUser();

	constructor(private chatService: ChatService, private router: Router, private activateRoute: ActivatedRoute, private socketService: SocketService) {}

	create() {
		if (this.form.valid) {
			this.chatService.createRoom(this.form.getRawValue());
			this.router.navigate(["../chat"]);
		}
	}

	initUser(user: UserI) {
		return new FormControl({
			id: user.id,
			login: user.login,
			email: user.email
		});
	}

	addUser(userFormControl: FormControl) {
		const usersArray = this.form.get('users') as FormArray;
		usersArray.push(userFormControl);
	  }

	removeUser(userId: number | undefined) {
		const usersArray = this.form.get('users') as FormArray;
		const indexToRemove = usersArray.value.findIndex((user: UserI) => user.id === userId);
		if (indexToRemove !== -1) {
		  usersArray.removeAt(indexToRemove);
		}
	  }

	get name(): FormControl {
		return this.form.get('name') as FormControl;
	}

	get description(): FormControl {
		return this.form.get('description') as FormControl;
	}

	get users(): FormControl {
		return this.form.get('users') as FormControl;
	}

	goToDashboard() {
		this.router.navigate(['chat']);
	} 
}
