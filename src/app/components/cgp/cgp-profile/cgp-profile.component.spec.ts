import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpProfileComponent } from './cgp-profile.component';

describe('CgpProfileComponent', () => {
  let component: CgpProfileComponent;
  let fixture: ComponentFixture<CgpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
