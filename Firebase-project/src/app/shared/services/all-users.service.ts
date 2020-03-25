import {
  Injectable
} from '@angular/core';
import {
  FirestoreService
} from './firestore.service';
import {
  UserPublic
} from '../interfaces/user/user-public.model';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {

  private allUsers = {};

  constructor(
    private db: FirestoreService
  ) {
   this.refresh();
  }


  public getNameOfUser(uid: string): string {
    const user: UserPublic = this.allUsers[uid];
    return user ? user.name : 'no-user-with-uid-' + uid;
  }

  public refresh(): void {
    this.db.getCollObs < UserPublic > (this.db.getUsersPublicCol(), UserPublic.fromFirestore)
    .subscribe(
      userData => {
        this.allUsers = {};
        userData.forEach(d => {
          if (d) {
            this.allUsers[d.uid] = d;
          }
        });
      }
    );
  }


}
