import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPostImageComponent } from './forum-post-image.component';

describe('ForumPostImageComponent', () => {
  let component: ForumPostImageComponent;
  let fixture: ComponentFixture<ForumPostImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumPostImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumPostImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
