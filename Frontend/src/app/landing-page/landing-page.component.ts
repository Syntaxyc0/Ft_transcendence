import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

	constructor(public http: HttpClient) {}
	onClick(): void {
		this.http.get("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-000e4b8f9307f65844fe94cf2de9ad19e124143666cadeb78d8a1b7755a42b3f&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42redirect&response_type=code").subscribe(
			data => {
				console.log(data)
			},
			err => console.error(err),
		)
		
	}

	name: string = "test"
}
