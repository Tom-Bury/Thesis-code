import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPostCardComponent } from './forum-post-card.component';

describe('ForumPostCardComponent', () => {
  let component: ForumPostCardComponent;
  let fixture: ComponentFixture<ForumPostCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumPostCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
