import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  UserService
} from '../shared/services/user.service';
import {
  TipsService
} from '../shared/services/tips.service';
import {
  SidebarComponent
} from './sidebar/sidebar.component';
import {
  ChecklistItem
} from '../shared/interfaces/checklist-item.model';
import {
  AllUsersService
} from '../shared/services/all-users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('checklist') checklist: SidebarComponent;

  public userName = '';
  // public randomTip: ChecklistItem;

  constructor(
    private currUser: UserService,
    public tips: TipsService,
    private allUsersSvc: AllUsersService
  ) {}

  ngOnInit() {
    this.userName = this.currUser.getUserName();
    this.allUsersSvc.refresh();
    this.tips.startTips(120000);
  }

  openChecklistOnCurrentTip(): void {
    this.checklist.openChecklistModal();
  }

  // private displayFirstTip(delayMillis: number): void {
  //   console.log('display first tip try')
  //   setTimeout(() => {
  //     this.tips.getRandomTip();

  //     if (this.randomTip === null) {
  //       console.log('tip was null')
  //       this.displayFirstTip(delayMillis);
  //     } else {
  //       console.log('displayed tip, now random start')
  //       this.displayTipOrNot();
  //     }
  //   }, delayMillis);
  // }


  // private displayTipOrNot(): void {
  //   console.log('random consider')
  //   setTimeout(() => {
  //     if (this.tips.shouldDisplayByChance() && this.tips.getCurrentTip() === null) {
  //       console.log('actual tip')
  //       this.randomTip = this.tips.getRandomTip();
  //     }

  //     if (this.tips.getCurrentTip() === null) {
  //       this.randomTip = null;
  //     }
  //     this.displayTipOrNot();
  //   }, 60000);
  // }

}
