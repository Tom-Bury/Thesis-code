import { Component, OnInit, Input } from '@angular/core';
import { PostCategory } from '../../interfaces/forum/post-category.model';

@Component({
  selector: 'app-post-category-badge',
  templateUrl: './post-category-badge.component.html',
  styleUrls: ['./post-category-badge.component.scss']
})
export class PostCategoryBadgeComponent implements OnInit {

  @Input() category: PostCategory;

  constructor() { }

  ngOnInit(): void {
  }

}
