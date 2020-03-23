import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  Router
} from '@angular/router';
import {
  environment
} from 'src/environments/environment';
import {
  User
} from '../shared/interfaces/user/user.model';
import {
  UserService
} from '../shared/services/user.service';
import { FirestoreService } from '../shared/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authenticated = false;

  constructor(
    private afAuth: AngularFireAuth,
    private db: FirestoreService,
    private router: Router,
    private userSvc: UserService
  ) {

    // Automatically register logged in user info in UserService
    afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userSvc.loginUser(user.uid);
        this.authenticated = true;
      } else {
        this.userSvc.logOutUser();
        this.authenticated = false;
      }
    });
  }


  // -------------------------
  // Public facing methods
  // -------------------------

  public signupNewUser(email: string, password: string, username: string): Promise < any > {
    let authStateUnsub;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        authStateUnsub = this.afAuth.auth.onAuthStateChanged((user) => {
          if (user) {
            return this.addNewUserInfoToDB(user.uid, email, username);
          } else {
            console.error('Coulnt create...');
            throw new Error('Could not get UID to fully register new user');
          }
        });
      })
      .finally(() => {
        authStateUnsub();
      });
  }

  public loginUser(email: string, password: string): Promise < firebase.auth.UserCredential > {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public logoutUser(): void {
    this.afAuth.auth.signOut()
      .then(() => {
        console.log('Succesfully logged out.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Could not log out', error);
      });
  }


  public isAuthenticated(): boolean {
    if (environment.needsAuthentication) {
      return this.authenticated;
    } else {
      return true;
    }
  }




  // -------------------------
  // Private methods
  // -------------------------

  private addNewUserInfoToDB(uid: string, userEmail: string, username: string): Promise < void > {
    const newUser = new User(
      userEmail,
      username,
      uid,
      undefined,
      undefined,
      [],
      []
    );
    return this.db.create$<User>('users/' + uid, newUser, User.toFirestore);
  }

}
