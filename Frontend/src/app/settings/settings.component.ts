import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { AddFriendComponent } from '../components/add-friend/add-friend.component';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { Input } from '@angular/core';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutButtonComponent } from '../components/logout-button/logout-button.component';
import { TwofatogglebarComponent } from '../components/twofatogglebar/twofatogglebar.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HomeComponent, HeaderbarComponent, AddFriendComponent, GamehistoryComponent, ProfilePictureComponent, HttpClientModule, LogoutButtonComponent, TwofatogglebarComponent, MatButtonToggleModule, MatIconModule, MatMenuModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
	constructor(private readonly router: Router, public http: HttpClient) {}

	@Input() id:number = 0
	selectedVal: string = 'disable'
	
	
	ngOnInit() {
	this.id = JSON.parse(localStorage.getItem('id')!)
	this.http.get<any>('http://localhost:3333/users/' + this.id + '/2faenabled').subscribe(
		res => {
			if (res)
				this.selectedVal = 'enable'
			else
				this.selectedVal = 'disable'

		}
	)
	}	

	onValChange(val:string)
	{
		if (val === 'enable')
		{
			this.selectedVal = 'enable'
			this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: true}).subscribe()
		}
		else
		{
			this.selectedVal = 'disable'
			this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: false}).subscribe()
		}
	}

	logout()
	{
		this.http.get('http://localhost:3333/users/' + this.id + '/logout').subscribe()
		localStorage.clear()
		this.router.navigate(['/landing'])
	}

}
