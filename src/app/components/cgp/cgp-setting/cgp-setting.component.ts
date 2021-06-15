import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgpService } from '../../../services/cgp.service';
import { SessionService } from '../../../services/session.service';
import { MustMatch } from '../../../helper/must-match.validator';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { Router } from '@angular/router';
import { threadId } from 'node:worker_threads';


@Component({
  selector: 'app-cgp-setting',
  templateUrl: './cgp-setting.component.html',
  styleUrls: ['./cgp-setting.component.scss']
})
export class CgpSettingComponent implements OnInit {

  selectedFile: any;
  fileToUpload: any;
  imageUrl: any;
  userId: any;
  teamId: any;
  cgpId: any;
  submitUserAttempt = false;
  submitPasswordAttempt = false;
  userPasswordForm!: FormGroup;
  userProfileForm!: FormGroup;
  userAddressProfileForm!: FormGroup;
  url: string;
  gender: any;
  submitAddressAttempt: boolean = false;
  checkaddress: boolean = false;
  validateoldpass: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private cgpService: CgpService,
    private sessionService: SessionService,
    private sweetAlertService: SweetAlertService,
    public router: Router
  ) {
    this.initUserInformation();
    this.initUserPasswordInformation();
    this.initUserAddressInformation();
    this.url = 'assets/images/team-image-2.jpg';
  }

  ngOnInit(): void {
    if (JSON.parse(this.sessionService.getLocal('user')) !== null){
      this.userId = JSON.parse(this.sessionService.getLocal('user')).id;
      this.teamId = JSON.parse(this.sessionService.getLocal('user')).cgpTeams[0].id;
      this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
      this.getProfile();
    }
  }

  initUserInformation() {
    this.userProfileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender : ['', Validators.required],
      function : ['', Validators.required],
      email : [{value: '', disabled: true}, Validators.required],
      userid: ''
    });
  }

  initUserAddressInformation() {
    this.userAddressProfileForm = this.formBuilder.group({
      firstname: '',
      lastname: '',
      email: '',
      designation: '',
      description: '',
      addressComplement: [''],
      addressType: [''],
      addressNumber: ['', Validators.required],
      addressStreet: ['', Validators.required],
      city: ['', Validators.required],
      country: ['France', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
      cgpTeamInfoId: '',
      cgpId: ''
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

 getProfile(){
    this.cgpService.getUserInfomation(this.userId).subscribe((response) => {
      this.userProfileForm.setValue({
        firstName: response.data.firstName,
        function: response.data.function,
        lastName: response.data.lastName,
        email: response.data.email,
        gender: response.data.gender,
        userid: response.data.id,
      });
        this.gender = response.data.gender;
        this.url = response.data.profileImage ? response.data.profileImage : 'assets/images/team-image-2.jpg';
    }, (errors: any) => {
        console.log(errors);
    });

    this.cgpService.getCGPTeamInfomation(this.teamId,this.cgpId).subscribe((response) => {
      const cgpTeamData = {
        cgpTeamInfoId: response.data.id,
        cgp: this.cgpId,
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        email: response.data.email,
        designation: response.data.designation,
        description: response.data.description !== 'null' ? response.data.description : '',
        addressComplement: response.data.addressComplement !== 'null' ? response.data.addressComplement : '',
        addressType: response.data.addressType !== 'null' ? response.data.addressType : '',
        addressNumber: response.data.addressNumber,
        addressStreet: response.data.addressStreet,
        city: response.data.city,
        country: response.data.country,
        postalCode: response.data.postalCode,
      };
      if(!response.data.city){
        this.userAddressProfileForm.controls.addressComplement.disable();
        this.userAddressProfileForm.controls.addressType.disable();
        this.userAddressProfileForm.controls.addressNumber.disable();
        this.userAddressProfileForm.controls.addressStreet.disable();
        this.userAddressProfileForm.controls.city.disable();
        this.userAddressProfileForm.controls.country.disable();
        this.userAddressProfileForm.controls.postalCode.disable();
        this.checkaddress = true;
        
        this.cgpService.getCGPAddressInfo(this.cgpId).subscribe((response) => {
          const cgpTeamData = {
            addressComplement: response.data.addressComplement !== 'null' ? response.data.addressComplement : '',
            addressType: response.data.addressType !== 'null' ? response.data.addressType : '',
            addressNumber: response.data.addressNumber,
            addressStreet: response.data.addressStreet,
            city: response.data.city,
            country: response.data.country,
            postalCode: response.data.postalCode,
          }
          this.userAddressProfileForm = this.formBuilder.group(cgpTeamData);
         
        }, (errors: any) => {
            console.log(errors);
        });

      }
      this.userAddressProfileForm = this.formBuilder.group(cgpTeamData);
     
    }, (errors: any) => {
        console.log(errors);
    });

    


  }

  updateProfile(){
    this.submitUserAttempt = true;
    if (this.userProfileForm.valid) {
    this.cgpService.updateUserInfomation(this.userProfileForm.value).subscribe((response) => {
        this.submitUserAttempt = false;
        // this.updateProfileAddress();
        const title = 'PROFILE.prifle';
        const message = 'SERVER-RESPONSE.' + '104100';
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
   
    if (this.userPasswordForm.valid && !this.validateoldpass) {
        this.cgpService.updateUserPasswordInfomation(this.userPasswordForm.value, this.userId).subscribe((response) => {
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

  updateAddress(){
    this.submitAddressAttempt = true;
    console.log(this.userAddressProfileForm.value)
    if (this.userAddressProfileForm.valid) {
      const cgpTeamvalues = new FormData();
      cgpTeamvalues.append('cgpId', this.cgpId);
      cgpTeamvalues.append('firstname', this.userAddressProfileForm.value.firstname);
      cgpTeamvalues.append('lastname', this.userAddressProfileForm.value.lastname);
      cgpTeamvalues.append('email', this.userAddressProfileForm.value.email);
      cgpTeamvalues.append('designation', this.userAddressProfileForm.value.designation);
      cgpTeamvalues.append('description', this.userAddressProfileForm.value.description);
      cgpTeamvalues.append('addressComplement', this.userAddressProfileForm.value.addressComplement);
      cgpTeamvalues.append('addressType', this.userAddressProfileForm.value.addressType);
      cgpTeamvalues.append('addressNumber', this.userAddressProfileForm.value.addressNumber);
      cgpTeamvalues.append('addressStreet',this.userAddressProfileForm.value.addressStreet);
      cgpTeamvalues.append('city', this.userAddressProfileForm.value.city);
      cgpTeamvalues.append('country', this.userAddressProfileForm.value.country);
      cgpTeamvalues.append('postalCode', this.userAddressProfileForm.value.postalCode);
  
      const addresstype = (this.userAddressProfileForm.value.addressType) ? this.userAddressProfileForm.value.addressType + ' ' : '';
      const addresscom =  (this.userAddressProfileForm.value.addressComplement && this.userAddressProfileForm.value.addressComplement !== '0') ? '(' + this.userAddressProfileForm.value.addressComplement + ')' + ' ' : '';
  
      this.userAddressProfileForm.value.address = this.userAddressProfileForm.value.addressNumber + ', ' + addresstype + '' + this.userAddressProfileForm.value.addressStreet + ' ' + this.userAddressProfileForm.value.postalCode + ' ' + addresscom + this.userAddressProfileForm.value.city + ', ' + this.userAddressProfileForm.value.country;
  
      cgpTeamvalues.append('address', this.userAddressProfileForm.value.address);

      this.cgpService.updateCGPTeamService(cgpTeamvalues, this.userAddressProfileForm.value.cgpTeamInfoId).subscribe((response) => {

        this.submitAddressAttempt = false;
        const title = 'PROFILE.prifle';
        const message = 'SERVER-RESPONSE.' + '104100';
        this.sweetAlertService.showSwalSuccess(title, message);
      }, err => {
        const title = 'PROFILE.prifle';
        const message = 'SERVER-RESPONSE.' + err.message;
        this.sweetAlertService.showSwalError(title, message);
      });
   }
  }

  // updateProfileAddress(){
  //     const cgpTeamvalues = new FormData();
  //     cgpTeamvalues.append('cgpId', this.cgpId);
  //     cgpTeamvalues.append('firstname', this.userProfileForm.value.firstName);
  //     cgpTeamvalues.append('lastname', this.userProfileForm.value.lastName);
  //     cgpTeamvalues.append('email', this.userAddressProfileForm.value.email);
  //     cgpTeamvalues.append('designation', this.userProfileForm.value.function);
  //     cgpTeamvalues.append('description', this.userAddressProfileForm.value.description);
  //     cgpTeamvalues.append('addressComplement', (this.userAddressProfileForm.value.addressComplement)?this.userAddressProfileForm.value.addressComplement:'');
  //     cgpTeamvalues.append('addressType', (this.userAddressProfileForm.value.addressType)?this.userAddressProfileForm.value.addressType:'');
  //     cgpTeamvalues.append('addressNumber', (this.userAddressProfileForm.value.addressNumber)?this.userAddressProfileForm.value.addressNumber:'');
  //     cgpTeamvalues.append('addressStreet',(this.userAddressProfileForm.value.addressStreet)?this.userAddressProfileForm.value.addressStreet:'');
  //     cgpTeamvalues.append('city', (this.userAddressProfileForm.value.city)?this.userAddressProfileForm.value.city:'');
  //     cgpTeamvalues.append('country', (this.userAddressProfileForm.value.country)?this.userAddressProfileForm.value.country:'');
  //     cgpTeamvalues.append('postalCode', (this.userAddressProfileForm.value.postalCode)?this.userAddressProfileForm.value.postalCode:'');
  
  //     const addresstype = (this.userAddressProfileForm.value.addressType) ? this.userAddressProfileForm.value.addressType + ' ' : '';
  //     const addresscom =  (this.userAddressProfileForm.value.addressComplement && this.userAddressProfileForm.value.addressComplement !== '0') ? '(' + this.userAddressProfileForm.value.addressComplement + ')' + ' ' : '';
  
  //     this.userAddressProfileForm.value.address = this.userAddressProfileForm.value.addressNumber + ', ' + addresstype + '' + this.userAddressProfileForm.value.addressStreet + ' ' + this.userAddressProfileForm.value.postalCode + ' ' + addresscom + this.userAddressProfileForm.value.city + ', ' + this.userAddressProfileForm.value.country;
  
  //     cgpTeamvalues.append('address', this.userAddressProfileForm.value.address);
  //     console.log(this.userAddressProfileForm.value)
  //     this.cgpService.updateCGPTeamService(cgpTeamvalues, this.userAddressProfileForm.value.cgpTeamInfoId).subscribe((response) => {

  //     }, err => {
  //       const title = 'PROFILE.prifle';
  //       const message = 'SERVER-RESPONSE.' + err.message;
  //       this.sweetAlertService.showSwalError(title, message);
  //     });
   
  // }

  validateNumber(event: any) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46];

    if (!((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      (excludedKeys.includes(keyCode)))) {
      event.preventDefault();
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

  changeAddress(event:any){
    if(event.target.checked == true){
      this.userAddressProfileForm.controls.addressComplement.disable();
      this.userAddressProfileForm.controls.addressType.disable();
      this.userAddressProfileForm.controls.addressNumber.disable();
      this.userAddressProfileForm.controls.addressStreet.disable();
      this.userAddressProfileForm.controls.city.disable();
      this.userAddressProfileForm.controls.country.disable();
      this.userAddressProfileForm.controls.postalCode.disable();
      this.cgpService.getCGPAddressInfo(this.cgpId).subscribe((response) => {
        const cgpTeamData = {
          addressComplement: response.data.addressComplement !== 'null' ? response.data.addressComplement : '',
          addressType: response.data.addressType !== 'null' ? response.data.addressType : '',
          addressNumber: response.data.addressNumber,
          addressStreet: response.data.addressStreet,
          city: response.data.city,
          country: response.data.country,
          postalCode: response.data.postalCode,
        }
        this.userAddressProfileForm = this.formBuilder.group(cgpTeamData);
       
      }, (errors: any) => {
          console.log(errors);
      });
        this.checkaddress = true;
    }else{
      this.userAddressProfileForm.controls.addressComplement.enable();
      this.userAddressProfileForm.controls.addressType.enable();
      this.userAddressProfileForm.controls.addressNumber.enable();
      this.userAddressProfileForm.controls.addressStreet.enable();
      this.userAddressProfileForm.controls.city.enable();
      this.userAddressProfileForm.controls.country.enable();
      this.userAddressProfileForm.controls.postalCode.enable();
      this.userAddressProfileForm.patchValue({
        "addressComplement" : '',
        "addressType" : '',
        "addressNumber" : '',
        "addressStreet" : '',
        "city" : '',
        "country" : '',
        "postalCode" : ''});
      this.checkaddress = false;
    }
  }


  checkOldPass(event:any){
    if(event.target.value == this.userPasswordForm.value.oldPassword){
      this.validateoldpass = true;
      console.log(this.validateoldpass)
    }else{
      this.validateoldpass = false;
    }
  }



}

