import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCategoryBadgeComponent } from './post-category-badge.component';

describe('PostCategoryBadgeComponent', () => {
  let component: PostCategoryBadgeComponent;
  let fixture: ComponentFixture<PostCategoryBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCategoryBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCategoryBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
