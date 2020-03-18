import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandlestickStatsComponent } from './candlestick-stats.component';

describe('CandlestickStatsComponent', () => {
  let component: CandlestickStatsComponent;
  let fixture: ComponentFixture<CandlestickStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandlestickStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandlestickStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
