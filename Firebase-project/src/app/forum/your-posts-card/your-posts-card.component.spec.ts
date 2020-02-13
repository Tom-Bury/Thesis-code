import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPostsCardComponent } from './your-posts-card.component';

describe('YourPostsCardComponent', () => {
  let component: YourPostsCardComponent;
  let fixture: ComponentFixture<YourPostsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPostsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPostsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
