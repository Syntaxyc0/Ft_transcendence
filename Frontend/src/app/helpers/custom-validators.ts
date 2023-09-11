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
	static	logintoolong(control: AbstractControl): ValidationErrors | null
	{
		const login = control.get('login')?.value;
		if (login)
		{
			if (login.length < 15)
			{
				return null;
			}
			else
			{
				return {logintoolong: true};
			}
		}
		else return null

	}
}