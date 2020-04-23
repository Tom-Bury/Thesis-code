import { Injectable } from '@angular/core';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';
import { SortOption } from './sort-option.enum';
import { DatetimeRange } from '../shared/interfaces/datetime-range.model';
import { PostCategory } from '../shared/interfaces/forum/post-category.model';

@Injectable({
  providedIn: 'root'
})
export class PreviousLoadedPostsService {

  private openCreatePostFile: File = null;
  private createPostFileChartName: string;
  private createPostFileDatetimeRange: DatetimeRange;

  private previouslyLoadedPosts: ForumPost[] = [];
  private loadedAll = false;
  private previousSortOption = SortOption.MostRecent;
  private previousSelectedCategories: PostCategory[] = [];

  constructor() { }

  public save(posts: ForumPost[], sortOption: SortOption, hasLoadedAll: boolean): void {
    this.previouslyLoadedPosts = posts;
    this.previousSortOption = sortOption;
    this.loadedAll = hasLoadedAll;
    this.openCreatePostFile = null;
  }


  public canLoadMore(): boolean {
    return this.loadedAll;
  }

  public getPreviouslyLoadedPosts(): ForumPost[] {
    return this.previouslyLoadedPosts;
  }

  public getPreviousSortOption(): SortOption {
    return this.previousSortOption;
  }

  public setOpenCreatePostFile(file: File, chartName: string = '', datetimeRange: DatetimeRange = null) {
    this.openCreatePostFile = file;
    if (file !== null) {
      this.createPostFileChartName = chartName;
      this.createPostFileDatetimeRange = datetimeRange;
    } else {
      this.createPostFileChartName = '';
      this.createPostFileDatetimeRange = null;
    }
  }

  public getCreatePostPictureFile(): File {
    return this.openCreatePostFile;
  }

  public getCreatePostChartName(): string {
    return this.createPostFileChartName;
  }

  public getCreatePostDatetimeString(): string {
    return this.createPostFileDatetimeRange.toString();
  }

  public activeCreatePostOnForumPageInit(): boolean {
    return this.openCreatePostFile !== null;
  }


  public setSelectedCategories(cats: PostCategory[]): void {
    this.previousSelectedCategories = cats;
  }

  public getSelectedCategories(): PostCategory[] {
    return this.previousSelectedCategories;
  }

  public reset(): void {
    this.openCreatePostFile = null;
    this.createPostFileChartName = '';
    this.createPostFileDatetimeRange = null;
    this.previouslyLoadedPosts = [];
    this.loadedAll = false;
    this.previousSortOption = SortOption.MostRecent;
    this.previousSelectedCategories = [];
  }
}
