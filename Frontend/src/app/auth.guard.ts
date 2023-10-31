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
}