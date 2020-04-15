import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  ForumService
} from 'src/app/shared/services/forum.service';
import {
  PreviousLoadedPostsService
} from '../previous-loaded-posts.service';
import {
  SortOption
} from '../sort-option.enum';
import {
  FirebaseStorageService
} from 'src/app/shared/services/firebase-storage.service';
import {
  UserService
} from 'src/app/shared/services/user.service';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  ChartToImageService
} from 'src/app/shared/services/chart-to-image.service';

declare let $: any;

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit, AfterViewInit {

  @Input() openModal = false;

  @Output() sortBySelected = new EventEmitter < SortOption > ();
  @Output() madeNewPost = new EventEmitter < void > ();

  @ViewChild('createPostModal') createPostModal: ElementRef;

  public chosenPictureFileSrc = '';

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
    private currUser: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chartToImgSvc: ChartToImageService
  ) {}

  ngOnInit(): void {
    this.sortByForm = this.fb.group({
      sortBy: [this.previousLoadedPostsSvc.getPreviousSortOption(), Validators.required]
    });

    if (this.openModal) {
      const file = this.previousLoadedPostsSvc.getCreatePostPictureFile();
      if (file !== null) {
        this.setChosenPicture(file);
        const chartName = this.previousLoadedPostsSvc.getCreatePostChartName();
        const date = this.previousLoadedPostsSvc.getCreatePostDatetimeString();
        this.newPostForm.patchValue({
          title: chartName,
          content: 'Selected timeframe was from ' + date + '.'
        })
        this.previousLoadedPostsSvc.setOpenCreatePostFile(null);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.openModal) {
      $(this.createPostModal.nativeElement).modal('show');
    }
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

  public sendSortBy(): void {
    this.sortBySelected.emit(this.sortByForm.value.sortBy);
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
