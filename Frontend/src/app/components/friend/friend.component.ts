import { Component, Input, Renderer2, ElementRef,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FriendMenuComponent } from '../friend-menu/friend-menu.component';
import { BACKEND } from 'src/app/env';
import { CustomSocket } from 'src/app/chat/sockets/custom-socket';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FriendMenuComponent],
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent {
	@ViewChild('menu') menu: ElementRef;

	constructor(private socket: CustomSocket, public http: HttpClient, private renderer: Renderer2) {
		
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
	status : string = "";

	 name:string = 'undefined';
	 avatar;

	ngOnInit() {
        this.retrieveFriend();
		this.getUserStatus();
	}
	retrieveFriend() {
	 this.http.get<any>(BACKEND.URL + "users/" + this.id).subscribe(
		res => {
			this.name = res['login'];
		})
		this.get_avatar().subscribe (data => {
			this.createImageFromBlob(data)
		})
	}

	getUserStatus()
	{
		this.http.get<any>(BACKEND.URL + "users/" + this.id + "/getstatus").subscribe(
		res => {
			this.status = res['status'];
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
		return this.http.get<Blob>(BACKEND.URL + "users/" + this.id + "/avatar", { responseType: 'Blob' as 'json' })
	}

	onRightClick(event) {
		this.socket.emit("whatStatus", this.id);

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