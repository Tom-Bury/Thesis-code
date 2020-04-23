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

  private allowTips = true;

  private tips = [
    new ChecklistItem('Came by bike', 50, true, 'bicycle', 'Did you come by bike today?', [['06:00', '09:00'], ['17:00', '20:00']]),
    new ChecklistItem('Took stairs instead of elevator', 20, false, 'sort-alpha-up', 'Did you take the stairs instead of the elevator?',  [['06:00', '09:00'], ['17:00', '20:00']]),
    new ChecklistItem('Turned off monitor during breaks', 15, false, 'desktop', 'Did you remember to turn off your devices during breaks?', [['11:00', '15:00']]),
    new ChecklistItem('Turned off all my devices when going home', 20, false, 'desktop', 'Did you remember to turn off all your devices when leaving work?', [['17:00', '20:00']]),
    new ChecklistItem('Put on a sweater for the cold', 10, true, 'temperature-low', 'Did you bring something warm for the cold?', [['06:00', '09:00']]),
    new ChecklistItem('Unplugged unused phone charger', 10, false, 'mobile-alt', 'Unplug any unused charges.', [['9:00', '17:00']]),
    new ChecklistItem('Only cooked the amount of water I needed', 10, true, 'tint', 'Only boil the amount of water you\'re going to use.', [['11:00', '15:00']]),
    new ChecklistItem('Carpooled', 20, false, 'car', 'Did you carpool here today?', [['06:00', '09:00'], ['17:00', '20:00']]),
    new ChecklistItem('Turned off unnecessary lights', 15, false, 'lightbulb', 'Turn off any unnecessary lights.', [['06:00', '08:30'], ['16:30', '23:00']])
  ];


  constructor() {}

  getRandomTip(): ChecklistItem {
    const availableTips = this.tips.filter(t => t.canBeActivated());
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

  getChecklistItems(): ChecklistItem[] {
    return this.tips;
  }
}
