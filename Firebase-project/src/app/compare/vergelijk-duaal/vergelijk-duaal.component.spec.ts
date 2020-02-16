import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VergelijkDuaalComponent } from './vergelijk-duaal.component';

describe('VergelijkDuaalComponent', () => {
  let component: VergelijkDuaalComponent;
  let fixture: ComponentFixture<VergelijkDuaalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VergelijkDuaalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VergelijkDuaalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
