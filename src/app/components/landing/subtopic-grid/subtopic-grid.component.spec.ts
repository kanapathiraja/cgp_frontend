import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtopicGridComponent } from './subtopic-grid.component';

describe('SubtopicGridComponent', () => {
  let component: SubtopicGridComponent;
  let fixture: ComponentFixture<SubtopicGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtopicGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtopicGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
