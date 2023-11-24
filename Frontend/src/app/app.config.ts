import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
	providers: [provideRouter(routes), provideHttpClient(withJsonpSupport()), provideAnimations()],
		};

export function tokenGetter() {
	let token = localStorage.getItem("access_token");

	console.log("token Getter :", token);

	if (token)
		return token;
	else
		return  '';
}
