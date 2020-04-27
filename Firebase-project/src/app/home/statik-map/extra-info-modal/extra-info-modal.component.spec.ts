import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraInfoModalComponent } from './extra-info-modal.component';

describe('ExtraInfoModalComponent', () => {
  let component: ExtraInfoModalComponent;
  let fixture: ComponentFixture<ExtraInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
