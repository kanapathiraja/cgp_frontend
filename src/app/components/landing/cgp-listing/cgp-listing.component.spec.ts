import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpListingComponent } from './cgp-listing.component';

describe('CgpListingComponent', () => {
  let component: CgpListingComponent;
  let fixture: ComponentFixture<CgpListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
