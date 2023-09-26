import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from '../components/friendlist/friendlist.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { User } from '../helpers/types';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FriendlistComponent, HeaderbarComponent, ProfilePictureComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	constructor(public http: HttpClient, private route:ActivatedRoute) {}


	id:number = 1;
	code: string 
	ngOnInit() {
		
		  this.id = JSON.parse(localStorage.getItem('id')!)
		  this.getcode();
		  if (this.code !== undefined)
		  {

			  const payload = {
				  grant_type: "authorization_code",
				  client_id: "u-s4t2ud-000e4b8f9307f65844fe94cf2de9ad19e124143666cadeb78d8a1b7755a42b3f",
				  client_secret: "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",
				  code:	this.code,
				  redirect_uri: "http://localhost:4200/home"
				}
				this.http.post("https://api.intra.42.fr/oauth/token", payload).subscribe(
					res => {
						const headers= new HttpHeaders().set('Authorization', "Bearer " + res['access_token']);
						console.log(headers['Authorization'])
						console.log(res);
						this.http.get("https://api.intra.42.fr/v2/me", {headers: headers}).subscribe(
                            res => {
								console.log(res);
							},
							 err => {
                                console.log(err);
                            })
					},
					err => {
						console.log(err);
					}
					)
					
				}
	  }
	  getcode(): void
	  {
		  this.route.queryParams.subscribe(params => {
			  this.code = params['code'];
		  })
	  }

}
