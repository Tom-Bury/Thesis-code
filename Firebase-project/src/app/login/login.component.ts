import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  AuthenticationService
} from './authentication.service';
import {
  NgForm
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('registerForm', {
    static: false
  }) registerForm: NgForm;

  @ViewChild('loginForm', {
    static: false
  }) loginForm: NgForm;
  public isLogin = true;
  public loading = false;
  public loginError = false;
  public registerError = false;
  public weakPwError = false;


  constructor(
    private authSvc: AuthenticationService
  ) {}

  ngOnInit() {

  }


  onLogin(): void {
    if (this.loginForm.valid) {
      this.loginError = false;
      this.loading = true;
      const email = this.loginForm.value.email;
      const pw = this.loginForm.value.pw;

      this.authSvc.loginUser(email, pw)
        .then(value => {
          // console.log('Login', value);
          this.loginError = false;
        })
        .catch(error => {
          // console.error('Login', error);
          this.loginError = true;
          this.loading = false;
        })
        .finally(() => {
          this.loginForm.reset();
        });
    } else {
      console.error('Invalid forms can\'t be submitted.');
    }
  }



  onRegister(): void {
    if (this.registerForm.valid && this.registerForm.value.pw1 === this.registerForm.value.pw2) {
      this.loading = true;
      this.registerError = false;
      this.weakPwError = false;
      const email = this.registerForm.value.email;
      const pw = this.registerForm.value.pw1;
      const username = this.registerForm.value.uname;
      this.authSvc.signupNewUser(email, pw, username)
        .then(value => {
          // console.log('Register', value);
          this.registerError = false;
        })
        .catch(error => {
          if (error.code === 'auth/weak-password') {
            this.weakPwError = true;
          } else {
            this.registerError = true;
          }
          console.error('Register', error);
        })
        .finally(() => {
          this.loading = false;
          this.registerForm.reset();
        });
    } else {
      console.error('Invalid forms can\'t be submitted.');
    }
  }

  toggleLogin(): void {
    this.isLogin = !this.isLogin;
  }



}
