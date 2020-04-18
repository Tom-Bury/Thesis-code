import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-post-dummy',
  templateUrl: './create-post-dummy.component.html',
  styleUrls: ['./create-post-dummy.component.scss']
})
export class CreatePostDummyComponent implements OnInit {

  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  public submitNewPost(): void {

  }

}
