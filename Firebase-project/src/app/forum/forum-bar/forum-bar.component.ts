import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit {

  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private forumSvc: ForumService
  ) { }

  ngOnInit(): void {
  }

  submitNewPost(): void {
    if (this.newPostForm.valid) {
      const title = this.newPostForm.value.title;
      const content = this.newPostForm.value.content;
      this.forumSvc.createNewPost(title, content);
      document.getElementById('close-modal-btn').click();
      this.newPostForm.reset();
    }
  }
}
