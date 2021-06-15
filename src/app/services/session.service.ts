import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sideMenuSource = new BehaviorSubject(true);
  sideMenu = this.sideMenuSource.asObservable();

  constructor(
  ) { }

  changeSideMenu(data: any) {
    this.sideMenuSource.next(data);
  }

  setToken(token: any): any{
    localStorage.setItem('access_token', token);
  }

  getToken(): any{
    return localStorage.getItem('access_token');
  }

  clearToken(): any{
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  setLocal(key: any, value: any): any{
    localStorage.setItem(key, value);
  }

    getLocal(key: any): any{
    return localStorage.getItem(key);
  }

  clearLocal(): any{
    localStorage.clear();
  }
}
