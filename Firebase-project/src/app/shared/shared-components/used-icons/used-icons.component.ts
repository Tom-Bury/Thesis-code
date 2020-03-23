import {
  Component,
  OnInit,
  Injector,
  AfterViewInit
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { ForumService } from '../../services/forum.service';
import { ForumPost } from '../../interfaces/forum/forum-post.model';
import { Observable } from 'rxjs';

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
  posts: Observable<ForumPost[]>;

  constructor(
    private injector: Injector,
    private userSvc: UserService,
    private forumSvc: ForumService
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
    this.forumSvc.createNewPost('Post #2', 'Second ever post, nice!');
  }

  change() {
    this.userSvc.updateUserName('THIS IS NEW');
  }


  fetch2() {
    this.posts = this.forumSvc.getAllPosts();
  }

}
