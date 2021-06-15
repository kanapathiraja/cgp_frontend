import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/helper/must-match.validator';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-cgp-init-password',
  templateUrl: './cgp-init-password.component.html',
  styleUrls: ['./cgp-init-password.component.scss']
})
export class CgpInitPasswordComponent implements OnInit {

  submitAttempt = false;
  form!: FormGroup;
  userId!: string;
  companyName!: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute

  ) {

    this.route.queryParams.subscribe( params => {
    this.userId = params.id;
     });
  }

  ngOnInit(): void {
    this.initForm();
    this.checkPasswordFlag();
  }

  initForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }


  keyDownAuthenticate(event: any) {
    if (event.keyCode === 13) {
    }
  }

  checkPasswordFlag() {
      this.authService.checkIfPasswordUpdated(this.userId).subscribe((res: any) => {
          if (res.data.passwordFlag === 1) {
              this.router.navigate(['/auth/login']);
          }
          this.companyName = res.data.companyName;
      },
        (err: any) => {
        console.log('file: reset-password.component.ts - line 73 - ResetPasswordComponent - err', err);

        });


  }

  submit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.authService.setPassword(this.form.value, this.userId).subscribe(res => {
          this.setLocalStorage(res.data.data, res.data.token);
          this.roleBasedNavigate(res.data);
      },
        errors => {
          console.log(errors);
          this.submitAttempt = false;
        });
    }

  }


  setLocalStorage(user: any, token: string) {
    this.sessionService.setLocal('access_token', token);
    this.sessionService.setLocal('user', JSON.stringify(user));
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
