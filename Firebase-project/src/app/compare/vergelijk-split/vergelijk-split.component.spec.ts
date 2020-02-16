import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VergelijkSplitComponent } from './vergelijk-split.component';

describe('VergelijkSplitComponent', () => {
  let component: VergelijkSplitComponent;
  let fixture: ComponentFixture<VergelijkSplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VergelijkSplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VergelijkSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
