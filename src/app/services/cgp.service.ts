import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CgpService {

  public subTopicCP: Subject<any> = new Subject();
  public categoruCGP: Subject<any> = new Subject();

  private url = environment.API_URL;
  private strurl = environment.STRAPI_URL;
  constructor(private http: HttpClient) { }


  cgpRequest(params: any): Observable<any> {
    return this.http.post(this.url + 'cgp/request', params);
  }

   getCGPPracticalInformatio(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/practicalInfo/getCGPPracticalInfo?cgpId=' + cgpId);
    }

   getCGPTeamInfomation(cgpTeamId: string, cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/team/' + cgpTeamId);
    }

   getCGPPresentation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/getCGPDescriptionInfo/' + cgpId);
    }

    getCGPCustomerInformation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/clients/' + cgpId);
    }

    getCGPSpecialityInformation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/specialities/' + cgpId);
    }

    getCGPPartnerInformation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/partners/' + cgpId);
    }

    getCGPSubtopicInformation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/subtopics/' + cgpId);
    }

    getCGPTagInformation(cgpId: string): Observable<any> {
      return this.http.get(this.url + 'cgp/tags/' + cgpId);
    }

    getCGPInformation(cgpName: any, data: any): Observable<any> {
      return this.http.post(this.url + 'cgp/getCGPInfo/' + cgpName, data);
    }

    getCGPEmailInformation(cgpId: any, data: any): Observable<any> {
      return this.http.post(this.url + 'cgp/getCGPEmailInfo?cgpId=' + cgpId, data);
    }

    updateCGPInfo(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/update/' + cgpId, formData);
    }

   updateCGPTeamService(formData: any, cgpTeamId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/team/update/' + cgpTeamId, formData, { headers: { Anonymous: '' }});
    }

   updateCGPPresentationService(formData: any, cgpId: string): Observable<any> {
      return this.http.post(this.url + 'cgp/updateCGPDescription/' + cgpId, formData);
    }

   updateCGPPracticalInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.post(this.url + 'cgp/practicalInfo/updateCGPPracticalInfo?cgpId=' + cgpId, formData);
    }

    updateCGPClientInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/clients/' + cgpId, formData);
    }

    updateCGPSpecialityInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/specialities/' + cgpId, formData);
    }

    updateCGPSubtopicInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/subtopics/' + cgpId, formData);
    }

    updateCGPTagInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/tags/' + cgpId, formData);
    }

    updateCGPPartnerInfoService(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/partners/' + cgpId, formData);
    }

    updateCGPStatus(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/statusUpdate/' + cgpId, formData);
    }

    updateCGPBannerImage(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/banner/' + cgpId, formData, { headers: { Anonymous: '' }});
    }

    updateCGPLogoImage(formData: any, cgpId: string): Observable<any> {
      return this.http.put(this.url + 'cgp/logo/' + cgpId, formData, { headers: { Anonymous: '' }});
    }

  getAllCustomer(): Observable<any> {
    return this.http.get(this.strurl + 'customers', { headers: { Anonymous: '' }});
   }

   getAllSpeciality(): Observable<any> {
    return this.http.get(this.strurl + 'specialties', { headers: { Anonymous: '' }});
   }

  getSpecialityByCgp(cgpId: any): Observable<any> {
    return this.http.get(this.url + 'cgp/specilityByCgp/' + cgpId, { headers: { Anonymous: '' }});
  }

   getAllPartner(): Observable<any> {
    return this.http.get(this.strurl + 'partners', { headers: { Anonymous: '' }});
   }

   getAllSubtopic(specilityId: any): Observable<any> {
    return this.http.get(this.url + 'cgp/subtopicsBySpeciality/' + specilityId, { headers: { Anonymous: '' }});
   }

   getAllTags(): Observable<any> {
    return this.http.get(this.strurl + 'tags', { headers: { Anonymous: '' }});
   }

  getTagsBySpeciality(specialityId: any): Observable<any> {
    return this.http.get(this.url + 'cgp/tagsBySpeciality/' + specialityId, { headers: { Anonymous: '' }});
  }

  teamEmailValidation(email: any, teamId: any): Observable<any> {
    if (teamId) {
      return this.http.get(this.url + 'cgp/team/emailValidate/' + email + '?id=' + teamId);
    } else {
      return this.http.get(this.url + 'cgp/team/emailValidate/' + email);
    }

  }

  emailValidate(email:any, role:any): Observable<any> {
    return this.http.get(this.url + 'auth/emailValidate/' + email + '/' + role);
  }

   createCGPTeamService(formData: any): Observable<any> {
    return this.http.post(this.url + 'cgp/team/create', formData, { headers: { Anonymous: '' }});
   }

   getAllContent(formData: any): Observable<any> {
    return this.http.get(this.strurl + 'articles?slug=' + formData, { headers: { Anonymous: '' }});
   }

   getUserInfomation(userid: string): Observable<any> {
    return this.http.get(this.url + 'users/profile/' + userid);
   }

  updateUserInfomation(formdata: any): Observable<any> {
    return this.http.post(this.url + 'users/profile/update', formdata);
  }

  updateUserPasswordInfomation(formdata: any, userId: any): Observable<any> {
    return this.http.put(this.url + 'auth/password/change/' + userId, formdata);
  }

  updateUserProfile(formdata: any, userId: any): Observable<any> {
    return this.http.put(this.url + 'users/profile/image/' + userId, formdata, { headers: { Anonymous: '' }});
  }

  addCGPArticle(formData: any): Observable<any> {
    return this.http.post(this.url + 'cgp/articles/create', formData);
  }

  addCGPArticleUpload(formData: any): Observable<any> {
    return this.http.post(this.url + 'cgp/articles/upload', formData, { headers: { Anonymous: '' }});
  }

  getCGPPublishedArticle(status: string, cgpId: string): Observable<any> {
    return this.http.get(this.url + 'cgp/articles/list/' + status + '?cgpId=' + cgpId, { headers: { Anonymous: '' }});
   }

   deleteCGPPublishedArticle(id: string): Observable<any> {
    return this.http.delete(this.url + 'cgp/articles/delete/' + id, { headers: { Anonymous: '' }});
   }

   getCGPArticleDetails(articleID: string, formdata: any): Observable<any> {
    return this.http.post(this.url + 'cgp/articles/details/' + articleID, formdata, { headers: { Anonymous: '' }});
   }

   updateCGPArticle(formdata: any, articleID: any): Observable<any> {
    return this.http.put(this.url + 'cgp/articles/update/' + articleID, formdata, { headers: { Anonymous: '' }});
  }

  getAllFaqs(): Observable<any> {
    return this.http.get(this.url + 'cgp/faqs/getAllFaqs');
  }

  getPrivacyPolicy(): Observable<any> {
    return this.http.get(this.url + 'cgp/privacyPolicy');
  }

  deleteCGPTeam(id: string): Observable<any> {
    return this.http.delete(this.url + 'cgp/team/delete/' + id, { headers: { Anonymous: '' }});
   }

   roleUpdate(id: string,formData: any, ): Observable<any> {
    return this.http.put(this.url + 'cgp/team/role/update/' + id, formData);
  }

  teamInvite(formData: any, ): Observable<any> {
    return this.http.post(this.url + 'cgp/teamInvite', formData);
  }

  teamJoin(formData: any, ): Observable<any> {
    return this.http.post(this.url + 'cgp/register/team', formData);
  }

  getSiret(email:string): Observable<any> {
    return this.http.get(this.url + 'cgp/siret/' + email);
  }
  
  getCGPAddressInfo(cgpId:string): Observable<any> {
    return this.http.get(this.url + 'cgp/getCGPAddressInfo/'+cgpId);
  }

}
