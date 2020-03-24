import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentPostService {


  private currPostId: string;

  constructor() { }


  setCurrPost(postId: string): void {
    this.currPostId = postId;
  }
}
