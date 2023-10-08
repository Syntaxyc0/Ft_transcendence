import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friend-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-menu.component.html',
  styleUrls: ['./friend-menu.component.scss']
})
export class FriendMenuComponent {
	@Input() id

	ngOnInit(){
		console.log(this.id)
	}

}
