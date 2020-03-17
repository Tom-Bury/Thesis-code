import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatikMapComponent } from './statik-map.component';

describe('StatikMapComponent', () => {
  let component: StatikMapComponent;
  let fixture: ComponentFixture<StatikMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatikMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatikMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
