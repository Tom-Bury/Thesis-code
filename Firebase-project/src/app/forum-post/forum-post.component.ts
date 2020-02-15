import { Component, OnInit } from '@angular/core';
import { ForumComment } from '../shared/interfaces/forum-comment.model';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.scss']
})
export class ForumPostComponent implements OnInit {

  dummyThread = [
      new ForumComment('User 1', 'This is my comment!', 'some date', 2, [], '1'),
      new ForumComment('User 2', 'This is another comment, with subcomments!', 'other date', 10, [
        new ForumComment('User 1', 'Cool!', 'some date', 0, [], '3'),
        new ForumComment('User 3', 'Yeah!', 'date', 3, [
          new ForumComment('User 2', 'Indeed :)', 'now', 0, [], '6')
        ], '2')
      ], '4'),
      new ForumComment('user 3', 'Wow...', 'date', 3, [], '5')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
