import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { UserI } from 'src/app/chat/model/user.interface';
import { catchError, tap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient, private snackbar: MatSnackBar) { }
	users$: Observable<UserI[]>;
	
	findByLogin(login: string): Observable<UserI[]> {
		this.users$ = this.http.get<UserI[]>(`http://localhost:3333/users/find-by-login/${login}`)
		

		// exemple de suscribe:
		// this.users$.subscribe((users) => {
		// 	console.log('dans le userService du Front :', users);});

		return this.users$;
	}
}
