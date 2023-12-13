import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { tap, throwError } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../helpers/custom-validators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomSocket } from '../chat/sockets/custom-socket';
import { FooterBarComponent } from '../components/footer-bar/footer-bar.component';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule, RouterModule, FooterBarComponent],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
	constructor(public http: HttpClient, private router: Router) {}

	public signinForm = new FormGroup({
    	login: new FormControl(null, [Validators.required]),
    	password: new FormControl(null, [Validators.required]),
	});

    signin(): void {
		this.http.post<any>('http://localhost:3333/auth/signin', {login: this.login.value, password:this.password.value}).subscribe(
				res => {
					localStorage.setItem('access_token', res['access_token']);
					localStorage.setItem('id', JSON.stringify(res['id']));
					// this.http.patch<any>('http://localhost:3333/users/' + res['id'] + '/status', {status: "ONLINE"}).subscribe()
					this.http.get<any>('http://localhost:3333/users/' + res['id'] + '/2faenabled').subscribe( res => {
						if (res === false)
						{
							localStorage.setItem('is_authenticated', 'true');
							this.router.navigate(['/home'])
						}
						else
						{
							this.router.navigate(['/twofa'])
						}

					})
				},
				err => {
					alert("User not found")
				})
	}
	

	get	login(): FormControl
	{
		return this.signinForm.get('login') as FormControl;
	}

	get	password(): FormControl
	{
		return this.signinForm.get('password') as FormControl;
	}
}