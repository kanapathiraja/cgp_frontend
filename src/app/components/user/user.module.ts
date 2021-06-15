import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ProfileComponent } from './profile/profile.component'
import {MatRadioModule} from '@angular/material/radio';
import { UserMessageComponent } from './user-message/user-message.component';

@NgModule({
  declarations: [ProfileComponent, UserMessageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserRoutingModule,
        TranslateModule,
        SweetAlert2Module,
        MatRadioModule
    ],
})
export class UserModule { }
