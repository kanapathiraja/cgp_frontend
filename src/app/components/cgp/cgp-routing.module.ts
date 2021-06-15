import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CgpDashboardComponent } from './cgp-dashboard/cgp-dashboard.component';
import { CgpProfileComponent } from './cgp-profile/cgp-profile.component';
import { CgpSettingComponent } from './cgp-setting/cgp-setting.component';
import { ContentsComponent } from './contents/contents.component';
import { NewArticleComponent } from './new-article/new-article.component';
import { CgpCategoryComponent } from '../landing/cgp-category/cgp-category.component';
import { CgpCategoryFilterComponent } from '../landing/cgp-category-filter/cgp-category-filter.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { MessageComponent } from './message/message.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeamComponent } from './team/team.component';
import { ConfigCalendarComponent } from './config-calendar/config-calendar.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: '/cgp/dashboard',
      pathMatch: 'full'
    },
    {
      path: 'profile',
      component: CgpProfileComponent,
      data: { title: 'Sign In' }
    },
     {
      path: 'dashboard',
      canActivate: [AuthGuardService],
      component: CgpDashboardComponent,
      data: { title: 'Sign In' }
    },
    {
      path: 'setting',
      canActivate: [AuthGuardService],
      component: CgpSettingComponent,
      data: { title: 'Sign In' }
    },
    {
      path: 'category',
      canActivate: [AuthGuardService],
      component: CgpCategoryComponent,
      data: { title: 'Category' }
    },
    {
      path: 'filter',
      component: CgpCategoryFilterComponent,
      data: { title: 'Filter' }
    },
    {
      path: 'contents',
      canActivate: [AuthGuardService],
      component: ContentsComponent,
      data: { title: 'Contents' }
    },
    {
      path: 'message',
      component: MessageComponent,
      data: { title: 'Message' }
    },
    {
      path: 'appointment',
      component: AppointmentComponent,
      data: { title: 'Appointment' }
    },
    {
      path: 'calendar',
      component: CalendarComponent,
      data: { title: 'Calendar' }
    },
    {
      path: 'article',
      component: NewArticleComponent,
      data: { title: 'New Article' }
    },{
      path: 'article/:name',
      component: NewArticleComponent,
      data: { title: 'New Article' }
    },
    {
      path: 'team',
      component: TeamComponent,
      data: { title: 'Team' }
    },
    {
      path: 'config',
      component: ConfigCalendarComponent,
      data: { title: 'Config Calendar' }
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CgpRoutingModule { }
