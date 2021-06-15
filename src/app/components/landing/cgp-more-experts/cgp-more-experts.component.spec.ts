import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpMoreExpertsComponent } from './cgp-more-experts.component';

describe('CgpMoreExpertsComponent', () => {
  let component: CgpMoreExpertsComponent;
  let fixture: ComponentFixture<CgpMoreExpertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpMoreExpertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpMoreExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
