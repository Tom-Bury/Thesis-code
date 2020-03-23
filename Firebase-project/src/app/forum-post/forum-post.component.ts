import {
  Component,
  OnInit
} from '@angular/core';
import {
  ForumComment
} from '../shared/interfaces/forum-comment.model';
import {
  Location
} from '@angular/common';
import {
  Like
} from '../shared/interfaces/like.model';
import {
  ForumPost
} from '../shared/interfaces/forum-post.model';
import {
  User
} from '../shared/interfaces/user/user.model';
import {
  animateCSS
} from '../shared/global-functions';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  liked = false;

  dummyThread = [
    new ForumComment('User 1', 'This is my comment!', 'some date', [new Like(null, null), new Like(null, null)], [], '1'),
    new ForumComment('User 2', 'This is another comment, with subcomments!', 'other date', [new Like(null, null), new Like(null, null), new Like(null, null), new Like(null, null)], [
      new ForumComment('User 1', 'Cool!', 'some date', [new Like(null, null), new Like(null, null), new Like(null, null), new Like(null, null), new Like(null, null), new Like(null, null)], [], '3'),
      new ForumComment('User 3', 'Yeah!', 'date', [], [
        new ForumComment('User 2', 'Indeed :)', 'now', [new Like(null, null), new Like(null, null)], [], '6')
      ], '2')
    ], '4'),
    new ForumComment('user 3', 'Wow...', 'date', [new Like(null, null)], [], '5')
  ];

  post: ForumPost = new ForumPost(
    'This is the title of the post',
    'Quisque in fermentum nulla. Cras ut dapibus libero, nec accumsan purus. Praesent tincidunt tellus id mi porta, quis euismod dui mattis.Etiam scelerisque vestibulum rhoncus.Donec commodo dapibus risus non viverra.Nulla facilisi.Nullam eu lobortis velit.Curabitur nec tortor interdum, imperdiet odio non, consectetur urna.Aliquam finibus leo placerat, dignissim tellus ac, bibendum mi.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean semper pellentesque tincidunt.',
    new User('Username'),
    [new Like(null, null), new Like(null, null), new Like(null, null), new Like(null, null)],
    this.dummyThread
  )



  constructor(
    private location: Location
  ) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  likePost(): void {
    if (!this.liked) {
      animateCSS('#like-icon', 'bounceIn', null);
    }
    this.liked = !this.liked;
  }

}
