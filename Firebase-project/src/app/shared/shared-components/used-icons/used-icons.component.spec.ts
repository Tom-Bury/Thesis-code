import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedIconsComponent } from './used-icons.component';

describe('UsedIconsComponent', () => {
  let component: UsedIconsComponent;
  let fixture: ComponentFixture<UsedIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsedIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsedIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
