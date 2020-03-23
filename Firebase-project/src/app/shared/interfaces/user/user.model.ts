import {
  Score
} from './score.model';
import * as moment from 'moment';

export class User {

  constructor(
    public email: string = 'test@mail.com',
    public name: string = 'test username',
    public uid: string = 'uid',
    public score: Score = new Score(Score.fromMomentToFirebase(moment()), 0),
    public previousScores: Score[] = [],
    public posts: string[] = ['testPost1', 'testPost2'],
    public likes: string[] = ['testLike1', 'testLike2'],
  ) {
  }

  public static compareUsersByScore(a: User, b: User) {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    return 0;
  }

  public static toFirestore = (user: User): any => {
    return {
      name: user.name,
      email: user.email,
      uid: user.uid,
      score: Score.scoreToObject(user.score),
      previousScores: user.previousScores.map(Score.scoreToObject),
      posts: user.posts,
      likes: user.likes
    };
  }

  public static fromFirestore = (snapshot: any, options: any): any => {
    const data = snapshot.data(options);
    return new User(data.email, data.name, data.uid, Score.ObjectToScore(data.score),
    data.previousScores.map(Score.ObjectToScore), data.posts, data.likes);
  }








}
