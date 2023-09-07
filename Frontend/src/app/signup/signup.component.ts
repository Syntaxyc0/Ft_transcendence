import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { tap, throwError } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
	constructor(public http: HttpClient) {}
	public signupForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
    confirmpassword: new FormControl(''),
});

	signup(): void {
		console.log(
			this.signupForm.controls.login.value,
			this.signupForm.controls.password.value,
			this.signupForm.controls.confirmpassword.value,
			);
		this.http.post("http://localhost:3333/auth/signup", {login: "test", password:"test", confirm_password:"test"})
}
}
