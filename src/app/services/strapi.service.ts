import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {

  private url = environment.API_URL;
  public articleDetails: Subject<any> = new Subject();
  public cgpSearch: Subject<any> = new Subject();
  public cgpCount: Subject<any> = new Subject();

  constructor(private http: HttpClient) { }

  getSpecialties(search: any): Observable<any> {
    if (search) {
      return this.http.get(this.url + 'cgp/getSpeciality?searchKey=' + search);
    } else {
      return this.http.get(this.url + 'cgp/getSpeciality');
    }
  }

  getSpecialtiesandSubtopic(categoryId: any): Observable<any> {
    if (categoryId) {
      return this.http.get(this.url + 'cgp/getSpecialityandSubtopics?specialityId=' + categoryId);
    } else {
      return this.http.get(this.url + 'cgp/getSpecialityandSubtopics');
    }

  }

  getCgpBySpecialties(searchword: any, data: any): Observable<any> {
    return this.http.post(this.url + 'cgp/getCgpBySearchSpeciality/' + searchword, data);
  }

  getCgpListBySubtopic(specialityId: any, limit: any, data: any): Observable<any> {
    return this.http.post(this.url + 'cgp/getCgpbySubtopic?specialityId=' + specialityId + '&limit=' + limit, data);
  }

  getSubTopicDetails(subtopicId: any): Observable<any> {
    return this.http.get(this.url + 'cgp/getSpecialityandSubtopicDetails?subtopicId=' + subtopicId);
  }

  nearbyCgpList(data: any): Observable<any> {
    return this.http.post(this.url + 'cgp/nearbyCgpList', data);
  }

  mostRecentArticles(type: string, limit: number): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/articlesbasedonType/' + type + '?limit=' + limit);
  }

  tagsArticles(subtopicId: string, limit: number, type: string): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/subtopics/' + subtopicId + '?limit=' + limit + '&type=' + type);
  }

  specialityArticles(specialityId: string, limit: number, type: string, articleType: string): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/speciality/' + specialityId + '?limit=' + limit + '&type=' + type + '&articleType=' + articleType);
  }

  cgpArticles(cgpId: string, limit: number, type: string): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/articlesbasedonCgp/' + cgpId + '?limit=' + limit + '&type=' + type);
  }

  articlesDetails(name: string, data: any): Observable<any> {
    return this.http.post(this.url + 'cgp/articles/details/' + name, data);
  }

  articleViewUpdate(id: string): Observable<any> {
    return this.http.put(this.url + 'cgp/articles/updateViewArticle/' + id, '');
  }

  updateDistance(formdata: any): Observable<any> {
    return this.http.post(this.url + 'cgp/list/location', formdata);
  }

  otherCGPList(formdata: any, cgpId: string): Observable<any> {
    return this.http.post(this.url + 'cgp/cgplistExceptOwn/' + cgpId, formdata);
  }

  articlesByTags(tagId: any, type: string): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/searchList/' + tagId + '?type=' + type);
  }

}
