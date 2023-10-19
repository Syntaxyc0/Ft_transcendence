import { Component, Input, Renderer2, ElementRef,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FriendMenuComponent } from '../friend-menu/friend-menu.component';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FriendMenuComponent],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
	@ViewChild('menu') menu: ElementRef;

	constructor(public http: HttpClient, private renderer: Renderer2) {
		
		this.renderer.listen('window', 'click',(e:Event)=>{
		if(e.target!==this.menu.nativeElement)
		{
			this.showMenu=false;
			}
		})
		this.renderer.listen('window', 'contextmenu',(e:Event)=>{
		if(e.target!==this.menu.nativeElement)
		{
			if (this.toshow)
				this.toshow = false
			else
				this.showMenu = false
		}
		})
		
	}


	@Input() id:number = 0
	showMenu = false
	toshow = false

	 name:string = 'undefined';
	 avatar;

	ngOnInit() {
        this.retrieveFriend();
	}
	retrieveFriend() {
	 this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe(
		res => {
			this.name = res['login'];
		},
		err => {
			alert("user doesn't exist");
		})
		this.get_avatar().subscribe (data => {
			this.createImageFromBlob(data)
		})
	}

	createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.avatar = reader.result;
		 }, false);

		if (image) {
		   reader.readAsDataURL(image);
		}
	 }

	get_avatar() {
		return this.http.get<Blob>("http://localhost:3333/users/" + this.id + "/avatar", { responseType: 'Blob' as 'json' })
	}

	onRightClick(event) {
		event.preventDefault()
		if (!this.showMenu)
		{
			this.toshow = true
		}
		this.toggleMenu()
	}

	toggleMenu(){
		this.showMenu = !this.showMenu;
	  }

}