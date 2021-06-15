import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityHeaderComponent } from './speciality-header.component';

describe('SpecialityHeaderComponent', () => {
  let component: SpecialityHeaderComponent;
  let fixture: ComponentFixture<SpecialityHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialityHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialityHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
