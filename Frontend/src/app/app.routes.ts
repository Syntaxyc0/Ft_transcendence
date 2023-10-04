import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [{
	path:	'',
    redirectTo:    '/landing',
    pathMatch:    'full'
},
{
	path:	'landing',
	title:	'Welcome',
	loadComponent:    () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
},
{
	path:	'redirect',
	title:	'Redirect',
	loadComponent:    () => import('./redirect/redirect.component').then(m => m.RedirectComponent),
},
{
	path:	'signup',
	title:	'Sign up',
	loadComponent:    () => import('./signup/signup.component').then(m => m.SignupComponent),
},
{
	path:	'signin',
	title:	'Sign in',
	loadComponent:    () => import('./signin/signin.component').then(m => m.SigninComponent),
},
{
	path:    'home',
	title:	'Home',
	canActivate: [AuthGuard],
	loadComponent:    () => import('./home/home.component').then(m => m.HomeComponent),
},
{
    path:    'settings',
	title:	'Settings',
    loadComponent:    () => import('./settings/settings.component').then(m => m.SettingsComponent),
},
{
	path:    'profile',
	title:	'Profile',
	loadComponent:    () => import('./profile/profile.component').then(m => m.ProfileComponent),
},
{
	path:    'profile/:id',
	title:	'Profile',
	loadComponent:    () => import('./profile/profile.component').then(m => m.ProfileComponent),
},
];
