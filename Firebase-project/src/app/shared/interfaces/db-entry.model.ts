import { firestore } from 'firebase';
import * as moment from 'moment';

type Timestamp = firestore.Timestamp;

export abstract class DBEntry {

  private ID: string;
  private createdAt: Timestamp;
  private updatedAt: Timestamp;

  public getCreatedAt(): Timestamp {
    return this.createdAt;
  }

  public getCreatedAtFormatted(format: string): string {
    if (this.createdAt) {
      const momentCreatedAt = moment(this.createdAt.toMillis());
      return momentCreatedAt.format(format);
    } else {
      return '';
    }
  }

  public getUpdatedAt(): Timestamp {
    return this.updatedAt;
  }

  public getID(): string {
    return this.ID;
  }

  protected setCreatedAt(ts: Timestamp): void {
    this.createdAt = ts;
  }

  protected setUpdatedAt(ts: Timestamp): void {
    this.updatedAt = ts;
  }

  protected setID(id: string): void {
    this.ID = id;
  }



}
