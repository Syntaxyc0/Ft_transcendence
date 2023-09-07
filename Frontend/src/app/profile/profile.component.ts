import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

}
