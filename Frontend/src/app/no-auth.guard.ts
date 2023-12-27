import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { HttpClientModule, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class NoAuthGuard implements CanActivate {
  constructor( private readonly router: Router, private http: HttpClient) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	if (localStorage.getItem('access_token') && localStorage.getItem('id') && localStorage.getItem('is_authenticated'))
	{
		this.router.navigateByUrl('/home');
		return false
	}
	return true
  }

  check_token(token) {
    return this.http.post("http://localhost:3333/auth/check", {token})
	}

  check_2fastatus(id)
  {
    return this.http.get("http://localhost:3333/auth/" + id + "/check2fa")
  }
}