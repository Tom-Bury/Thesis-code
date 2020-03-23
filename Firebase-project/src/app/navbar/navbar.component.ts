import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public userName = '';

  constructor(
    private currUser: UserService
  ) {}

  ngOnInit() {
    this.userName = this.currUser.getUserName();
  }

}
