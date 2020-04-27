import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDistributionChartComponent } from './sensor-distribution-chart.component';

describe('SensorDistributionChartComponent', () => {
  let component: SensorDistributionChartComponent;
  let fixture: ComponentFixture<SensorDistributionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorDistributionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
