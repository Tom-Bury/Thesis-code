import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressLineChartComponent } from './progress-line-chart.component';

describe('ProgressLineChartComponent', () => {
  let component: ProgressLineChartComponent;
  let fixture: ComponentFixture<ProgressLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
