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
  ForumService
} from 'src/app/shared/services/forum.service';
import {
  PreviousLoadedPostsService
} from '../previous-loaded-posts.service';
import {
  SortOption
} from '../sort-option.enum';
declare let $: any;

@Component({
  selector: 'app-forum-bar',
  templateUrl: './forum-bar.component.html',
  styleUrls: ['./forum-bar.component.scss']
})
export class ForumBarComponent implements OnInit {

  @Output() sortBySelected = new EventEmitter < SortOption > ();

  public sortByValues = Object.values(SortOption);
  public sortByForm: FormGroup;


  constructor(
    private forumSvc: ForumService,
    private fb: FormBuilder,
    private previousLoadedPostsSvc: PreviousLoadedPostsService,
  ) {}

  ngOnInit(): void {
    this.sortByForm = this.fb.group({
      sortBy: [this.previousLoadedPostsSvc.getPreviousSortOption(), Validators.required]
    });
  }


  public sendSortBy(): void {
    this.sortBySelected.emit(this.sortByForm.value.sortBy);
  }

}
