import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings.component';

@Component({
  selector: 'app-headerbar',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsComponent],
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
