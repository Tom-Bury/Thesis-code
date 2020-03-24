import { DBEntry } from '../db-entry.model';

export class CommentLike extends DBEntry {

  constructor(
    public uid: string,
    public commentID: string
  ) {
    super();
  }


  public static toFirestore = (like: CommentLike): any => {
    return {
      uid: like.uid,
      commentID: like.commentID
    };
  }

  public static fromFirestore = (data: any): CommentLike => {
    const like = new CommentLike(data.uid, data.commentID);
    like.setCreatedAt(data.createdAt);
    like.setUpdatedAt(data.updatedAt);
    return like;
  }


}
