import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [AuthService, SessionService]

})
export class ForgotPasswordComponent implements OnInit {

  submitAttempt = false;
  form!: FormGroup;
  resetPasswordFormlag = { email : false}
  responseMessage = { message: '', flag: false, alertType: ''};

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
    });
  }

  onKeyEmailValidation(event: any) {
    this.resetPasswordFormlag.email = true;
  }


  keyDownAuthenticate(event: any) {
    if (event.keyCode === 13) {
      this.submit();
    }
  }

  submit() {
    this.submitAttempt = true;
    this.resetPasswordFormlag.email =true;
    if (this.form.valid) {
      this.form.value.email = this.form.value.email.toLowerCase();
      this.authService.sendEmailForgotPassword(this.form.value).subscribe(res => {
          this.form.reset();
          this.resetPasswordFormlag.email = false;
          this.responseAlert('alert-success',res.message);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 5000);
      },
      errors => {
          this.resetPasswordFormlag.email = false;
          this.responseAlert('alert-danger',errors.message);
      });
    }
  }

  responseAlert(alertType: string, messageCode: string){
    this.responseMessage.message = 'SERVER-RESPONSE.' + messageCode;
    this.responseMessage.flag = true;
    this.responseMessage.alertType = alertType;
    setTimeout(() => {
      this.responseMessage.message= ''; this.responseMessage.flag =false; this.responseMessage.alertType = '';
    }, 5000);
  }


}
