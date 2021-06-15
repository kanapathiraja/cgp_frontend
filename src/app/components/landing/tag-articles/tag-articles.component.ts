import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StrapiService} from '../../../services/strapi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-tag-articles',
  templateUrl: './tag-articles.component.html',
  styleUrls: ['./tag-articles.component.scss']
})
export class TagArticlesComponent implements OnInit {

  public id: any;
  public name: any;
  public aticlesList: any[] = [];

  constructor(private route: ActivatedRoute,
              private strapiService: StrapiService,
              public ngxLoader: NgxUiLoaderService) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.name = params.name;
    });
  }

  ngOnInit(): void {
    this.getArticlesList('all');
  }

  getArticlesList(type: string) {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.articlesByTags(this.id, type).subscribe((res: any) => {
        this.aticlesList = res.data;
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

}
