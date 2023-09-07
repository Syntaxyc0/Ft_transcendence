import { Routes } from '@angular/router';

export const routes: Routes = [{
	path:	'',
    redirectTo:    '/home',
    pathMatch:    'full'
},
{
	path:	'signup',
	loadComponent:    () => import('./signup/signup.component').then(m => m.SignupComponent),
},
{
	path:    'home',
	loadComponent:    () => import('./home/home.component').then(m => m.HomeComponent),
},
{
    path:    'settings',
    loadComponent:    () => import('./settings/settings.component').then(m => m.SettingsComponent),
},
{
	path:    'profile',
	loadComponent:    () => import('./profile/profile.component').then(m => m.ProfileComponent),
},
];
