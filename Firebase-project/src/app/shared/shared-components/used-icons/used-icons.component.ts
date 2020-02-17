import {
  Component,
  OnInit,
  Injector,
  AfterViewInit
} from '@angular/core';
// import 'bootstrap';
// import * as $ from 'jquery';

@Component({
  selector: 'app-used-icons',
  templateUrl: './used-icons.component.html',
  styleUrls: ['./used-icons.component.scss']
})
export class UsedIconsComponent implements OnInit, AfterViewInit {

  allIconNames = [];

  constructor(
    private injector: Injector
  ) {
    // injector.get('allIcons').forEach(i => {
    //   this.allIconNames.push(i.iconName);
    // });
  }

  ngOnInit(): void {
    this.allIconNames.forEach(i => console.log(i));
  }

  ngAfterViewInit(): void {
    // $('[data-toggle="tooltip"]').tooltip();
  }


}
