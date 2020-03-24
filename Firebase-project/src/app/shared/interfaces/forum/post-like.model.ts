import { firestore } from 'firebase';

type Timestamp = firestore.Timestamp;

export class PostLike {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public uid: string,
    public postID: string
  ) {}

  public static toFirestore = (like: PostLike): any => {
    return {
      uid: like.uid,
      postID: like.postID
    };
  }

  public static fromFirestore = (data: any): PostLike => {
    const post = new PostLike(data.uid, data.postID);
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
