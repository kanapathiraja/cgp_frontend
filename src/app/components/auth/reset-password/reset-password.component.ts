import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { MustMatch } from '../../../helper/must-match.validator';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  submitAttempt = false;
  form!: FormGroup;
  formFlag = {  password : false, confirmPassword: false };
  responseMessage = { message: '', flag: false, alertType: ''};
  userId!: string;
  token!: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe( params => {
      this.token = params.token;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.checkTokenValid();
  }

  initForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }

  checkTokenValid() {
    this.authService.checkIfTokenValid(this.token).subscribe((res: any) => {
    },
      (err: any) => {
      });
}


  keyDownAuthenticate(event: any) {
    if (event.keyCode === 13) {
    }
  }

  responseAlert(alertType: string, messageCode: string){
    this.responseMessage.message = 'SERVER-RESPONSE.'+messageCode;
    this.responseMessage.flag = true;
    this.responseMessage.alertType = alertType;
    setTimeout(() => {
      this.responseMessage.message= ''; this.responseMessage.flag =false; this.responseMessage.alertType = '';
    }, 5000);
  }

  submit() {
    this.registerValidationFlag(true);
    if (this.form.valid) {
      this.authService.resetPassword(this.form.value, this.token).subscribe(res => {
          this.router.navigate(['/auth/login']);
      },
        errors => {
          console.log(errors);
          this.registerValidationFlag(false);
        });
    }
  }

  registerValidationFlag(flag: boolean){
    this.submitAttempt = flag;
    this.formFlag.password = flag;
    this.formFlag.confirmPassword = flag;
  }

  roleBasedNavigate(response: any){
    if (response.data.role === 'USERS'){
      this.router.navigate(['/homepage']);
    }else if (response.data.role === 'ADMIN'){
      this.router.navigate(['/cgp/setting']);
    }else if (response.data.role === 'CGP'){
      this.router.navigate(['/cgp/profile']);
    }
  }

}
