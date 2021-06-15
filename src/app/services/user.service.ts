import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.API_URL;
  private strurl = environment.STRAPI_URL;
  constructor(private http: HttpClient) { }

  getUserInfomation(userd: string): Observable<any> {
    return this.http.get(this.url + 'users/profile/' + userd);
  }

  updateUserInfomation(formdata: any): Observable<any> {
    return this.http.post(this.url + 'users/profile/update', formdata);
  }

  updateUserPasswordInfomation(formdata: any, userId: any): Observable<any> {
    return this.http.put(this.url + 'auth/password/change/' + userId, formdata);
  }
}
