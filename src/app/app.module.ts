import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule,  } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  FooterComponent,
  SidebarComponent,
  HeaderComponent,
  AuthHeaderComponent,
  AuthFooterComponent
} from './components/shared';
import {
  AuthLayoutComponent,
  CgpLayoutComponent,
  HomeLayoutComponent
} from './components/layouts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {WhyCgpComponent} from './components/shared/why-cgp/why-cgp.component';
import {LandingModule} from './components/landing/landing.module';
import { PrivacyPolicyComponent } from './components/shared/privacy-policy/privacy-policy.component';


export function HttpLoaderFactory(httpClient: HttpClient) {
  // return new TranslateHttpLoader(httpClient);
  return new TranslateHttpLoader(httpClient, './assets/i18n/');
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const APP_LAYOUTS = [
  AuthLayoutComponent,
  CgpLayoutComponent,
  HomeLayoutComponent
];

const APP_COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  AuthHeaderComponent,
  AuthFooterComponent,
  WhyCgpComponent,
  PrivacyPolicyComponent
];


@NgModule({
  declarations: [
    AppComponent,
    ...APP_COMPONENTS,
    ...APP_LAYOUTS
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
    NgxSpinnerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    LandingModule
  ],
    exports: [    // optional in your case
        TranslateModule,
        AuthHeaderComponent
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
