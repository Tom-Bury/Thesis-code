import { Score } from './score.model';
import * as moment from 'moment';

export class UserPublic {

  constructor(
    public name: string = 'test username',
    public uid: string = 'uid',
    public score: Score = null,
    public previousScores: Score[] = [],
    public posts: string[] = [],
    public postLikes: {likeID: string, postID: string}[] = [],
  ) {
    if (this.score === null) {
      this.score =  new Score(Score.fromMomentToFirebase(moment()), 0);
    }
  }

  public static compareUsersByScore(a: UserPublic, b: UserPublic) {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    return 0;
  }

  public static toFirestore = (user: UserPublic): any => {
    return {
      name: user.name,
      uid: user.uid,
      score: Score.scoreToObject(user.score),
      previousScores: user.previousScores.map(Score.scoreToObject),
      posts: user.posts,
      postLikes: user.postLikes
    };
  }

  public static fromFirestore = (data: any): UserPublic => {
    return new UserPublic(data.name, data.uid, Score.ObjectToScore(data.score),
    data.previousScores.map(Score.ObjectToScore), data.posts, data.postLikes);
  }
}
