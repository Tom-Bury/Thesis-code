import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';
import { PreviousLoadedPostsService } from '../previous-loaded-posts.service';
import { SortOption } from '../sort-option.enum';
import { FirebaseStorageService } from 'src/app/shared/services/firebase-storage.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit {

  @Output() sortBySelected = new EventEmitter<SortOption>();

  public uploadedFileUrl = '';
  private fileInFirebaseStorageUrl = '';


  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });


  public sortByValues = Object.values(SortOption);
  public sortByForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private forumSvc: ForumService,
    private previousLoadedPostsSvc: PreviousLoadedPostsService,
    private storage: FirebaseStorageService,
    private currUser: UserService
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
      this.forumSvc.createNewPost(title, content, this.fileInFirebaseStorageUrl);
      document.getElementById('close-modal-btn').click();
      this.newPostForm.reset();
    }
  }

  public sendSortBy(): void {
    this.sortBySelected.emit(this.sortByForm.value.sortBy);
  }

  public uploadPicture(files: FileList): void {
    if (files.length !== 1) {
      console.error('Could not upload picture: too many files to upload.');
    } else {
      const file = files[0];
      const fileType = file.type;

      if (!fileType.startsWith('image')) {
        console.error('Could not upload non-image file of type: ' + fileType);
      }
      else {
        const reader = new FileReader();
        reader.onload = e => {
          this.uploadedFileUrl = e.target.result as string;
        };
        reader.readAsDataURL(file); // convert to base64 string
        this.storage.uploadForumPicture(file, this.currUser.getUID()).then(url => this.fileInFirebaseStorageUrl = url);
      }
    }
  }

  public openFileExplorer(): void {
    document.getElementById('file-input').click();
  }

  public removeImg(): void {
    this.uploadedFileUrl = '';
  }
}
