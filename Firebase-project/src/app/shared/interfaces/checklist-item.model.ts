import * as moment from 'moment';

export class ChecklistItem {

  constructor(
    public name: string,
    public points: number,
    public isChecked: boolean,
    public icon: string,
    public tipName: string,
    public times: any[]
  ) {}

  public canBeActivated(): boolean {
    let activatable = false;

    this.times.forEach(timeFrame => {
      if (timeFrame.length === 2) {
        const from = moment(timeFrame[0], 'HH:mm');
        const to = moment(timeFrame[1], 'HH:mm');
        const now = moment();

        if (now.isAfter(from) && now.isBefore(to)) {
          activatable = true;
        }
      }
    });

    return activatable;
  }


}
