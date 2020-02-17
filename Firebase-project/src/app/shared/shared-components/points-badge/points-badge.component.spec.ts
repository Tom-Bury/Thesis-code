import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsBadgeComponent } from './points-badge.component';

describe('PointsBadgeComponent', () => {
  let component: PointsBadgeComponent;
  let fixture: ComponentFixture<PointsBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
