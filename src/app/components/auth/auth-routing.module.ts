import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CgpJoinComponent } from './cgp-join/cgp-join.component';
import { CgpInitPasswordComponent } from './cgp-init-password/cgp-init-password.component';
import { AppointmentLoginComponent } from './appointment-login/appointment-login.component';
import { TeamJoinComponent } from './team-join/team-join.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Sign In' }
      },
       {
        path: 'signup',
        component: SignupComponent,
        data: { title: 'Sign In' }
      },
      {
        path: 'password/forgot',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot Password' }
      },
      {
        path: 'password/reset/:token',
        component: ResetPasswordComponent,
        data: { title: 'Reset Password' }
      },
      {
        path: 'password/set',
        component: CgpInitPasswordComponent,
        data: { title: 'Reset Password' }
      },
      {
        path: 'request',
        component: CgpJoinComponent,
        data: { title: 'Sign In' }
      },
      {
        path: 'team-join',
        component: TeamJoinComponent,
        data: { title: 'Sign In' }
      },
      {
        path: 'appointment',
        component: AppointmentLoginComponent,
        data: { title: 'Appointment Login' }
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
