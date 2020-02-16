import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-avatar-component',
  templateUrl: './avatar-component.component.html',
  styleUrls: ['./avatar-component.component.scss']
})
export class AvatarComponentComponent implements OnInit {

  @Input() borderActive: false;
  @Input() borderColor: 'pink';
  @Input() size = 1;
  @Input() avatarUrl = 'assets/dummy-pics/avatar.png';

  constructor() {}

  ngOnInit(): void {}

  getClasses(): string[] {
    const classes = [];

    if (this.borderActive) {
      classes.push('border-active');
      classes.push('border-' + this.borderColor);
    }

    classes.push(this.getSizeClass());

    return classes;
  }

  private getSizeClass(): string {
    switch (this.size) {
      case 0:
        return 'size-extra-small';
      case 1:
        return 'size-small';
      case 2:
        return 'size-medium';
      case 3:
        return 'size-large';
      default:
        console.error(this.size + ' is not a valid avatar size. Pick a size between from 1 til 3.');
        return 'size-small';
    }
  }

}
