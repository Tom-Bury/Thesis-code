import { Component, OnInit } from '@angular/core';
import { ForumComment } from '../shared/interfaces/forum-comment.model';
import {Location} from '@angular/common';
import { Like } from '../shared/interfaces/like.model';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

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

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

}
