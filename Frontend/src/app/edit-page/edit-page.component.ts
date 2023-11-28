import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CustomValidators } from '../helpers/custom-validators';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule, RouterModule],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent {

	constructor(public http: HttpClient, private router: Router) {}
	public editForm = new FormGroup({
    Nickname: new FormControl(null, [Validators.required]),

},
{validators: [CustomValidators.nicktoolong]});

	id:number = 0;
	avatar;


	ngOnInit() {
		this.id = JSON.parse(localStorage.getItem('id')!)
		if (!this.id)
			this.router.navigate(["/"])
		this.retrieveUser()
	}

	Edit(): void {
		console.log(this.id)
		this.http.patch<any>('http://localhost:3333/users/' + this.id + '/ChangeNick', {name: this.Nickname.value} ).subscribe(
			res => {this.router.navigate(["/home"])},
			err => { alert(err.error.message)}
		)

			}
			
	get	Nickname(): FormControl
	{
		return this.editForm.get('Nickname') as FormControl;
	}

	retrieveUser() {
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
}
