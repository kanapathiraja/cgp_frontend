import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CgpRoutingModule } from './cgp-routing.module';
import { CgpProfileComponent } from './cgp-profile/cgp-profile.component';
import { CgpDashboardComponent } from './cgp-dashboard/cgp-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { CgpSettingComponent } from './cgp-setting/cgp-setting.component';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ContentsComponent } from './contents/contents.component';
import { NewArticleComponent } from './new-article/new-article.component';
import { MessageComponent } from './message/message.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeamComponent } from './team/team.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import {MatRadioModule} from '@angular/material/radio';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';
import {LandingModule} from '../landing/landing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { AgmCoreModule } from '@agm/core';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataTablesModule } from "angular-datatables";


@NgModule({
  declarations: [CgpProfileComponent, CgpDashboardComponent, CgpSettingComponent, ContentsComponent, NewArticleComponent, MessageComponent, AppointmentComponent, CalendarComponent, TeamComponent, ConfigCalendarComponent],
  imports: [
    CommonModule,
    CgpRoutingModule,
    TranslateModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgOptionHighlightModule,
    NgSelectModule,
    MatRadioModule, LandingModule,
    CKEditorModule, AgmCoreModule, Ng2ImgMaxModule,
    NgxUiLoaderModule, ImageCropperModule,DataTablesModule
  ]
})
export class CgpModule { }
