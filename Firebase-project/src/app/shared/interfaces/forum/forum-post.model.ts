import { PostLike } from './post-like.model';
import { ForumComment } from './forum-comment.model';
import { DBEntry } from '../db-entry.model';


export class ForumPost extends DBEntry {

  constructor(
    public title: string,
    public content: string,
    public uid: string,
    public imgUrl: string = '',
    public likes: PostLike[] = [],
    public comments: ForumComment[] = []
  ) {
    super();
  }


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
    post.setID(data.ID);
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

}
