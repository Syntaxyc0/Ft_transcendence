import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { tap, throwError } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../helpers/custom-validators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule, RouterModule ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
	constructor(public http: HttpClient, private router: Router) {}
	public signupForm = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    confirmpassword: new FormControl(null,[Validators.required]),
},
{validators: [CustomValidators.passwordMatching, CustomValidators.logintoolong]});

	id:number = 0;
	signup(): void{
		console.log(
			this.signupForm.controls.login.value,
			this.signupForm.controls.password.value,
			this.signupForm.controls.confirmpassword.value,
			);
			this.http.post<any>('http://localhost:3333/auth/signup', {login: this.login.value, password:this.password.value, confirm_password:this.confirm_password.value}).subscribe(
				res => {
					this.id = res.id;
					localStorage.setItem('token', res.stringify);
					localStorage.setItem('id', JSON.stringify(res['id']));
					localStorage.setItem('login', this.login.value);
					this.http.patch<any>('http://localhost:3333/users/' + this.id + '/status', {status: "ONLINE"})
					this.router.navigate(['/home'])
				},
				err => {
					alert("This login is already taken")
				})
	}

	get	login(): FormControl
	{
		return this.signupForm.get('login') as FormControl;
	}

	get	password(): FormControl
	{
		return this.signupForm.get('password') as FormControl;
	}

	get	confirm_password(): FormControl
	{
		return this.signupForm.get('confirmpassword') as FormControl;
	}
}
