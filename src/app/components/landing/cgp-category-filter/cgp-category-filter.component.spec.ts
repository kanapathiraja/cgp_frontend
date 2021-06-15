import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpCategoryFilterComponent } from './cgp-category-filter.component';

describe('CgpCategoryFilterComponent', () => {
  let component: CgpCategoryFilterComponent;
  let fixture: ComponentFixture<CgpCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpCategoryFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
