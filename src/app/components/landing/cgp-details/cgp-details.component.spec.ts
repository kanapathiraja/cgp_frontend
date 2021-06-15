import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpDetailsComponent } from './cgp-details.component';

describe('CgpDetailsComponent', () => {
  let component: CgpDetailsComponent;
  let fixture: ComponentFixture<CgpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
