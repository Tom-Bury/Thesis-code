import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ForumService } from 'src/app/shared/services/forum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartToImageService } from 'src/app/shared/services/chart-to-image.service';
import { FirebaseStorageService } from 'src/app/shared/services/firebase-storage.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TipsService } from 'src/app/shared/services/tips.service';
import { PreviousLoadedPostsService } from '../previous-loaded-posts.service';
import { PostCategory } from 'src/app/shared/interfaces/forum/post-category.model';
import { AutomaticPostCreationService } from 'src/app/shared/services/automatic-post-creation.service';

@Component({
  selector: 'app-create-post-dummy',
  templateUrl: './create-post-dummy.component.html',
  styleUrls: ['./create-post-dummy.component.scss']
})
export class CreatePostDummyComponent implements OnInit, AfterViewInit {

  @Input() showWithInitialContents = false;

  public possibleCategories = PostCategory.allCategoryStrings();
  public selectedCategories = [PostCategory.createPostCategory('others')];

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
    private initialContentsSvc: PreviousLoadedPostsService,
    private automaticPostSvc: AutomaticPostCreationService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.getElementById('file-input').onchange = (ev: any) => {
      this.setPictureFromFileList(ev.target.files);
    };

    if (this.showWithInitialContents && this.initialContentsSvc.activeCreatePostOnForumPageInit()) {
      const pic = this.initialContentsSvc.getCreatePostPictureFile();
      this.setChosenPicture(pic);

      const chartName = this.initialContentsSvc.getCreatePostChartName();
      const date = this.initialContentsSvc.getCreatePostDatetimeString();
      setTimeout(() => {
        this.newPostForm.patchValue({
          title: chartName,
          content: 'Selected timeframe was from ' + date + '.'
        });
        this.selectedCategories = [PostCategory.createPostCategory('energy')];
      }, 100);
      this.initialContentsSvc.setOpenCreatePostFile(null);
    }

    if (this.showWithInitialContents && this.automaticPostSvc.hasPostAvailable()) {
      const post = this.automaticPostSvc.consume();
      setTimeout(() => {
        this.newPostForm.patchValue({
          title: post.title,
          content: post.content
        });
        this.selectedCategories = [];
        post.categories.forEach(c => this.toggleCategory(c));
      }, 100);
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
    const cats = this.selectedCategories.length === 0 ? [PostCategory.createPostCategory('others')] : this.selectedCategories;

    this.forumSvc.createNewPost(title, content, imgUrl, cats)
    .then(id => {
      this.router.navigate(['post', id], {
        relativeTo: this.activatedRoute
      });
      const sortOption = this.initialContentsSvc.getPreviousSortOption();
      this.initialContentsSvc.reset();
      this.initialContentsSvc.save([], sortOption, false);
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
    this.selectedCategories = [PostCategory.createPostCategory('others')];
  }



  public toggleCategory(name: string): void {
    if (!this.isSelected(name)) {
      this.selectedCategories.push(PostCategory.createPostCategory(name));
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c.toString() !== name);
    }
  }

  public removeSelectedCategory(cat: PostCategory): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
  }

  public isSelected(name: string): boolean {
    return this.selectedCategories.map(c => c.toString()).includes(name);
  }

}
