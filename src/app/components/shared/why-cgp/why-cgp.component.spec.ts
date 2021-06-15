import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyCgpComponent } from './why-cgp.component';

describe('WhyCgpComponent', () => {
  let component: WhyCgpComponent;
  let fixture: ComponentFixture<WhyCgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyCgpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyCgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
