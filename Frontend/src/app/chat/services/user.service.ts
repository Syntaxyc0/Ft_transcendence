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

  
	findByLogin(login: string): Observable<UserI[]> {
		return this.http.get<UserI[]>(`http://localhost:3333/users/find-by-login/${login}`);
	}

	getAllUsers(): Observable<UserI[]> {
		return this.http.get<UserI[]>(`http://localhost:3333/users/all-users`);
	}


//   create(user: UserI): Observable<UserI> {
// 	return this.http.post<UserI>('api/users', user).pipe(
// 		tap((createdUser: UserI) => this.snackbar.open(`User ${createdUser.username} creatded succefully`, 'Close' ,{
// 			duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
// 		} )),
// 		catchError(e => {
// 			this.snackbar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
// 				duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
// 			})
// 			return throwError(e)
// 		})
// 	)
//   }
}
