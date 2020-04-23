import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { TipsService } from '../shared/services/tips.service';
import { Tip } from '../shared/interfaces/tip.model';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('checklist') checklist: SidebarComponent;

  public userName = '';
  public randomTip: Tip;

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
    if (this.randomTip !== null) {
      this.checklist.openChecklistModal();
    }
  }

}
