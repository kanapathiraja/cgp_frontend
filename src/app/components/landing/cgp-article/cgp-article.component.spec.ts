import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpArticleComponent } from './cgp-article.component';

describe('CgpArticleComponent', () => {
  let component: CgpArticleComponent;
  let fixture: ComponentFixture<CgpArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
