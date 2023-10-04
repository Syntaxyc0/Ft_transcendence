import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {
  constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  code: any
  ngOnInit()
	{
		this.route.queryParams.subscribe(params => {
			this.code = params['code'];
		})
    try {
			this.http.post("http://localhost:3333/auth/42redirect", {code: this.code}).subscribe(
				response => {
          localStorage.setItem('access_token', response['access_token'])
          localStorage.setItem('id', response['id'])
          this.router.navigate(['home']);
				},
				error => {console.log(error)}
			)
		}
		catch (err) {
			console.log(err)
		}
	}
}
