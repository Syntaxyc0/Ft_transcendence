import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { tap, throwError } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../helpers/custom-validators';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
	constructor(public http: HttpClient) {}
	public signupForm = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    confirmpassword: new FormControl(null,[Validators.required]),
},
{validators: CustomValidators.passwordMatching});

	signup(): void {
		console.log(
			this.signupForm.controls.login.value,
			this.signupForm.controls.password.value,
			this.signupForm.controls.confirmpassword.value,
			);
		this.http.post("http://localhost:3333/auth/signup", {login: "test", password:"test", confirm_password:"test"})
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
