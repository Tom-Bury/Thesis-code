import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartToImageService } from 'src/app/shared/services/chart-to-image.service';
import { FirebaseStorageService } from 'src/app/shared/services/firebase-storage.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TipsService } from 'src/app/shared/services/tips.service';

@Component({
  selector: 'app-create-post-dummy',
  templateUrl: './create-post-dummy.component.html',
  styleUrls: ['./create-post-dummy.component.scss']
})
export class CreatePostDummyComponent implements OnInit, AfterViewInit {

  @Output() madeNewPost = new EventEmitter < void > ();

  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  public chosenPictureFileSrc = '';
  private fileInFirebaseStorageUrl = '';


  constructor(
    private fb: FormBuilder,
    private forumSvc: ForumService,
    private chartToImgSvc: ChartToImageService,
    private currUser: UserService,
    private storage: FirebaseStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.getElementById('file-input').onchange = (ev: any) => {
      this.uploadPictureFromFileExplorer(ev.target.files);
    };
  }

  public submitNewPost(): void {
    if (this.newPostForm.valid) {
      const title = this.newPostForm.value.title;
      const content = this.newPostForm.value.content;
      this.forumSvc.createNewPost(title, content, this.fileInFirebaseStorageUrl)
        .then(id => {
          document.getElementById('close-modal-btn').click();
          this.newPostForm.reset();
          this.router.navigate(['post', id], {
            relativeTo: this.activatedRoute
          });
          this.madeNewPost.emit();
        });
    }
  }


  public uploadPictureFromFileExplorer(files: FileList): void {
    if (files.length !== 1) {
      console.error('Could not upload picture: too many files to upload.');
    } else {
      const file = files[0];
      this.setChosenPicture(file);
     }
  }

  private setChosenPicture(file: File): void {
    const fileType = file.type;
    if (!fileType.startsWith('image')) {
      console.error('Could not upload non-image file of type: ' + fileType);
    } else {
      this.chartToImgSvc.fileToSrc(file)
        .then(src => {
          this.chosenPictureFileSrc = src;
          console.log('FILE', this.chosenPictureFileSrc);
          this.storage.uploadForumPicture(file, this.currUser.getUID())
            .then(url => this.fileInFirebaseStorageUrl = url);
        });
    }
  }

  public openFileExplorer(): void {
    document.getElementById('file-input').click();
  }

  public removeImg(): void {
    this.chosenPictureFileSrc = '';
  }

}
