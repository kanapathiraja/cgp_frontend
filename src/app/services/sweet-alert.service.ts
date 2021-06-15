import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor(
    private router: Router,
    private translateService: TranslateService) { }

  showSwalSuccessWithNavigation(title: string, message: string, showConfirmButton: boolean, navigateUrl?: string)  {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    Swal.fire({
      title,
      html: message,
      showConfirmButton,
      timer: 5000,
      allowOutsideClick: false,
      showCloseButton: true
     }).then(() => {
      this.router.navigate([navigateUrl]);
    });
    Swal.showLoading();
  }


  showSwalSuccess(title: string, message: string, showConfirmButton?: boolean)  {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    Swal.fire({
      title,
      icon: 'success',
      html: message,
      showConfirmButton,
      allowOutsideClick: true,
      showCloseButton: true,
      timer: 3000
     });
  }

  async showSwalError(title: string, message: string, showConfirmButton?: boolean)  {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    Swal.fire({
      title,
      icon: 'error',
      html: message,
      showConfirmButton,
      allowOutsideClick: true,
      showCloseButton: true,
      timer: 2000
     });
  }

  async showSwalErrorWithNavigation(title: string, message: string, navigateUrl?: string)  {
    title = this.translateService.instant(title);
    message = this.translateService.instant(message);
    Swal.fire({
      title,
      icon: 'error',
      html: message,
      showConfirmButton: false,
      allowOutsideClick: true,
      showCloseButton: true,
      timer: 2000
     }).then(() => {
      this.router.navigate([navigateUrl]);
    });
  }

}
