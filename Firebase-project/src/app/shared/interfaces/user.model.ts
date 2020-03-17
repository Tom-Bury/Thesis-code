export class User {

  constructor(
    public name,
    public score
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
