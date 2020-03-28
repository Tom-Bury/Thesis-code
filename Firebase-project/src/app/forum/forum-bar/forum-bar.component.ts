import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';
import { PreviousLoadedPostsService } from '../previous-loaded-posts.service';
import { SortOption } from '../sort-option.enum';

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit {

  @Output() sortBySelected = new EventEmitter<SortOption>();

  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });


  public sortByValues = Object.values(SortOption);
  public sortByForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private forumSvc: ForumService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService
  ) {
  }

  ngOnInit(): void {
    this.sortByForm = this.fb.group({
      sortBy: [this.previousLoadedPostsSvc.getPreviousSortOption(), Validators.required]
    });
  }

  public submitNewPost(): void {
    if (this.newPostForm.valid) {
      const title = this.newPostForm.value.title;
      const content = this.newPostForm.value.content;
      this.forumSvc.createNewPost(title, content);
      document.getElementById('close-modal-btn').click();
      this.newPostForm.reset();
    }
  }

  public sendSortBy(): void {
    this.sortBySelected.emit(this.sortByForm.value.sortBy);
  }
}
