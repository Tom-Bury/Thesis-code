import { firestore } from 'firebase';

type Timestamp = firestore.Timestamp;

export class CommentLike {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public uid: string,
    public commentID: string
  ) {}


  public static toFirestore = (like: CommentLike): any => {
    return {
      uid: like.uid,
      commentID: like.commentID
    };
  }

  public static fromFirestore = (data: any): CommentLike => {
    const post = new CommentLike(data.uid, data.commentID);
    post.setCreatedAt(data.createdAt);
    post.setUpdatedAt(data.updatedAt);
    return post;
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
