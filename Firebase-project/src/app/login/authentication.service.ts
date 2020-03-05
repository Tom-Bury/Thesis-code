import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: AngularFireAuth
  ) { }


  public signupNewUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.auth.auth.createUserWithEmailAndPassword(email, password);
  }
}
