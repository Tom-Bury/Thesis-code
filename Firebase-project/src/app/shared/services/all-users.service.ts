import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { UserPublic } from '../interfaces/user/user-public.model';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {

  private allUsers = {};

  constructor(
    private db: FirestoreService
  ) {
    db.getCollObs<UserPublic>(db.getUsersPublicCol(), UserPublic.fromFirestore)
      .subscribe(
        userData => {
          userData.forEach(d => {
            this.allUsers[d.uid] = d;
          });
        }
      );
  }

  public getNameOfUser(uid: string): string {
    const user: UserPublic = this.allUsers[uid];
    return user ? user.name : 'no-user-with-uid-' + uid;
  }


}
