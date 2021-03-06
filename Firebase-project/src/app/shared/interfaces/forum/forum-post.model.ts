import { DBEntry } from '../db-entry.model';
import { PostCategory } from './post-category.model';


export class ForumPost extends DBEntry {

  constructor(
    public title: string,
    public content: string,
    public uid: string,
    public imgUrl: string = '',
    public comments: string[] = [],
    public likes: string[] = [],
    public categories: PostCategory[] = [PostCategory.createPostCategory('others')]
  ) {
    super();
  }


  public static toFirestore = (post: ForumPost): any => {
    return {
      title: post.title,
      content: post.content,
      uid: post.uid,
      imgUrl: post.imgUrl,
      comments: post.comments,
      likes: post.likes,
      categories: post.categories.map(cat => cat.toFirebaseString())
    };
  }

  public static fromFirestore = (data: any): ForumPost => {
    const categories = data.categories ? data.categories.map(c => PostCategory.createPostCategory(c)) : [PostCategory.createPostCategory('others')];
    const post = new ForumPost(data.title, data.content, data.uid, data.imgUrl, data.comments, data.likes, categories);
    post.setID(data.ID);
    post.setCreatedAt(data.createdAt);
    post.setUpdatedAt(data.updatedAt);
    return post;
  }


  public getNbLikes(): number {
    return this.likes.length;
  }

  public getNbComments(): number {
    return this.comments.length;
  }

}
