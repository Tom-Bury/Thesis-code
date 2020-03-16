import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuseBarChartComponent } from './fuse-bar-chart.component';

describe('FuseBarChartComponent', () => {
  let component: FuseBarChartComponent;
  let fixture: ComponentFixture<FuseBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuseBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuseBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
