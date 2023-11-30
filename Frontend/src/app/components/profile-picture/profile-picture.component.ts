import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Input } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-profile-picture',
	standalone: true,
	imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
	templateUrl: './profile-picture.component.html',
	styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
	
	constructor(public http: HttpClient, private location: Location, private router: Router) {}
	
	@Input() id:number = 0;
	name:string = '';
	avatar: any ;
	showModal = false;
	
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
			this.router.navigate(['/'])
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
	  
		this.http.post<any>(url, formData).subscribe({
		  next: (data: any) => window.location.reload(),
		  error: (error: any) => console.log(error)
		})
	}


	public editNameForm = new FormGroup({
		name: new FormControl(null, [Validators.required])
	});


	toggleModal(){
	  this.showModal = !this.showModal;
	}
	
	editName(){
		this.toggleModal()
		this.http.patch("http://localhost:3333/users/" + this.id + "/editName", {userName:this.editNameForm.value.name}).subscribe(
			res => {
				window.location.reload()
			},
            err => {
				alert(err.error.message);
			}
			);
		this.editNameForm.reset();
    }
	
	closeButton(){
		this.editNameForm.reset(); 
		this.toggleModal()
	}

	enterKey(){
		this.editName()
	  }
}
