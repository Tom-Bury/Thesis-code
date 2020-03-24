import {
  Component,
  OnInit,
  Injector,
  AfterViewInit
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { ForumService } from '../../services/forum.service';
import { ForumPost } from '../../interfaces/forum/forum-post.model';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserPublic } from '../../interfaces/user/user-public.model';

declare var $: any;

interface PublicUserData {
    name: string;
}

interface PrivateUserData {
  email: string;
}

@Component({
  selector: 'app-used-icons',
  templateUrl: './used-icons.component.html',
  styleUrls: ['./used-icons.component.scss']
})
export class UsedIconsComponent implements OnInit, AfterViewInit {

  allIconNames = [];
  private publicUsersColl: AngularFirestoreCollection<PublicUserData>;
  private allUsers: Observable<PublicUserData[]>;

  constructor(
    private injector: Injector,
    private db: FirestoreService,
  ) {
    injector.get('allIcons').forEach(i => {
      this.allIconNames.push(i.iconName);
    });

    this.publicUsersColl = this.db.getUsersPublicCol(ref => ref.orderBy('createdAt', 'desc'));
  }

  ngOnInit(): void {
    this.allUsers = this.db.getCollObs(this.publicUsersColl, UserPublic.fromFirestore);
  }


  test() {

  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }




}
