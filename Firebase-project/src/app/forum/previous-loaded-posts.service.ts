import { Injectable } from '@angular/core';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';
import { SortOption } from './sort-option.enum';

@Injectable({
  providedIn: 'root'
})
export class PreviousLoadedPostsService {

  private openCreatePostFile: File = null;
  private previouslyLoadedPosts: ForumPost[] = [];
  private loadedAll = false;
  private previousSortOption = SortOption.MostRecent;

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

  public setOpenCreatePostFile(file: File) {
    this.openCreatePostFile = file;
  }

  public getCreatePostPictureFile(): File {
    return this.openCreatePostFile;
  }

  public showModalOnForumPageInit(): boolean {
    return this.openCreatePostFile !== null;
  }

  public reset(): void {
    this.openCreatePostFile = null;
    this.previouslyLoadedPosts = [];
    this.loadedAll = false;
    this.previousSortOption = SortOption.MostRecent;
  }
}
