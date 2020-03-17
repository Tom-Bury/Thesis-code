import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayLineChartComponent } from './today-line-chart.component';

describe('TodayLineChartComponent', () => {
  let component: TodayLineChartComponent;
  let fixture: ComponentFixture<TodayLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
