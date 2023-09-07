import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators
{
	static	passwordMatching(control: AbstractControl): ValidationErrors | null
	{
		const password = control.get('password')?.value;
		const confirmpassword = control.get('confirmpassword')?.value;

		if (password === confirmpassword && (password !== null && confirmpassword !== null))
		{
			return null;
		}
		else
		{
			return {passwordsNotMatching: true};
		}

	}
}