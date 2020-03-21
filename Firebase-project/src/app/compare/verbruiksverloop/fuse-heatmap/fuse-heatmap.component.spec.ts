import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuseHeatmapComponent } from './fuse-heatmap.component';

describe('FuseHeatmapComponent', () => {
  let component: FuseHeatmapComponent;
  let fixture: ComponentFixture<FuseHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuseHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuseHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
