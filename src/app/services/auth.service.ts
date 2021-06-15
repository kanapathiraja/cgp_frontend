import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.API_URL;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    let flag = true;
    if (token) {
      flag = this.jwtHelper.isTokenExpired(token);
    }
    return !flag;
  }

  authenticate(params: any): Observable<any> {
    return this.http.post(this.url + 'auth/login', params);
  }

  register(params: any): Observable<any> {
    return this.http.post(this.url + 'auth/register', params, { headers: { Anonymous: '' }});
  }

  sendEmailForgotPassword(params: any): Observable<any> {
    return this.http.post(this.url + 'auth/password/forgot', params, { headers: { Anonymous: '' }});
  }

  resetPassword(params: any, token: string): Observable<any> {
    return this.http.put(this.url + 'auth/password/reset/' + token, params, { headers: { Anonymous: '' }});
  }

  checkIfPasswordUpdated(userId: string): Observable<any> {
    return this.http.get(this.url + 'auth/password/check/update/' + userId, { headers: { Anonymous: '' }});
  }

  setPassword(params: any, userId: string): Observable<any> {
    return this.http.put(this.url + 'auth/password/set/' + userId, params, { headers: { Anonymous: '' }});
  }

  checkIfTokenValid(token: string): Observable<any> {
    return this.http.get(this.url + 'auth/token/verify/' + token, { headers: { Anonymous: '' }});
  }


  emailValidate(email:any, role:any): Observable<any> {
    return this.http.get(this.url + 'auth/emailValidate/' + email + '/' + role);
  }


}
