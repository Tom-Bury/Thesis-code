import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { TipsService } from '../shared/services/tips.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChecklistItem } from '../shared/interfaces/checklist-item.model';

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
    private tips: TipsService
  ) {}

  ngOnInit() {
    this.userName = this.currUser.getUserName();

    setTimeout(() => {
      this.randomTip = this.tips.getRandomTip();
    }, 5000);
  }

  openChecklistOnCurrentTip(): void {
    this.checklist.openChecklistModal();
  }

}
