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


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('registerForm', {
    static: false
  }) registerForm: NgForm;
  public isLogin = true;
  public loading = false;


  constructor(
    private authSvc: AuthenticationService
  ) {}

  ngOnInit() {

  }



  onRegister(): void {
    if (this.registerForm.valid && this.registerForm.value.pw1 === this.registerForm.value.pw2) {
      this.loading = true;
      const email = this.registerForm.value.email;
      const pw = this.registerForm.value.pw1;
      this.authSvc.signupNewUser(email, pw)
        .then(value => console.log(value))
        .catch(error => {
          if (error.code === 'auth/weak-password') {
            alert('The password is too weak. It must be at least 6 characters.');
          }
          console.error(error);
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
