import { DBEntry } from '../db-entry.model';


export class PostLike extends DBEntry {

  constructor(
    public uid: string,
    public postID: string
  ) {
    super();
  }

  public static toFirestore = (like: PostLike): any => {
    return {
      uid: like.uid,
      postID: like.postID
    };
  }

  public static fromFirestore = (data: any): PostLike => {
    const like = new PostLike(data.uid, data.postID);
    like.setCreatedAt(data.createdAt);
    like.setUpdatedAt(data.updatedAt);
    return like;
  }

}
