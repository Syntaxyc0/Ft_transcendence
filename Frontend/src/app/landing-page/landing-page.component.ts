import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

	constructor(public http: HttpClient, private route: ActivatedRoute) {}
	code: any
	ngOnInit()
	{
		this.route.queryParams.subscribe(params => {
			this.code = params['code'];
		})
		console.log(this.code)
	}
	async onClick() {
		try {
			console.log(this.code)
			this.http.post("http://localhost:3333/auth/42redirect", {code: this.code}).subscribe(
				response => {
					
				},
				error => {console.log(error)}
			)
		}
		catch (err) {
			console.log(err)
		}
	}

	name: string = "test"
}
