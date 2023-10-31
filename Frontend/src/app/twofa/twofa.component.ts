import { Component } from '@angular/core';
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

get	code(): FormControl
	{
		return this.twofaForm.get('code') as FormControl;
	}

validate()
{

}
}
