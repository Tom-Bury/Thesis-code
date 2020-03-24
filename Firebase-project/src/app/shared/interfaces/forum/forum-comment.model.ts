import { firestore } from 'firebase';
import { CommentLike } from './comment-like.model';
import * as moment from 'moment';

type Timestamp = firestore.Timestamp;

export class ForumComment {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public uid: string,
    public content: string,
    public likes: CommentLike[],
    public thread: ForumComment[],
  ) {}

  public static toFirestore = (comment: ForumComment): any => {
    return {
      uid: comment.uid,
      content: comment.content,
      likes: comment.likes.map(CommentLike.toFirestore),
      thread: comment.thread.map(ForumComment.toFirestore)
    };
  }

  public static fromFirestore = (data: any): ForumComment => {
    const post = new ForumComment(data.uid, data.content, data.likes.map(CommentLike.fromFirestore), data.thread.map(ForumComment.fromFirestore));
    post.setCreatedAt(data.createdAt);
    post.setUpdatedAt(data.updatedAt);
    return post;
  }




  public getNbComments(): number {
    const nbCommentsOfComments = this.thread.map(cmt => cmt.getNbComments()).reduce((a, b) => a + b, 0);
    return this.thread.length + nbCommentsOfComments;
  }

  public getNbLikes(): number {
    return this.likes.length;
  }

  public getCreatedAt(): Timestamp {
    return this.createdAt;
  }

  public getCreatedAtFormatted(format: string): string {
    const momentCreatedAt = moment(this.createdAt.toMillis());
    return momentCreatedAt.format(format);
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
