import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoHoverComponent } from './info-hover.component';

describe('InfoHoverComponent', () => {
  let component: InfoHoverComponent;
  let fixture: ComponentFixture<InfoHoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
