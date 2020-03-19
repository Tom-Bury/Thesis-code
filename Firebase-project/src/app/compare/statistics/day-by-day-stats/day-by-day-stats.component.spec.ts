import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayByDayStatsComponent } from './day-by-day-stats.component';

describe('DayByDayStatsComponent', () => {
  let component: DayByDayStatsComponent;
  let fixture: ComponentFixture<DayByDayStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayByDayStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayByDayStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
