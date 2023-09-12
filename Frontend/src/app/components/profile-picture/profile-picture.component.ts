import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
	@Input() login:string = ""
	@Input() avatar_url:string = "https://bellard.org/bpg/2.png"

}
