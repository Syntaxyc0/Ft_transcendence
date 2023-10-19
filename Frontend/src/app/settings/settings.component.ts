import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { AddFriendComponent } from '../components/add-friend/add-friend.component';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { Input } from '@angular/core';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LogoutButtonComponent } from '../components/logout-button/logout-button.component';
import { TwofatogglebarComponent } from '../components/twofatogglebar/twofatogglebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HomeComponent, HeaderbarComponent, AddFriendComponent, GamehistoryComponent, ProfilePictureComponent, HttpClientModule, LogoutButtonComponent, TwofatogglebarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
@Input() id:number = 0

ngOnInit() {
  this.id = JSON.parse(localStorage.getItem('id')!)
}
}
