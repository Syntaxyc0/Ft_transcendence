import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { AddFriendComponent } from '../components/add-friend/add-friend.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HomeComponent, HeaderbarComponent, AddFriendComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

}
