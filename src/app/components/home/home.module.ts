import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import { NgxAutocompleteModule } from 'ngx-angular-autocomplete';
import { LandingModule } from '../landing/landing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatAutocompleteModule,
    NgxUiLoaderModule,
    NgxAutocompleteModule,
    LandingModule,
    TranslateModule,FormsModule, ReactiveFormsModule
  ]
})
export class HomeModule { }
