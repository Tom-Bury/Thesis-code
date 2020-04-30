import { Component, OnInit, Input } from '@angular/core';
import { PostCategory } from '../../interfaces/forum/post-category.model';
import { COLORS } from '../../global-functions';

@Component({
  selector: 'app-post-category-badge',
  templateUrl: './post-category-badge.component.html',
  styleUrls: ['./post-category-badge.component.scss']
})
export class PostCategoryBadgeComponent implements OnInit {

  @Input() category: PostCategory;
  @Input() removeable = false;

  constructor() { }

  ngOnInit(): void {
  }

  getIconColor(): string {
    if (this.category.getColor() === 'warning' || this.category.getColor() === 'light' || this.category.getColor() === 'primary' || this.category.getColor() === 'info' || this.category.getColor() === 'success') {
      return '#212529';
    } else {
      return '#fff';
    }
  }

}
