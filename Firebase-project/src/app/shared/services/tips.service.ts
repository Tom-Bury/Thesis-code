import { Injectable } from '@angular/core';
import { Tip } from '../interfaces/tip.model';

@Injectable({
  providedIn: 'root'
})
export class TipsService {

  private allowTips = true;

  private dummyTips: Tip[] = [
    new Tip('sort-alpha-up', 'Taking the elevator takes ... kWh per floor. Why not take the stairs instead?', 250, '06:00', '09:00'),
    new Tip('temperature-high', 'Put on a sweater when you\'re cold to save energy.', 50, '07:00', '19:00'),
    new Tip('desktop', 'Don\'t forget to turn off all your devices when going home!', 100, '17:00', '19:00'),
    new Tip('bicycle', 'Consider going to work by bike if you live close by.', 250, '07:00', '09:00'),
    new Tip('car', 'If you live close to a colleague and both come by car, why not carpool tomorrow?', 100, '07:00', '09:00')
  ];

  constructor() { }

  getRandomTip(): Tip {
    const availableTips = this.dummyTips.filter(t => t.canBeActivated());
    if (availableTips.length > 0 && this.allowTips) {
      return availableTips[Math.floor(Math.random() * availableTips.length)];
    } else {
      return null;
    }
  }

  disableTips(): void {
    this.allowTips = false;
  }

  enableTips(): void {
    this.allowTips = true;
  }
}
