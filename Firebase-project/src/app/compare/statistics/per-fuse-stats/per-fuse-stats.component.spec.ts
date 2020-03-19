import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerFuseStatsComponent } from './per-fuse-stats.component';

describe('PerFuseStatsComponent', () => {
  let component: PerFuseStatsComponent;
  let fixture: ComponentFixture<PerFuseStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerFuseStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerFuseStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
