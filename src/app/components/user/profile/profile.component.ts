import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { SessionService } from '../../../services/session.service';
import { MustMatch } from '../../../helper/must-match.validator';
import { CgpService } from '../../../services/cgp.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  selectedFile: any;
  fileToUpload: any;
  imageUrl: any;
  userId: any;
  submitUserAttempt = false;
  submitPasswordAttempt = false;
  userProfileForm!: FormGroup;
  userPasswordForm!: FormGroup;
  url: string;
  gender: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService,
    private cgpService: CgpService,
    private sweetAlertService: SweetAlertService,
    public router: Router
  ) {
    this.initUserInformation();
    this.initUserPasswordInformation();
    this.url = 'assets/images/team-image-2.jpg';

  }

  ngOnInit(): void {
    if (JSON.parse(this.sessionService.getLocal('user')) !== null){
      this.userId = JSON.parse(this.sessionService.getLocal('user')).id;
      this.getProfile(this.userId);
    }
  }

  initUserInformation() {
    this.userProfileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender : ['', Validators.required],
      email : [{value: '', disabled: true}, Validators.required],
      userid: ''
    });
  }

  initUserPasswordInformation() {
    this.userPasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }

 getProfile(userId: any){
    this.userService.getUserInfomation(userId).subscribe((response) => {
        this.userProfileForm = this.formBuilder.group(response.data);
        this.gender = response.data.gender;
        this.url = response.data.profileImage ? response.data.profileImage : 'assets/images/team-image-2.jpg';
    }, (errors: any) => {
        console.log(errors);
    });
  }

  updateProfile(){
    this.submitUserAttempt = true;
    if (this.userProfileForm.valid) {
      this.userService.updateUserInfomation(this.userProfileForm.value).subscribe((response) => {
        this.submitUserAttempt = false;
        const title = 'PROFILE.prifle';
        const message = response.message;
        this.sweetAlertService.showSwalSuccess(title, message);
        const data = JSON.parse(this.sessionService.getLocal('user'));
        data.firstName = this.userProfileForm.value.firstName;
        data.lastName = this.userProfileForm.value.lastName;
        this.sessionService.setLocal('user', JSON.stringify(data));
        this.reloadComponent();
      },
      err => {
        const title = 'PROFILE.prifle';
        const message = 'SERVER-RESPONSE.' + err.message;
        this.sweetAlertService.showSwalError(title, message);
      });
   }
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    }

  updatePassword(){
    this.submitPasswordAttempt = true;
    if (this.userPasswordForm.valid) {
        this.userService.updateUserPasswordInfomation(this.userPasswordForm.value, this.userId).subscribe((response) => {
          this.submitPasswordAttempt = false;
          this.userPasswordForm.reset();
          const title = 'PROFILE.prifle';
          const message = 'SERVER-RESPONSE.' + response.message;
          this.sweetAlertService.showSwalSuccess(title, message);
        }, err => {
          const title = 'PROFILE.prifle';
          const message = 'SERVER-RESPONSE.' + err.message;
          this.sweetAlertService.showSwalError(title, message);
        });

   }
  }

  radioChange(event: any) {
    this.userProfileForm.patchValue({
      gender: event.value
    });
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 1) {
        alert('File size exceeds 1 MB');
        return;
      }
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      };
    }
  }

  onUpdateCGPImageInfo(){
    const uploadBanner = new FormData();
    uploadBanner.append('profileImage', this.selectedFile);
    this.cgpService.updateUserProfile(uploadBanner, this.userId).subscribe((response) => {
      const title = 'PROFILE.prifle';
      const message = 'SERVER-RESPONSE.' + '104100';
      this.sweetAlertService.showSwalSuccess(title, message);
    });
  }

}

