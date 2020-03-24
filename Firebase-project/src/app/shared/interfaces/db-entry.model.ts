import { firestore } from 'firebase';
import * as moment from 'moment';

type Timestamp = firestore.Timestamp;

export abstract class DBEntry {
  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  public getCreatedAt(): Timestamp {
    return this.createdAt;
  }

  public getCreatedAtFormatted(format: string): string {
    const momentCreatedAt = moment(this.createdAt.toMillis());
    return momentCreatedAt.format(format);
  }

  public getUpdatedAt(): Timestamp {
    return this.updatedAt;
  }

  protected setCreatedAt(ts: Timestamp): void {
    this.createdAt = ts;
  }

  protected setUpdatedAt(ts: Timestamp): void {
    this.updatedAt = ts;
  }

}
