import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpJoinComponent } from './cgp-join.component';

describe('CgpJoinComponent', () => {
  let component: CgpJoinComponent;
  let fixture: ComponentFixture<CgpJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
