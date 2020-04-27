import {
  Injectable
} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import {
  Observable,
  Subscription
} from 'rxjs';
import {
  AuthenticationService
} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  private isInitial = true;
  private firstSubscription: Subscription;

  constructor(
    private authSvc: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {

    if (this.isInitial) {
      // console.log('INITIAL can activate', state.url);
      this.isInitial = false;
      return new Promise((resolve, reject) => {
        this.firstSubscription = this.authSvc.getAuthStateChangedSubject()
          .subscribe((authenticated) => {
            if (authenticated) {
              // console.log('authenticated')
              return resolve(true);
            } else {
              // console.log('not authenticated')
              this.router.navigate(['/login']);
              return resolve(false);
            }
          });
      });
    } else {
      this.firstSubscription.unsubscribe();
      // console.log('can activate', state.url);
      if (this.authSvc.isAuthenticated()) {
        // console.log('authenticated')
        return true;
      } else {
        // console.log('not authenticated')
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    return this.canActivate(childRoute, state);
  }
}
