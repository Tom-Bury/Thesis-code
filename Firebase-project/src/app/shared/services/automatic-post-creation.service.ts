import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutomaticPostCreationService {

  private title: string;
  private content: string;
  private categories: string[];

  private hasPost = false;

  constructor() { }

  public setPost(title: string, content: string, categories: string[]): void {
    this.title = title;
    this.content = content;
    this.categories = categories;

    this.hasPost = true;
  }


  public hasPostAvailable(): boolean {
    return this.hasPost;
  }


  public consume(): {title: string, content: string, categories: string[]} {
    const result = {
      title: this.title,
      content: this.content,
      categories: this.categories
    };
    this.title = '';
    this.content = '';
    this.categories = [];
    this.hasPost = false;
    return result;
  }
}
