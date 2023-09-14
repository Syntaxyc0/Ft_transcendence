import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from '../components/friendlist/friendlist.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { User } from '../helpers/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FriendlistComponent, HeaderbarComponent, ProfilePictureComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

	id:number = 1;
	ngOnInit() {
		this.id = JSON.parse(localStorage.getItem('id')!)

	  }

}
