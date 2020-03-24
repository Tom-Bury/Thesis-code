import { DBEntry } from '../db-entry.model';

export interface CommentReference {
  commentID: string;
  threadRefs: string[];
}


export class ForumPost extends DBEntry {

  constructor(
    public title: string,
    public content: string,
    public uid: string,
    public imgUrl: string = '',
    public comments: CommentReference[] = []
  ) {
    super();
  }


  public static toFirestore = (post: ForumPost): any => {
    return {
      title: post.title,
      content: post.content,
      uid: post.uid,
      imgUrl: post.imgUrl,
      comments: post.comments
    };
  }

  public static fromFirestore = (data: any): ForumPost => {
    const post = new ForumPost(data.title, data.content, data.uid, data.imgUrl, data.comments);
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
