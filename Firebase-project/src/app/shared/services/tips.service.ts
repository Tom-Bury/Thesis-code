import {
  Injectable
} from '@angular/core';
import {
  ChecklistItem
} from '../interfaces/checklist-item.model';

@Injectable({
  providedIn: 'root'
})
export class TipsService {

  private DISPLAY_CHANCE = 0.333;
  private currentTip: ChecklistItem = null;
  private currHighlightedTip: ChecklistItem = null;
  private allowTips = true;

  private tips = [
    new ChecklistItem('Came by bike', 50, false, 'bicycle', 'Did you come by bike today?', [
      ['06:00', '10:00'],
      ['17:00', '20:00']
    ]),
    new ChecklistItem('Took stairs instead of elevator', 20, false, 'sort-alpha-up', 'Did you take the stairs instead of the elevator?', [
      ['06:00', '10:00'],
      ['17:00', '20:00']
    ]),
    new ChecklistItem('Turned off monitor during breaks', 15, false, 'desktop', 'Did you remember to turn off your devices during breaks?', [
      ['10:00', '17:00']
    ]),
    new ChecklistItem('Turned off all my devices when going home', 20, false, 'desktop', 'Did you remember to turn off all your devices when leaving work?', [
      ['17:00', '20:00']
    ]),
    new ChecklistItem('Put on a sweater for the cold', 10, false, 'temperature-low', 'Did you bring something warm for the cold?', [
      ['06:00', '10:00']
    ]),
    new ChecklistItem('Unplugged unused phone charger', 10, false, 'mobile-alt', 'Unplug any unused charges.', [
      ['9:00', '17:00']
    ]),
    new ChecklistItem('Only cooked the amount of water I needed', 10, false, 'tint', 'Only boil the amount of water you\'re going to use.', [
      ['10:00', '17:00']
    ]),
    new ChecklistItem('Carpooled', 20, false, 'car', 'Did you carpool here today?', [
      ['06:00', '10:00'],
      ['17:00', '20:00']
    ]),
    new ChecklistItem('Turned off unnecessary lights', 15, false, 'lightbulb', 'Turn off any unnecessary lights.', [
      ['06:00', '09:00'],
      ['16:30', '23:00']
    ])
  ];


  constructor() {}

  startTips(delayMillis: number): void {
    setTimeout(() => {
      this.nextRandomTip();
      this.tipsLoop(delayMillis);
    }, delayMillis);
  }

  private tipsLoop(delayMillis: number): void {
    setTimeout(() => {

      console.log('considering')
      if (this.shouldDisplayByChance()) {
        this.nextRandomTip();
      }
      this.tipsLoop(delayMillis);
    }, delayMillis);
  }


  private nextRandomTip() {
    console.log('nextrandom, curr', this.currentTip)
    if (this.currentTip === null && this.allowTips) {
      let tip = null;
      const availableTips = this.tips.filter(t => t.canBeActivated());
      console.log('available', availableTips.map(t => t.name))
      if (availableTips.length > 0) {
        tip = availableTips[Math.floor(Math.random() * availableTips.length)];
      }
      console.log('TIP', tip);
      this.currentTip = tip;
      this.currHighlightedTip = tip;
    }
  }

  disableTips(): void {
    this.allowTips = false;
  }

  enableTips(): void {
    this.allowTips = true;
  }

  getChecklistItems(): ChecklistItem[] {
    return this.tips;
  }

  // setCurrentTip(tip: ChecklistItem): void {
  //   this.currentTip = tip;
  // }

  consumeCurrentTip(): void {
    this.currentTip = null;
  }

  getCurrentTip(): ChecklistItem {
    return this.currentTip;
  }

  getCurrentHighlightedTip(): ChecklistItem {
    return this.currHighlightedTip;
  }

  resetHighlight(): void {
    this.currHighlightedTip = null;
  }

  hasCurrentTip(): boolean {
    return this.currentTip !== null;
  }




  shouldDisplayByChance(): boolean {
    return Math.random() <= this.DISPLAY_CHANCE;
  }

  getExtraWhs(): number {
    const whs = this.tips
      .filter(t => t.isChecked)
      .map(t => (t.points / 2) - ((t.points / 2) % 5));

    const result = whs.length > 0 ? whs.reduce((a, b) => a + b) : 0;
    return result;
  }
}
