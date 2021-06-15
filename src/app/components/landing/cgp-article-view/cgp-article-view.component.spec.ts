import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CgpArticleViewComponent } from './cgp-article-view.component';

describe('ArticleDetailsComponent', () => {
  let component: CgpArticleViewComponent;
  let fixture: ComponentFixture<CgpArticleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CgpArticleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CgpArticleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
