import {
  Component,
  OnInit,
  Injector,
  AfterViewInit
} from '@angular/core';
import { UserService } from '../../services/user.service';

declare var $: any;


@Component({
  selector: 'app-used-icons',
  templateUrl: './used-icons.component.html',
  styleUrls: ['./used-icons.component.scss']
})
export class UsedIconsComponent implements OnInit, AfterViewInit {

  allIconNames = [];
  f1 = '';
  f2 = '';

  constructor(
    private injector: Injector,
    private userSvc: UserService
  ) {
    injector.get('allIcons').forEach(i => {
      this.allIconNames.push(i.iconName);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }


  fetch1() {
    this.f1 = this.userSvc.getUserName();
  }

  change() {
    this.userSvc.updateUserName('THIS IS NEW');
  }


  // fetch2() {
  //   this.usersDoc.doc('Y4ojKH6lImX5rZJfQyLRi3KdMXf1').valueChanges().subscribe(
  //     (usr) => {
  //       console.log('F2', usr);
  //       this.f2 = JSON.stringify(usr);
  //     },
  //     (err) => {
  //       console.error('F1', err);
  //     }
  //   );
  // }

}
