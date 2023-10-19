import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Input } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-picture',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent {
	constructor(public http: HttpClient, private location: Location) {}

	@Input() id:number = 0;
	name:string = '';
	avatar: any ;

	ngOnInit() {
        this.retrieveUser();
	}
	retrieveUser() {
	 this.http.get<any>("http://localhost:3333/users/" + this.id).subscribe (
		res => {
			this.name = res['login'];
		},
		err => {
			alert("user doesn't exist");
			this.location.back()
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
}
