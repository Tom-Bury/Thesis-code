import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  submitNewPost(): void {
    if (this.newPostForm.valid) {
      console.log(this.newPostForm.value);
    }
  }
}
