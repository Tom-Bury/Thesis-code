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
import { AllUsersService } from '../shared/services/all-users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('checklist') checklist: SidebarComponent;

  public userName = '';
  public randomTip: ChecklistItem;

  constructor(
    private currUser: UserService,
    private tips: TipsService,
    private allUsersSvc: AllUsersService
  ) {}

  ngOnInit() {
    this.userName = this.currUser.getUserName();
    this.allUsersSvc.refresh();

    if (this.tips.startTips()) {
      setTimeout(() => {
        this.randomTip = this.tips.getRandomTip();
        this.displayTipOrNot();
      }, 120000);
    }
  }

  openChecklistOnCurrentTip(): void {
    this.checklist.openChecklistModal();
  }

  displayTipOrNot(): void {
    setTimeout(() => {
      if (this.tips.shouldDisplayByChance()) {
        this.randomTip = this.tips.getRandomTip();
      }
      this.displayTipOrNot();
    }, 60000);
  }

}
