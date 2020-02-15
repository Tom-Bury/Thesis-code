export class ForumComment {

  constructor(
    public user: string,
    public content: string,
    public date: string,
    public nbLikes: number,
    public thread: ForumComment[],
    public id: string
  ) {}

}
