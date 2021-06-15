import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpLayoutComponent } from './cgp-layout.component';

describe('CgpLayoutComponent', () => {
  let component: CgpLayoutComponent;
  let fixture: ComponentFixture<CgpLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
