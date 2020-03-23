
import { firestore } from 'firebase';
import { User } from '../user/user.model';
import { DocumentReference } from '@angular/fire/firestore';

type Timestamp = firestore.Timestamp;

export class ForumPost {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public title: string,
    public content: string,
    public userRef: DocumentReference,
  ) {}


  public static toFirestore = (post: ForumPost): any => {
    return {
      title: post.title,
      content: post.content,
      userRef: post.userRef,
    };
  }

  public static fromFirestore = (data: any): ForumPost => {
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
