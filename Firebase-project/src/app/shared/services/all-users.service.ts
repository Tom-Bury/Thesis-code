import {
  Injectable
} from '@angular/core';
import {
  FirestoreService
} from './firestore.service';
import {
  UserPublic
} from '../interfaces/user/user-public.model';
import {
  AuthenticationService
} from 'src/app/login/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {

  private uidToName = {};
  private allUsers: UserPublic[] = [];

  constructor(
    private db: FirestoreService,
    private authSvc: AuthenticationService
  ) {
    this.refresh();
  }


  public getNameOfUser(uid: string): string {
    const user: UserPublic = this.uidToName[uid];
    return user ? user.name : 'no-user-with-uid-' + uid;
  }

  public getRanking(): {
    name: string,
    uid: string,
    score: number
  } [] {
    const sortedUsers = this.allUsers.sort(UserPublic.compareUsersByScore);
    return sortedUsers.map(u => {
      return {
        name: u.name,
        uid: u.uid,
        score: u.score.amount
      };
    });
  }

  public getAllUserNames(): string[] {
    const sortedUsers = this.allUsers.sort(UserPublic.compareUsersByScore);
    return sortedUsers.map(u => u.name).sort();
  }

  public refresh(): void {
    if (this.authSvc.isAuthenticated()) {
      this.db.getCollObs < UserPublic > (this.db.getUsersPublicCol(), UserPublic.fromFirestore)
        .subscribe(
          userData => {
            this.allUsers = userData;
            this.uidToName = {};
            userData.forEach(d => {
              if (d) {
                this.uidToName[d.uid] = d;
              }
            });
          }
        );
    }
  }



}
