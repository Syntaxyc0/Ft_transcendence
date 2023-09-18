import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-picture',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {

	constructor(public http: HttpClient) {}

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

	selectedFile: File

	onFileChanged(event) {
	  this.selectedFile = event.target.files[0]

	  const url = "http://localhost:3333/users/" + this.id + "/upload";
	  
		const formData = new FormData();
		formData.append('file', this.selectedFile);
	  
		let headers = new HttpHeaders();
		headers = headers.append('Content-Type', 'multipart/form-data');
		headers = headers.append('Accept', '*/*');
	  
		this.http.post<any>(url, formData).subscribe({
		  next: (data: any) => window.location.reload(),
		  error: (error: any) => console.log(error)
		})
	}

}
