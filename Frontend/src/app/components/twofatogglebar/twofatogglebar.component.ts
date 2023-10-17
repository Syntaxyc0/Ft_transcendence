import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-twofatogglebar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './twofatogglebar.component.html',
  styleUrls: ['./twofatogglebar.component.scss']
})
export class TwofatogglebarComponent {
  
  constructor(public http: HttpClient) {}

  @Input() id:number=0

  getvalue(event)
  {
    if (event.target.checked)
     this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: true}).subscribe()
    else
      this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: false}).subscribe()
  }

}
