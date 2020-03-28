import { Injectable } from '@angular/core';
import { ForumPost } from '../shared/interfaces/forum/forum-post.model';

@Injectable({
  providedIn: 'root'
})
export class PreviousLoadedPostsService {

  private previouslyLoadedPosts: ForumPost[] = [];
  private loadedAll = false;

  constructor() { }

  public savePosts(posts: ForumPost[]): void {
    this.previouslyLoadedPosts = posts;
  }

  public hasLoadedAll(): void {
    this.loadedAll = true;
  }

  public canLoadMore(): boolean {
    return this.loadedAll;
  }

  public getPreviouslyLoadedPosts(): ForumPost[] {
    return this.previouslyLoadedPosts;
  }

  public reset(): void {
    this.previouslyLoadedPosts = [];
    this.loadedAll = false;
  }
}
