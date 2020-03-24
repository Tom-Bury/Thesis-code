import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentToThreadComponent } from './comment-to-thread.component';

describe('CommentToThreadComponent', () => {
  let component: CommentToThreadComponent;
  let fixture: ComponentFixture<CommentToThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentToThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentToThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
