import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import {environment} from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  count = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private spinner: NgxSpinnerService
    ){
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let avoidSpinner = [
      environment.API_URL + 'cgp/getSpeciality',
      environment.API_URL + 'cgp/articles/articlesbasedonCgp'
    ];

    if (!this.authService.isAuthenticated() && request.headers.get('Anonymous') == null) {
        // this.router.navigate(['/']);
    }

    this.count++;
    let headers: any;
    let cloneReq = request.clone({ });


    if (request.headers.get('Anonymous') !== undefined && request.headers.get('Anonymous') !== null) {
       headers = request.headers.delete('Anonymous')
       cloneReq = request.clone({ headers });
    } else {
      headers = request.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.sessionService.getToken()}`);
      cloneReq = request.clone({ headers });
    }

    if (!avoidSpinner.includes(request.url.split('?')[0])) {
      this.spinner.show();
    }

    return next.handle(cloneReq)
    .pipe(
    retry(1),
    tap(evt => {
      if (evt instanceof HttpResponse) {
        this.spinner.hide();
          if (evt.body && evt.body.status) {
              // this.spinner.hide();
          }
        }
     }),
     finalize(() => {
      this.count--;
      if (this.count === 0) {
        this.spinner.hide();
      }
  }),
  catchError((error: HttpErrorResponse) => {
   console.log('TokenInterceptor -> error', error.error);
   return throwError(error.error);
   })
 );

}
}
