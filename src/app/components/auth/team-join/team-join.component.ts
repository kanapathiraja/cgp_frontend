import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgpService } from 'src/app/services/cgp.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { MustMatch } from '../../../helper/must-match.validator';
import { ActivatedRoute, Router } from '@angular/router';
var Buffer = require('buffer/').Buffer
import * as jwt_decode from 'jwt-decode';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
  selector: 'app-team-join',
  templateUrl: './team-join.component.html',
  styleUrls: ['./team-join.component.scss']
})
export class TeamJoinComponent implements OnInit {

  submitAttempt = false;
  form!: FormGroup;
  emailValidate = false;
  gender: any ='MALE';
  url: string;
  selectedFile: any;
  email: any;
  cgpId: any;

  constructor( private formBuilder: FormBuilder,
    private cgpService: CgpService,
    private sweetAlertService: SweetAlertService,

    public route: ActivatedRoute,
    private router: Router,) {
      this.url = 'assets/images/team-image-2.jpg';
    }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.queryParams;
    const params = atob(Object.keys(routeParams)[0])
    this.email = JSON.parse(params).email;
    this.cgpId = JSON.parse(params).cgpId;
    this.initForm();
  }


  initForm() {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      function: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      team_image:[''],
      gender: ['',Validators.required] }, {
        validator: MustMatch('password', 'confirm_password')
    });
  }


  teamJoin() {
    this.submitAttempt = true;
    let payload  = this.form.value;
    payload['email'] =  this.email;
    payload['cgpId'] = this.cgpId;
    payload['designation'] = 'test';
    payload['bannerImage'] =  this.selectedFile;
    if (this.form.valid) {
      this.cgpService.teamJoin(payload).subscribe(res => {
        this.form.reset();
        this.submitAttempt = false;
        const title = 'CGP-REGISTER.request';
        const message = 'SERVER-RESPONSE.' + res.message;
        this.sweetAlertService.showSwalSuccess(title, message);
        this.router.navigate(['/homepage']);
      },
        err => {
          const title = 'CGP-REGISTER.request';
          const message = 'SERVER-RESPONSE.' + err.message;
          this.sweetAlertService.showSwalError(title, message);
        });
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 1) {
        alert('File size exceeds 1 MB');
        return;
      }
      const image = event.target.files[0];

          this.selectedFile = new File([image], image.name);
          reader.readAsDataURL(image); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      };
    }
  }



  radioChange(event: any) {
    this.form.patchValue({
      gender: event.value
    });
  }



}
