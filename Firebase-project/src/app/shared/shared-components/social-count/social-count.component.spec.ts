import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCountComponent } from './social-count.component';

describe('SocialCountComponent', () => {
  let component: SocialCountComponent;
  let fixture: ComponentFixture<SocialCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
