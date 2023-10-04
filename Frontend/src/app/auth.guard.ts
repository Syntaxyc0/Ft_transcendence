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
      this.router.navigateByUrl('/');
      return false;
    }
    try {
      this.check_token().subscribe({
        next: (val) => {
          if (!val) {
            this.router.navigateByUrl('/');
            return false;
          }
          return true;
        },
        error: (e) => {
          localStorage.clear();
          this.router.navigateByUrl('/');
          return false;
        },
      });
    }
	catch (e) {
      console.log('An error occured : ', e);
      localStorage.clear();
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  check_token() {
    return this.http.get<boolean>("http://localhost:3333/auth/check")
	}
}