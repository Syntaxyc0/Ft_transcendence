import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {

	constructor(private readonly router: Router, public http: HttpClient) {}
	id: string | null

	logout()
	{
		this.id = localStorage.getItem('id')
		localStorage.clear()
		this.router.navigate(['/landing'])
	}
}
