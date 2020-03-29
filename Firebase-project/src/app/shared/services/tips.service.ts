import { Injectable } from '@angular/core';
import { Tip } from '../interfaces/tip.model';

@Injectable({
  providedIn: 'root'
})
export class TipsService {

  private dummyTips: Tip[] = [
    new Tip('sort-alpha-up', 'Taking the elevator takes ... kWh per floor. Why not take the stairs instead?', 250),
    new Tip('temperature-high', 'Put on a sweater when you\'re cold to save energy.', 50),
    new Tip('desktop', 'Don\'t forget to turn off all your devices when going home!', 100),
    new Tip('bicycle', 'Consider going to work by bike if you live close by.', 250),
    new Tip('car', 'If you live close to a colleague and both come by car, why not carpool tomorrow?', 100)
  ];

  constructor() { }

  getRandomTip(): Tip {
    return this.dummyTips[Math.floor(Math.random() * this.dummyTips.length)];
  }
}
