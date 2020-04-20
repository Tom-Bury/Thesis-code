import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartToImageService } from 'src/app/shared/services/chart-to-image.service';
import { FirebaseStorageService } from 'src/app/shared/services/firebase-storage.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TipsService } from 'src/app/shared/services/tips.service';
import { PreviousLoadedPostsService } from '../previous-loaded-posts.service';

@Component({
  selector: 'app-create-post-dummy',
  templateUrl: './create-post-dummy.component.html',
  styleUrls: ['./create-post-dummy.component.scss']
})
export class CreatePostDummyComponent implements OnInit, AfterViewInit {

  @Output() madeNewPost = new EventEmitter < void > ();
  @Input() showWithInitialContents = false;

  public newPostForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  public chosenPictureFileSrc = '';
  private chosenPicture: File = null;


  constructor(
    private fb: FormBuilder,
    private forumSvc: ForumService,
    private chartToImgSvc: ChartToImageService,
    private currUser: UserService,
    private storage: FirebaseStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private initialContentsSvc: PreviousLoadedPostsService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.getElementById('file-input').onchange = (ev: any) => {
      this.setPictureFromFileList(ev.target.files);
    };

    if (this.showWithInitialContents) {
      const pic = this.initialContentsSvc.getCreatePostPictureFile();
      this.setChosenPicture(pic);

      const chartName = this.initialContentsSvc.getCreatePostChartName();
      const date = this.initialContentsSvc.getCreatePostDatetimeString();
      setTimeout(() => {
        this.newPostForm.patchValue({
          title: chartName,
          content: 'Selected timeframe was from ' + date + '.'
        });

      }, 100);
      this.initialContentsSvc.setOpenCreatePostFile(null);
    }
  }

  public submitNewPost(): void {
    if (this.newPostForm.valid) {
      const title = this.newPostForm.value.title;
      const content = this.newPostForm.value.content;

      if (this.chosenPicture !== null) {
        this.storage.uploadForumPicture(this.chosenPicture, this.currUser.getUID())
          .then(url => this.uploadPost(title, content, url));
      } else {
        this.uploadPost(title, content, '');
      }
    }
  }


  private uploadPost(title: string, content: string, imgUrl: string): void {
    this.forumSvc.createNewPost(title, content, imgUrl)
    .then(id => {
      this.router.navigate(['post', id], {
        relativeTo: this.activatedRoute
      });
      this.madeNewPost.emit();
    })
    .finally(() => {
      this.clearPost();
    });
  }

  public setPictureFromFileList(files: FileList): void {
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
          this.chosenPicture = file;
          this.chosenPictureFileSrc = src;
        });
    }
  }

  public openFileExplorer(): void {
    document.getElementById('file-input').click();
  }

  public removeImg(): void {
    this.chosenPictureFileSrc = '';
    this.chosenPicture = null;
  }

  public clearPost(): void {
    this.newPostForm.reset();
    this.removeImg();
  }

}