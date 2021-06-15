import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CgpListingComponent } from './cgp-listing/cgp-listing.component';
import { CgpCategoryComponent } from './cgp-category/cgp-category.component';
import { CgpCategoryFilterComponent } from './cgp-category-filter/cgp-category-filter.component';
import { CgpArticleComponent } from './cgp-article/cgp-article.component';
import {CgpMoreExpertsComponent} from './cgp-more-experts/cgp-more-experts.component';
import {CgpDetailsComponent} from './cgp-details/cgp-details.component';
import {MoreArticlesComponent} from './more-articles/more-articles.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CgpArticleViewComponent } from './cgp-article-view/cgp-article-view.component';
import {TagArticlesComponent} from './tag-articles/tag-articles.component';
import {HomeComponent} from '../home/home/home.component'


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Landing' }
  },
  {
    path: ':name/profile',
    component: CgpDetailsComponent,
    data: { title: 'Landing' }
  },
  {
    path: 'listing/:search',
    component: CgpListingComponent,
    data: { title: 'Landing' }
  },
  {
    path: 'category/:id/:search',
    component: CgpCategoryComponent,
    data: { title: 'category' }
},
  {
    path: 'filter',
    component: CgpCategoryFilterComponent,
    data: { title: 'category-filter' }
  },
  {
    path: 'article/:speciality/:subSpeciality',
    component: CgpArticleComponent,
    data: { title: 'article' }
  },
  {
    path: 'more-advisors/:subSpeciality/:search',
    component: CgpMoreExpertsComponent,
    data: { title: 'article' }
  },
  {
    path: 'more-articles/:type/:id/:name',
    component: MoreArticlesComponent,
    data: { title: 'article' }
  },
  {
    path: 'tags-articles/:name/:id',
    component: TagArticlesComponent,
    data: { title: 'article' }
  },
  {
    path: 'articles/:name',
    component: ArticleDetailsComponent,
    data: { title: 'article' }
  },{
    path: 'articles/view/:name',
    component: CgpArticleViewComponent,
    data: { title: 'article' }
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
    data: { title: 'appointment' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
