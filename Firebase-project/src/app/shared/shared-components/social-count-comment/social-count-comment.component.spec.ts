import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCountCommentComponent } from './social-count-comment.component';

describe('SocialCountCommentComponent', () => {
  let component: SocialCountCommentComponent;
  let fixture: ComponentFixture<SocialCountCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialCountCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialCountCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
