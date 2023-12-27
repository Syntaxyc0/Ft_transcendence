import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatButtonToggle, MatButtonToggleModule} from '@angular/material/button-toggle'

@Component({
  selector: 'app-twofatogglebar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatButtonToggleModule],
  templateUrl: './twofatogglebar.component.html',
  styleUrls: ['./twofatogglebar.component.scss']
})
export class TwofatogglebarComponent {
  constructor(public http: HttpClient) {}

  @Input() id:number=0
  selectedVal: string = 'disable'

	ngOnInit() {
		this.http.get<any>('http://localhost:3333/users/' + this.id + '/2faenabled').subscribe(
			res => {
				if (res)
					this.selectedVal = 'enable'
				else
					this.selectedVal = 'disable'

			}
		)
	}

  onValChange(val:string)
  {
    if (val === 'enable')
	{
		this.selectedVal = 'enable'
		this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: true}).subscribe()
	}
    else
	{
		this.selectedVal = 'disable'
		this.http.post<any>('http://localhost:3333/users/' + this.id + '/switch2fa', {activated: false}).subscribe()
	}
  }


}
