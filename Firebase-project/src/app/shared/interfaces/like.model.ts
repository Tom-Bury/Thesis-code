import { User } from './user.model';
import { ForumPost } from './forum-post.model';

export class Like {

  constructor(
    public user: User,
    public post: ForumPost,
    // Time?
  ) {}

}