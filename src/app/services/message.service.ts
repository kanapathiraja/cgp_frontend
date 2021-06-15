import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  private url = environment.API_URL;
  private strurl = environment.STRAPI_URL;

  constructor(private http: HttpClient) { }



  getConversationList(userId: any): Observable<any> {
    return this.http.get(`${this.url}conversation/getAllTeamConversation/${userId}`);
  }

  getUserConversationList(userId: any): Observable<any> {
    return this.http.get(`${this.url}conversation/getAllUserConversation/${userId}`);
  }

  getTeamUser(emailId: any): Observable<any> {
    return this.http.get(`${this.url}conversation/getTeamUser/${emailId}`);
  }

  getMessageList(conversationId: any): Observable<any> {
    return this.http.get(`${this.url}conversation/getAllConversation/${conversationId}`);
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post(`${this.url}conversation/send`, message)
  }

  getTeamUserById(teamUserId: any): Observable<any> {
    return this.http.get(`${this.url}cgp/team/${teamUserId}`);
  }
  getAllConversationCount(): Observable<any> {
    return this.http.get(`${this.url}conversation/getAllNewUserConversationCount`);
  }

  getAllUserConversationCount(): Observable<any> {
    return this.http.get(`${this.url}conversation/getAllNewTeamConversationCount`);
  }

  viewAllUserConversation(payload: any): Observable<any> {
    return this.http.put(`${this.url}conversation/messageUserViewUpdate`, payload);
  }

  viewAllTeamConversation(payload: any): Observable<any> {
    return this.http.put(`${this.url}conversation/messageTeamViewUpdate`, payload);
  }
}
