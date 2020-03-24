import { Component, OnInit, HostListener } from '@angular/core';
import { ForumPost } from 'src/app/shared/interfaces/forum/forum-post.model';

@Component({
  selector: 'app-your-posts-card',
  templateUrl: './your-posts-card.component.html',
  styleUrls: ['./your-posts-card.component.scss']
})
export class YourPostsCardComponent implements OnInit {

  yourPosts: ForumPost[] = [];

  public isXLScreen = true;
  public isToggledOpen = false;

  constructor() {}

  ngOnInit(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isXLScreen = window.innerWidth >= 1200;
  }


}
