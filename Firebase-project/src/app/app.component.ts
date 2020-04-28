import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './login/authentication.service';
import { COLORS } from './shared/global-functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public primaryColor = COLORS.$primary;

  constructor(
    private router: Router,
    private authSvc: AuthenticationService
  ) {}

  ngOnInit(): void {
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isAuthenticated(): boolean {
    return this.authSvc.isAuthenticated();
  }
}
