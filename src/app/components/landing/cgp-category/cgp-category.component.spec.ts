import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpCategoryComponent } from './cgp-category.component';

describe('CgpCategoryComponent', () => {
  let component: CgpCategoryComponent;
  let fixture: ComponentFixture<CgpCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
