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
    const post = new PostLike(data.uid, data.postID);
    post.setCreatedAt(data.createdAt);
    post.setUpdatedAt(data.updatedAt);
    return post;
  }

}
