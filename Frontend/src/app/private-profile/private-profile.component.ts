import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderbarComponent } from '../components/headerbar/headerbar.component';
import { ProfilePictureComponent } from '../components/profile-picture/profile-picture.component';
import { GamehistoryComponent } from '../components/gamehistory/gamehistory.component';
import { PictureComponent } from '../components/picture/picture.component';
import { FriendrequestComponent } from '../components/friendrequest/friendrequest.component';
import { RequestSentComponent } from '../components/request-sent/request-sent.component';

@Component({
  selector: 'app-private-profile',
  standalone: true,
  imports: [CommonModule, HeaderbarComponent, HttpClientModule, RouterModule, ProfilePictureComponent, GamehistoryComponent, PictureComponent,FriendrequestComponent, RequestSentComponent],
  templateUrl: './private-profile.component.html',
  styleUrls: ['./private-profile.component.scss']
})
export class PrivateProfileComponent {

}
