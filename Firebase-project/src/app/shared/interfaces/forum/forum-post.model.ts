
import { firestore } from 'firebase';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../user/user.model';

type Timestamp = firestore.Timestamp;

export class ForumPost {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public title: string,
    public content: string,
    public user: AngularFirestoreDocument<User>,
  ) {}


  public static toFirestore = (post: ForumPost): any => {
    return {
      title: post.title,
      content: post.content,
      userRef: post.user,
    };
  }

  public static fromFirestore = (snapshot: any, options: any): ForumPost => {
    const data = snapshot.data(options);
    const post = new ForumPost(data.title, data.content, data.userRef);
    post.setCreatedAt(data.createdAt);
    post.setUpdatedAt(data.updatedAt);
    return post;
  }


  public getNbLikes(): number {
    return 0;
  }

  public getNbComments(): number {
    return 0;
  }

  public getCreatedAt(): Timestamp {
    return this.createdAt;
  }

  public getUpdatedAt(): Timestamp {
    return this.updatedAt;
  }

  private setCreatedAt(ts: Timestamp): void {
    this.createdAt = ts;
  }

  private setUpdatedAt(ts: Timestamp): void {
    this.updatedAt = ts;
  }


}
