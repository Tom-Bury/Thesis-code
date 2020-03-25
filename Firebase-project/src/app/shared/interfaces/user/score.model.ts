import { firestore } from 'firebase';

type Timestamp = firestore.Timestamp;

export class Score {

  constructor(
    public date: Timestamp,
    public amount: number
  ) {}

  public static fromMomentToFirebase(momentTimeStamp): Timestamp {
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

}
