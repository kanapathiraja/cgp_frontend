import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpGridComponent } from './cgp-grid.component';

describe('CgpGridComponent', () => {
  let component: CgpGridComponent;
  let fixture: ComponentFixture<CgpGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
