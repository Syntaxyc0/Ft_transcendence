import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserI } from 'src/app/chat/model/user.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { UserService } from 'src/app/chat/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [
	CommonModule,
	MatFormFieldModule,
	MatInputModule,
	MatAutocompleteModule,
	MatOptionModule,
	MatChipsModule,
	FormsModule,
	ReactiveFormsModule],
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
})
export class SelectUsersComponent implements OnInit{

	@Input() users: UserI[] | null = null;
	@Output() addUser: EventEmitter<UserI> = new EventEmitter<UserI>();
	@Output() removeuser: EventEmitter<UserI> = new EventEmitter<UserI>();

	allUsers: UserI[] = [];
	selectedLogins: string[] = [];
	searchLogin = new FormControl();
	user: UserI;

	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.userService.getAllUsers();
	}

	toggleSelection(login: string | undefined): void {
		if (!login) return;

		const index = this.selectedLogins.indexOf(login);
		
		if (index !== -1) {
		  this.selectedLogins.splice(index, 1);
		} else {
		  this.selectedLogins.push(login);
		}
	}

	
	// ngOnInit() : void {
	// 	this.searchLogin.valueChanges.pipe(
	// 		debounceTime(500),
	// 		distinctUntilChanged(),
	// 		switchMap((login: string) => this.userService.findByLogin(login).pipe(
	// 			tap((users: UserI[]) => this.filteredUsers = users)
	// 		))
	// 	).subscribe();
	// }

	// addUserToForm() {
	// 	if (this.selectedUser !== null) {
	// 	  this.addUser.emit(this.selectedUser);
	// 	}
	// 	this.filteredUsers = [];
	// 	this.selectedUser = null;
	// 	this.searchLogin.setValue(null);
	//   }
	  

	// removeUserFromForm(user: UserI) {
	// 	this.removeuser.emit(user);
	// }

	// setSelectedUser(user: UserI) {
	// 	this.selectedUser = user;
	// }

	displayFn = (user: UserI | undefined): string => {
	  if (user && user.login) {
	    return user.login;
	  } else {
	    return '';
	  }
	}
}

