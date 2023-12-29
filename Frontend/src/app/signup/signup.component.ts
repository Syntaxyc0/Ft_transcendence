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
	mail: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    confirmpassword: new FormControl(null,[Validators.required]),
},
{validators: [CustomValidators.passwordMatching, CustomValidators.logintoolong]});

	id:number = 0;
	signup(): void{
			this.http.post<any>('http://localhost:3333/auth/signup', {email: this.mail.value, password:this.password.value, confirm_password:this.confirm_password.value}).subscribe(
				res => {
					this.id = res.id;
					localStorage.setItem('access_token', res["access_token"]);
					localStorage.setItem('id', JSON.stringify(res['id']));
					this.router.navigate(['/edit']	)
				},
				err => {
					alert(err.error.message)
				})
			}
			
	get	mail(): FormControl
	{
		return this.signupForm.get('mail') as FormControl;
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
