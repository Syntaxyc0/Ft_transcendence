import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-headerbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss']
})
export class HeaderbarComponent {
	id:number=0;
	ngOnInit()
	{
		this.getId();
	}
	getId()
	{
		this.id = JSON.parse(localStorage.getItem('id')!);
	}
}
