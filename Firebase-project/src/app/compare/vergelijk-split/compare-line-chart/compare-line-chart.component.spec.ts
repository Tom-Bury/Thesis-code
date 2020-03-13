import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareLineChartComponent } from './compare-line-chart.component';

describe('CompareLineChartComponent', () => {
  let component: CompareLineChartComponent;
  let fixture: ComponentFixture<CompareLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
