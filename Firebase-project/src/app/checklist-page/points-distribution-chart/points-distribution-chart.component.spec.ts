import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsDistributionChartComponent } from './points-distribution-chart.component';

describe('PointsDistributionChartComponent', () => {
  let component: PointsDistributionChartComponent;
  let fixture: ComponentFixture<PointsDistributionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsDistributionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
