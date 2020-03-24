import * as moment from 'moment';
import { firestore } from 'firebase';
import { PostLike } from './post-like.model';
import { ForumComment } from './forum-comment.model';

type Timestamp = firestore.Timestamp;

export class ForumPost {

  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  constructor(
    public title: string,
    public content: string,
    public uid: string,
    public imgUrl: string = '',
    public likes: PostLike[] = [],
    public comments: ForumComment[] = []
  ) {}


  public static toFirestore = (post: ForumPost): any => {
    return {
      title: post.title,
      content: post.content,
      uid: post.uid,
      imgUrl: post.imgUrl,
      likes: post.likes.map(PostLike.toFirestore),
      comments: post.comments.map(ForumComment.toFirestore)
    };
  }

  public static fromFirestore = (data: any): ForumPost => {
    const post = new ForumPost(data.title, data.content, data.uid, data.imgUrl, data.likes.map(PostLike.fromFirestore), data.comments.map(ForumComment.fromFirestore));
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
