import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  public sidebarOpened = true;

  constructor(
    private router: Router,
  ) {}

  ngOnInit() { }


  getCurrentTabName(): string {
    let name;

    switch (this.router.url) {
      case '/compare/verbruiksverloop':
        name = 'Usage in time';
        break;
      case '/compare/vergelijk-split':
        name = 'Compare usage in time';
        break;
      case '/compare/statistics':
        name = 'Summary';
        break;
      case '/compare/daily-totals':
        name = 'Daily total used energy';
        break;
      default:
        name = this.router.url;
        break;
    }

    return name;
  }

  toggleMenu() {
    this.sidebarOpened = !this.sidebarOpened;
  }
}
