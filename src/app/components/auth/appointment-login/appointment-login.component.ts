import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { MustMatch } from '../../../helper/must-match.validator';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
  selector: 'app-appointment-login',
  templateUrl: './appointment-login.component.html',
  styleUrls: ['./appointment-login.component.scss'],
  providers: [AuthService, SessionService]
})
export class AppointmentLoginComponent implements OnInit {

  submitAttempt = false;
  form!: FormGroup;
  signupForm!: FormGroup;
  authUser: any;
  submitSignupAttempt = false;
  responseMessage = { message: '', flag: false, alertType: ''};
  activeTab = 'SIGNIN';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private sweetAlertService: SweetAlertService
    ) {
  }

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/'])
    } else {
      this.initForm();
      this.initSignupForm();
    }

  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', Validators.required]
    });
  }

  initSignupForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirm_password')
  });
  }

  keyDownAuthenticate(event: any) {
    if (event.keyCode === 13) {
      this.authenticate();
    }
  }

  keyDownRegister(event: any) {
    if (event.keyCode === 13) {
      this.register();
    }
  }

  tabChange(type: string): void {
    this.submitAttempt = (type !== 'SIGNIN');
    this.submitSignupAttempt = (type !== 'SIGNUP');
    this.activeTab = type;
  }

  authenticate() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.form.value.email = this.form.value.email.toLowerCase();
      this.authService.authenticate(this.form.value).subscribe(res => {

          this.setLocalStorage(res.data, res.token);
          if(res.data.passwordFlag === 0 && res.data.role === 'CGP'){
            this.router.navigate(['/auth/password/change']);
          } else{
            this.roleBasedNavigate(res);
          }

      },
        err => {
          const title = 'LOGIN.login';
          const message = 'SERVER-RESPONSE.' + err.message;
          this.sweetAlertService.showSwalError(title, message);
        });
    }

  }

  register() {
    this.registerValidationFlag(true);
    if (this.signupForm.valid) {
      this.signupForm.value.email = this.signupForm.value.email.toLowerCase();
      this.authService.register(this.signupForm.value).subscribe(res => {
          this.signupForm.reset();
          this.registerValidationFlag(false);
          const title = 'LOGIN.register';
          const message = 'SERVER-RESPONSE.' + res.message;
          this.sweetAlertService.showSwalSuccess(title, message);
          this.tabChange('SIGNIN');
      },
        err => {
          this.registerValidationFlag(false);
          const title = 'LOGIN.register';
          const message = 'SERVER-RESPONSE.' + err.message;
          this.sweetAlertService.showSwalError(title, message);
        });
    }

  }


  setLocalStorage(user: any, token: string) {
    this.sessionService.setLocal('access_token', token);
    this.sessionService.setLocal('user', JSON.stringify(user));
  }

  registerValidationFlag(flag: boolean){
    this.submitSignupAttempt = flag;
  }

  roleBasedNavigate(response: any){
    if(response.data.role === 'USER'){
      this.router.navigate(['/homepage']);
    } else if (response.data.role === 'ADMIN'){
      this.router.navigate(['/cgp/setting']);
    }else if (response.data.role === 'CGP'){
      this.router.navigate(['/cgp/profile']);
    }
  }


}
