import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CgpJoinComponent } from './cgp-join/cgp-join.component';
import {LandingModule} from '../landing/landing.module';
import { CgpInitPasswordComponent } from './cgp-init-password/cgp-init-password.component';
import { AppointmentLoginComponent } from './appointment-login/appointment-login.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TeamJoinComponent } from './team-join/team-join.component';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetPasswordComponent, CgpJoinComponent, CgpInitPasswordComponent, AppointmentLoginComponent, TeamJoinComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    TranslateModule,
    SweetAlert2Module,
    LandingModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
})
export class AuthModule { }
