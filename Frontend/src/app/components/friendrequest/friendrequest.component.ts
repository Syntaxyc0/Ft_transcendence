import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-friendrequest',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './friendrequest.component.html',
  styleUrls: ['./friendrequest.component.scss']
})
export class FriendrequestComponent {

	constructor(public http: HttpClient) {}
	@Input() Id:number = 0;
	name:string = "";
	avatar;


	ngOnInit() {
        this.retrieveFriend();
	}
	retrieveFriend() {
	 this.http.get<any>("http://localhost:3333/users/" + this.Id).subscribe(
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
		return this.http.get<Blob>("http://localhost:3333/users/" + this.Id + "/avatar", { responseType: 'Blob' as 'json' })
	}


	accept()
	{
		this.http.patch("http://localhost:3333/users/" + localStorage.getItem('id') + "/AcceptRequest", {id: this.Id}).subscribe(
			res => {
				window.location.reload()
			},
            err => {
				alert(err.error.message);
			}
			);
		}
		
		deny()
		{
			this.http.patch("http://localhost:3333/users/" + localStorage.getItem('id') + "/RefuseRequest", {id: this.Id}).subscribe(
				res => {
					window.location.reload()
				},
				err => {
					alert(err.error.message);
				}
				);
		}
	}
