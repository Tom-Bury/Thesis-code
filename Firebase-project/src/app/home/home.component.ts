import {
  Component,
  OnInit
} from '@angular/core';
import {
  AllUsersService
} from '../shared/services/all-users.service';
// import { ForumService } from '../shared/services/forum.service';
// import { FirestoreService } from '../shared/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private allUsersSvc: AllUsersService,
    // private forumSvc: ForumService,
    // private db: FirestoreService
  ) {}

  ngOnInit() {
    this.allUsersSvc.getNameOfUser(''); // To make sure this service is already available
  }


  // doit(): void {
  //   this.forumSvc.getAllPosts()
  //     .toPromise().then(posts => {
  //       const postIDs = posts.map(p => p.getID());
  //       console.log(postIDs);
  //       const postsColl = this.db.getForumPostsCol();

  //       postIDs.forEach(pID => {
  //         const currPostRef = postsColl.doc(pID);
  //         this.db.updateDocField$(currPostRef, 'categories', [])
  //       })
  //     })
  // }
}
