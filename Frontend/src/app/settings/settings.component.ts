import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { AddFriendComponent } from '../components/add-friend/add-friend.component';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { Input } from '@angular/core';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HomeComponent, HeaderbarComponent, AddFriendComponent, GamehistoryComponent, ProfilePictureComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

}
