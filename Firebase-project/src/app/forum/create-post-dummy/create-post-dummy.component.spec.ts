import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostDummyComponent } from './create-post-dummy.component';

describe('CreatePostDummyComponent', () => {
  let component: CreatePostDummyComponent;
  let fixture: ComponentFixture<CreatePostDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePostDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePostDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
