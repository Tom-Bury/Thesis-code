import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  private isInitial = true;

  constructor(
    private authSvc: AuthenticationService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.isInitial) {
      // console.log('INITIAL can activate', state.url);
      this.isInitial = false;

      return new Promise((resolve, reject) => {

        setTimeout(() => {
          if  (this.authSvc.isAuthenticated()) {
            // console.log('authenticated')
            return resolve(true);
          } else {
            // console.log('not authenticated')
            this.router.navigate(['/login']);
            return resolve(false);
          }
        }, 2000);
      });
    }
    else {
      // console.log('can activate', state.url);
      if  (this.authSvc.isAuthenticated()) {
        // console.log('authenticated')
        return true;
      } else {
        // console.log('not authenticated')
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}
