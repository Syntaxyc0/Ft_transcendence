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
export class AuthGuard implements CanActivate {
  constructor( private readonly router: Router, private http: HttpClient) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!localStorage.getItem('access_token'))
	{
      localStorage.clear();
      this.router.navigateByUrl('/landing');
      return false;
    }
    else if (!localStorage.getItem('id'))
	  {
      localStorage.clear();
      this.router.navigateByUrl('/landing');
      return false;
    }
    try {
      this.check_token(localStorage.getItem('access_token')).subscribe({
        next: (val) => {
          if (!val) {
		      	localStorage.clear();
            this.router.navigateByUrl('/landing');
            return false;

          }
          return true;
        },
        error: (e) => {
          localStorage.clear();
          this.router.navigateByUrl('/landing');
          return false;
        },
      });
      this.check_2fastatus(localStorage.getItem('id')).subscribe({
        next: (val) => {
          if (!val) {
		      	localStorage.clear();
            this.router.navigateByUrl('/landing');
            return false;

          }
          return true;
        },
        error: (e) => {
          localStorage.clear();
          this.router.navigateByUrl('/landing');
          return false;
        },
      });
    }
	catch (e) {
      console.log('An error occured : ', e);
      localStorage.clear();
      this.router.navigateByUrl('/landing');
      return false;
    }
    return true;
  }

  check_token(token) {
    return this.http.post("http://localhost:3333/auth/check", {token})
	}

  check_2fastatus(id)
  {
    return this.http.get("http://localhost:3333/auth/" + id + "/check2fa")
  }
}

export class NoAuthGuard implements CanActivate {
  constructor( private readonly router: Router, private http: HttpClient) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	if (localStorage.getItem('access_token') && localStorage.getItem('id'))
		return true
	return false
  }

  check_token(token) {
    return this.http.post("http://localhost:3333/auth/check", {token})
	}

  check_2fastatus(id)
  {
    return this.http.get("http://localhost:3333/auth/" + id + "/check2fa")
  }
}