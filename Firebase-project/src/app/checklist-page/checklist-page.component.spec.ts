import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistPageComponent } from './checklist-page.component';

describe('ChecklistPageComponent', () => {
  let component: ChecklistPageComponent;
  let fixture: ComponentFixture<ChecklistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
