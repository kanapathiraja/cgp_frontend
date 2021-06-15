import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLoginComponent } from './appointment-login.component';

describe('AppointmentLoginComponent', () => {
  let component: AppointmentLoginComponent;
  let fixture: ComponentFixture<AppointmentLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
