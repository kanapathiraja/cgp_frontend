import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpDashboardComponent } from './cgp-dashboard.component';

describe('CgpDashboardComponent', () => {
  let component: CgpDashboardComponent;
  let fixture: ComponentFixture<CgpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
