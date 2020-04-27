import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../login/authentication.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authSvc: AuthenticationService,
    public currUser: UserService
  ) { }

  ngOnInit() {
  }

  onLogout(): void {
    this.authSvc.logoutUser();
  }

}
