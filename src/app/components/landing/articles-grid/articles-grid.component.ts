import {Component, Input, OnInit} from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-articles-grid',
  templateUrl: './articles-grid.component.html',
  styleUrls: ['./articles-grid.component.scss']
})
export class ArticlesGridComponent implements OnInit {

  @Input() type = '';
  @Input() id = '';
  @Input() list: any[] = [];
  @Input() limit = 0;
  @Input() login: any;
  public aticlesList: any[] = [];
  public sortingType = 'recent';
  selectedType = 'all';

  constructor(private strapiService: StrapiService,
              private router: Router,
              public ngxLoader: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    if (!(this.list && this.list.length)) {
      if (this.type === 'recent') {
        this.mostRecent(4);
      } else if (this.type === 'recent-articles') {
        this.mostRecent(0);
      }else if (this.type === 'recent-speciality') {
        this.mostRecentforSpeciality('all');
      } else if (this.type === 'cgp') {
        this.getArticlesList('all');
      }
    } else {
      this.aticlesList = this.list;
      this.changeType('recent');
    }

  }

  mostRecent(limit: number) {
    this.strapiService.mostRecentArticles('recent', limit).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.changeType('recent');
      },
      (err: any) => {
      });
  }

  mostRecentforSpeciality(type: string) {
    this.strapiService.specialityArticles(this.id, 0, 'recent', type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.changeType('recent');
      },
      (err: any) => {
      });
  }

  getArticlesList(type: string) {
    this.strapiService.cgpArticles(this.id, this.limit ? this.limit : 40, type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.changeType('recent');
      },
      (err: any) => {
      });
  }

  articleRedirect(url: string) {
    this.router.navigate([url]);
    this.strapiService.articleDetails.next();
  }

  getArticlesListBasedonTags(type: string) {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.articlesByTags(this.id, type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.changeType('recent');
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

  articlesBasedonTypes(type: string) {
    this.selectedType = type;
    this.sortingType = 'recent';
    if (this.type === 'recent-speciality') {
      this.mostRecentforSpeciality(type);
    } else if (this.type === 'cgp') {
      this.getArticlesList(type);
    } else if (this.type === 'tags') {
      this.getArticlesListBasedonTags(type);
    }
  }

  changeType(value: string) {
   if (value === 'recent') {
     this.aticlesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
   } else {
     this.aticlesList.sort((a, b) => (Number(a.articleView) > Number(b.articleView) ? -1 : 1));
   }
  }
}
