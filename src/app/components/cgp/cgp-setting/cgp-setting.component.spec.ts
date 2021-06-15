import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpSettingComponent } from './cgp-setting.component';

describe('CgpSettingComponent', () => {
  let component: CgpSettingComponent;
  let fixture: ComponentFixture<CgpSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
