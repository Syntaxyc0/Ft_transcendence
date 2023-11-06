import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-twofa',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './twofa.component.html',
  styleUrls: ['./twofa.component.scss']
})
export class TwofaComponent {
  constructor(public http: HttpClient, private router: Router) {}
	public twofaForm = new FormGroup({
    code: new FormControl(null, [Validators.required]),
});

@Input() id: number = 0;

ngOnInit() {
	this.id = JSON.parse(localStorage.getItem('id')!);
	this.http.get('http://localhost:3333/auth/' + this.id + '/SendMail').subscribe()
}

get	code(): FormControl
{
	return this.twofaForm.get('code') as FormControl;
}

validate()
{
	this.http.post('http://localhost:3333/users/' + this.id + '/verify2facode', {code: this.code.value} ).subscribe(
		res => {
				this.router.navigate(['/home'])
		},
		err => {
		 	alert('Wrong code')
			this.twofaForm.reset()
		}
	)

}

}
