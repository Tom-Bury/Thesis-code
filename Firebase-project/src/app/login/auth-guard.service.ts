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
import { UserService } from '../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  private isInitial = true;
  private firstSubscription: Subscription;

  constructor(
    private authSvc: AuthenticationService,
    private currUser: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {

    // On initial fetch of login page: wait for automatic user auth --> if auth go to home iso login
    if (state.url === '/login' && this.isInitial) {
      this.isInitial = false;
      return new Promise((resolve, reject) => {
        this.firstSubscription = this.authSvc.getAuthStateChangedSubject()
          .subscribe((authenticated) => {
            if (authenticated) {
              this.router.navigate(['/home']);
              return resolve(false);
            } else {
              this.router.navigate(['/login']);
              return resolve(true);
            }
          });
      });

      // On initial fetch of other pages: wait for automatic user auth --> if auth allow, else reroute to login
    } else if (this.isInitial) {
      this.isInitial = false;
      return new Promise((resolve, reject) => {
        this.firstSubscription = this.authSvc.getAuthStateChangedSubject()
          .subscribe((authenticated) => {
            if (authenticated) {
              if (state.url.startsWith('/forum') && !this.currUser.userHasForumAccess()) {
                this.router.navigate(['/']);
                resolve(false);
              } else {
                resolve(true);
              }
            } else {
              this.router.navigate(['/login']);
              return resolve(false);
            }
          });
      });

      // On internal routing: allow all if authanticated, if not auth reroute login page (unless already going there)
    } else {
      this.firstSubscription.unsubscribe();
      if (this.authSvc.isAuthenticated()) {
        if (state.url.startsWith('/forum') && !this.currUser.userHasForumAccess()) {
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      } else {
        if (state.url !== '/login') {
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      }
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    return this.canActivate(childRoute, state);
  }
}
