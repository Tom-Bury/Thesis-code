export class User {

  constructor(
    public name: string = 'test username',
    public score: number = 404,
    public email: string = 'test@mail.com',
    public posts: string[] = ['testPost1', 'testPost2'],
    public likes: string[] = ['testLike1', 'testLike2'],
    public uid: string = 'uid'
  ) {}

  public static compareUsersByScore(a: User, b: User) {
    if ( a.score > b.score ) {
      return -1;
    }
    if ( a.score < b.score ) {
      return 1;
    }
    return 0;
  }

}
