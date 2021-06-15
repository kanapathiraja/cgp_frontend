import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityHeaderOuterComponent } from './speciality-header-outer.component';

describe('SpecialityHeaderOuterComponent', () => {
  let component: SpecialityHeaderOuterComponent;
  let fixture: ComponentFixture<SpecialityHeaderOuterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialityHeaderOuterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialityHeaderOuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
