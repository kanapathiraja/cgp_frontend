import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StrapiService} from '../../../services/strapi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-more-articles',
  templateUrl: './more-articles.component.html',
  styleUrls: ['./more-articles.component.scss']
})
export class MoreArticlesComponent implements OnInit {
  public id: any;
  public type: any;
  public name: any;
  public aticlesList: any[] = [];
  user: any;

  constructor(private route: ActivatedRoute,
              private strapiService: StrapiService,
              public ngxLoader: NgxUiLoaderService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.type = params.type;
      this.name = params.name;
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    if (this.type === 'recent-articles') {
      this.mostRecent(0);
    }else if (this.type === 'recent-speciality') {
      this.mostRecentforSpeciality('all');
    } else if (this.type === 'cgp') {
      this.getArticlesList('all');
    }
  }

  mostRecent(limit: number) {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.mostRecentArticles('recent', limit).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

  mostRecentforSpeciality(type: string) {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.specialityArticles(this.id, 0, 'recent', type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

  getArticlesList(type: string) {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.cgpArticles(this.id, 0, type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

}
