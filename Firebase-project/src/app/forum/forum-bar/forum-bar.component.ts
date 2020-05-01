import {
  Component,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import {
  PreviousLoadedPostsService
} from '../previous-loaded-posts.service';
import {
  SortOption
} from '../sort-option.enum';
import { PostCategory } from 'src/app/shared/interfaces/forum/post-category.model';

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit {

  @Output() sortBySelected = new EventEmitter < SortOption > ();
  @Output() selectedCategoriesChanged = new EventEmitter<PostCategory[]>();

  public sortByValues = Object.values(SortOption);
  // public sortByForm: FormGroup;
  public currSortByOption: SortOption;

  public possibleCategories = PostCategory.allCategoryStrings();
  public possibleCategoriesIcons = PostCategory.allCategoryIcons();
  public selectedCategories = [];


  constructor(
    private fb: FormBuilder,
    private previousLoadedPostsSvc: PreviousLoadedPostsService,
  ) {
    this.selectedCategories = this.previousLoadedPostsSvc.getSelectedCategories();
  }

  ngOnInit(): void {
    // this.sortByForm = this.fb.group({
    //   sortBy: [this.previousLoadedPostsSvc.getPreviousSortOption(), Validators.required]
    // });
    this.currSortByOption = this.previousLoadedPostsSvc.getPreviousSortOption();
  }


  public sendSortBy(opt: SortOption): void {
    this.currSortByOption = opt;
    this.sortBySelected.emit(opt);
  }

  public sendCategories(): void {
    this.selectedCategoriesChanged.emit(this.selectedCategories);
  }


  public toggleCategory(name: string): void {
    if (!this.isSelected(name)) {
      this.selectedCategories.push(PostCategory.createPostCategory(name));
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c.toString() !== name);
    }
    this.previousLoadedPostsSvc.setSelectedCategories(this.selectedCategories);
    this.sendCategories();
  }

  public removeSelectedCategory(cat: PostCategory): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
    this.previousLoadedPostsSvc.setSelectedCategories(this.selectedCategories);
    this.sendCategories();
  }

  public isSelected(name: string): boolean {
    return this.selectedCategories.map(c => c.toString()).includes(name);
  }

  public selectAll(): void {
    this.selectedCategories = this.possibleCategories.map(name => PostCategory.createPostCategory(name));
    this.sendCategories();
  }

  public allSelected(): boolean {
    return this.possibleCategories.length === this.selectedCategories.length;
  }

  public displaySearchNotImplemented(): void {
    alert('This search bar is just a dummy, it has no functionality. It would give you results of posts with your search terms in the title or content.')
  }
}
