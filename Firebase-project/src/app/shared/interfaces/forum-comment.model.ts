import { Like } from './like.model';

export class ForumComment {

  constructor(
    public user: string,
    public content: string,
    public date: string,
    public likes: Like[],
    public thread: ForumComment[],
    public id: string
  ) {}

  public getNbComments(): number {
    const nbCommentsOfComments = this.thread.map(cmt => cmt.getNbComments()).reduce((a, b) => a + b, 0);
    return this.thread.length + nbCommentsOfComments;
  }

  public getNbLikes(): number {
    return this.likes.length;
  }
}
