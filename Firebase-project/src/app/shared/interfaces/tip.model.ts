import { DatetimeRange } from './datetime-range.model';
import * as moment from 'moment';
import { ngbDateTimeToApiString } from '../global-functions';

export class Tip {

  constructor(
    public icon: string,
    public text: string,
    public points: number,
    public from: string,
    public to: string
  ) {}

  public canBeActivated(): boolean {
    const from = moment(this.from, 'HH:mm');
    const to = moment(this.to, 'HH:mm');
    const now = moment();

    return now.isAfter(from) && now.isBefore(to);
  }

}
