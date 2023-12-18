import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent {

	constructor(public http: HttpClient, private router: Router) {};

	public SearchForm = new FormGroup({
		name: new FormControl(null, [Validators.required])
	});

	showModal = false;

	toggleModal(){
	  this.showModal = !this.showModal;
	}
	
	searchUser(){
		this.toggleModal()
		this.http.get("http://localhost:3333/users/" + this.SearchForm.value.name + '/id').subscribe(
			res => {
				this.http.get("http://localhost:3333/users/" + res + '/search').subscribe()
				this.router.navigate(['/user'],  { queryParams: { id: res } })
			},
            err => {
				alert(err.error.message);
			}
			);
		this.SearchForm.reset();
    }
	
	closeButton(){
		this.SearchForm.reset(); 
		this.toggleModal()
	}

	enterKey(){
		this.searchUser()
	  }

}
