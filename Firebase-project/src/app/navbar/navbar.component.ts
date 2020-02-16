import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  // hoverNav(linkName: string): void {
  //   console.log('MOUSE ENTER');

  //   switch (linkName) {
  //     case 'HOME':
  //       // document.getElementById('home-link').classList.remove('nav-link-normal');
  //       document.getElementById('home-icon').classList.remove('nav-link-normal');
  //       // document.getElementById('home-link').classList.add('nav-link-hover');
  //       document.getElementById('home-icon').classList.add('nav-link-hover');
  //       break;
  //     default:
  //       console.error('Not a known nav link in hoverNav(...)');
  //   }
  // }


  // endHover(linkName: string): void {
  //   console.log('MOUSE LEAVE');

  //   switch (linkName) {
  //     case 'HOME':
  //       // document.getElementById('home-link').classList.remove('nav-link-hover');
  //       document.getElementById('home-icon').classList.remove('nav-link-hover');
  //       // document.getElementById('home-link').classList.add('nav-link-normal');
  //       document.getElementById('home-icon').classList.add('nav-link-normal');
  //       break;
  //     default:
  //       console.error('Not a known nav link in hoverNav(...)');
  //   }
  // }

}
