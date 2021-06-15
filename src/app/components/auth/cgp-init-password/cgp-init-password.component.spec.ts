import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpInitPasswordComponent } from './cgp-init-password.component';

describe('CgpInitPasswordComponent', () => {
  let component: CgpInitPasswordComponent;
  let fixture: ComponentFixture<CgpInitPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpInitPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpInitPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
