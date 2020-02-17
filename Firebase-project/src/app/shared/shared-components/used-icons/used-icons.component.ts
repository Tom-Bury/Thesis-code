import {
  Component,
  OnInit,
  Injector,
  AfterViewInit
} from '@angular/core';

declare var $:any;


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
    injector.get('allIcons').forEach(i => {
      this.allIconNames.push(i.iconName);
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }


}
