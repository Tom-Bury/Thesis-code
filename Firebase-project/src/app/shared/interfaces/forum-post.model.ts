import { User } from './user.model';
import { Like } from './like.model';
import { ForumComment } from './forum-comment.model';

export class ForumPost {

  constructor(
    public title: string,
    public content: string,
    public user: User,
    public likes: Like[],
    public commentThread: ForumComment[],
    // Time?
  ) {}


  public nbLikes = this.likes.length;

}
