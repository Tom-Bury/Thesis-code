import { firestore } from 'firebase';

export class Score {

  constructor(
    public date: firestore.Timestamp,
    public amount: number
  ) {}

  public static fromMomentToFirebase(momentTimeStamp): firestore.Timestamp {
    return firestore.Timestamp.fromDate(momentTimeStamp.toDate());
  }

  public static scoreToObject(score: Score): any {
    return {
      date: score.date,
      amount: score.amount
    };
  }

  public static ObjectToScore(obj: any): Score {
    return new Score(obj.date, obj.amount);
  }



  public toObject(): any {
    return Score.scoreToObject(this);
  }

}
