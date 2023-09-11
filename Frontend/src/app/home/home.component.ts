import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendlistComponent } from '../components/friendlist/friendlist.component';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FriendlistComponent, HeaderbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	login: string = '';

	ngOnInit() {
		this.login = localStorage.getItem('login')?? '';
	  }

}
