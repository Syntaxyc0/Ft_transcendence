import { Component } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserI } from 'src/app/model/user.interface';
import { ChatService } from '../../services/chat-service/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

	form: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required]),
		description: new FormControl(null),
		users: new FormArray([],[Validators.required])
	});

	constructor(private chatService: ChatService, private router: Router, private activateRoute: ActivatedRoute) {

	}

	create() {
		if (this.form.valid) {
			this.chatService.createRoom(this.form.getRawValue());
			this.router.navigate(["../dashboard"], {relativeTo: this.activateRoute});
		}
	}

	initUser(user: UserI) {
		return new FormControl({
			id: user.id,
			username: user.username,
			email: user.email
		});
	}

	// addUser(userFormControl: FormControl) {
	// 	this.users.push(userFormControl);
	// }
	addUser(userFormControl: FormControl) {
		const usersArray = this.form.get('users') as FormArray;
		usersArray.push(userFormControl);
	  }

	// removeUser(userId: number) {
	// 	this.users.removeAt(this.users.value.findIndex((user: UserI) => user.id === userId));
	// }
	removeUser(userId: number) {
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
}
