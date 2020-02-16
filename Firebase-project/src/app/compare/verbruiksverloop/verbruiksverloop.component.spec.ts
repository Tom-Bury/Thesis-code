import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbruiksverloopComponent } from './verbruiksverloop.component';

describe('VerbruiksverloopComponent', () => {
  let component: VerbruiksverloopComponent;
  let fixture: ComponentFixture<VerbruiksverloopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbruiksverloopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbruiksverloopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
