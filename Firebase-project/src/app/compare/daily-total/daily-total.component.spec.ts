import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTotalComponent } from './daily-total.component';

describe('DailyTotalComponent', () => {
  let component: DailyTotalComponent;
  let fixture: ComponentFixture<DailyTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
