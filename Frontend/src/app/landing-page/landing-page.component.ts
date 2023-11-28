import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

	constructor() {}
	code: any
	redirect_url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-4b973edf6fe00427742801309510c161180a1daa57bf6b884c1bd6a5939788fe&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fredirect&response_type=code"
}
