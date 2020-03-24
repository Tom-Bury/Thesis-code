import { CommentLike } from './comment-like.model';
import { DBEntry } from '../db-entry.model';


export class ForumComment extends DBEntry {

  constructor(
    public uid: string,
    public content: string,
    public postID: string,
    public comments: string[] = [],
  ) {
    super();
  }

  public static toFirestore = (comment: ForumComment): any => {
    return {
      uid: comment.uid,
      content: comment.content,
      postID: comment.postID,
      comments: comment.comments
    };
  }

  public static fromFirestore = (data: any): ForumComment => {
    const comment = new ForumComment(data.uid, data.content, data.postID, data.comments);
    comment.setCreatedAt(data.createdAt);
    comment.setUpdatedAt(data.updatedAt);
    comment.setID(data.ID);

    return comment;
  }




  public getNbComments(): number {
    // const nbCommentsOfComments = this.thread.map(cmt => cmt.getNbComments()).reduce((a, b) => a + b, 0);
    // return this.thread.length + nbCommentsOfComments;
    return 0;
  }

  public getNbLikes(): number {
    // return this.likes.length;
    return 0;
  }

}
