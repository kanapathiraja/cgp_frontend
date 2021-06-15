import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { CgpListingComponent } from './cgp-listing/cgp-listing.component';
import { TranslateModule } from '@ngx-translate/core';
import { CgpCategoryComponent } from './cgp-category/cgp-category.component';
import { CgpCategoryFilterComponent } from './cgp-category-filter/cgp-category-filter.component';
import { CgpArticleComponent } from './cgp-article/cgp-article.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxAutocompleteModule } from 'ngx-angular-autocomplete';
import { CgpGridComponent } from './cgp-grid/cgp-grid.component';
import { SpecialityHeaderComponent } from './speciality-header/speciality-header.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SubtopicGridComponent } from './subtopic-grid/subtopic-grid.component';
import { CgpMoreExpertsComponent } from './cgp-more-experts/cgp-more-experts.component';
import { CgpDetailsComponent } from './cgp-details/cgp-details.component';
import { SwiperModule } from 'swiper/angular';
import { ArticlesGridComponent } from './articles-grid/articles-grid.component';
import { MoreArticlesComponent } from './more-articles/more-articles.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { CgpArticleViewComponent } from './cgp-article-view/cgp-article-view.component';
import { Ng5SliderModule } from 'ng5-slider';
import { AgmCoreModule } from '@agm/core';
import { AppointmentComponent } from './appointment/appointment.component';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import { TagArticlesComponent } from './tag-articles/tag-articles.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SpecialityHeaderOuterComponent } from './speciality-header-outer/speciality-header-outer.component';


@NgModule({
    declarations: [ CgpListingComponent, CgpCategoryComponent, CgpCategoryFilterComponent, CgpArticleComponent, CgpGridComponent, SpecialityHeaderComponent, SubtopicGridComponent, CgpMoreExpertsComponent, CgpDetailsComponent, ArticlesGridComponent, MoreArticlesComponent, ArticleDetailsComponent, AppointmentComponent,CgpArticleViewComponent, TagArticlesComponent, SpecialityHeaderOuterComponent],
    exports: [
        SpecialityHeaderComponent,
        ArticlesGridComponent,
        CgpGridComponent,
        SpecialityHeaderOuterComponent,
        SubtopicGridComponent
    ],
    imports: [
        CommonModule,
        LandingRoutingModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NgxAutocompleteModule,
        IvyCarouselModule,
        MatAutocompleteModule,
        SwiperModule,
        Ng5SliderModule,
        ShareButtonsModule.withConfig({
            debug: true
          }),
        ShareIconsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBJc9TVKg1zjpjU_LJYVeeI62wxm6ss7UU',
            libraries: ['places']
        }),
        NgxUiLoaderModule,
    ]
})
export class LandingModule { }
