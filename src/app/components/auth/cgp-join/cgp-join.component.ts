import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgpService } from 'src/app/services/cgp.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import {MapsAPILoader  } from '@agm/core';
import { Router } from '@angular/router';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
  selector: 'app-cgp-join',
  templateUrl: './cgp-join.component.html',
  styleUrls: ['./cgp-join.component.scss']
})
export class CgpJoinComponent implements OnInit {
  @ViewChild('search_location', { static: false }) searchElementRef!: ElementRef;

  submitAttempt = false;
  form!: FormGroup;
  emailValidate = false;

  constructor(
    private formBuilder: FormBuilder,
    private cgpService: CgpService,
    private sweetAlertService: SweetAlertService,
    private apiloader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      establishmentName: ['', [Validators.required]],
      addressComplement: [''],
      addressType: [''],
      addressNumber: ['', Validators.required],
      addressStreet: ['', Validators.required],
      city: ['', Validators.required],
      country: ['France', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
      eSiret: ['', Validators.required],
      hOrias: ['', Validators.required],
      hCif: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      hCompanyRcsSiren: ['', Validators.required],
      hCoa: [''],
      designation:['', Validators.required],
      contactPersonEmail:['', [Validators.required, Validators.pattern(emailPattern)]]
    });
  }

  validateNumber(event: any) {
    const keyCode = event.keyCode;

    const excludedKeys = [8,9, 37, 39, 46];

    if (!((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      (excludedKeys.includes(keyCode)))) {
      event.preventDefault();
    }
  }

  keyDownAction(event: any) {
    if (event.keyCode === 13) {
      this.cgpRequest();
    }
  }

  cgpRequest() {
    this.submitAttempt = true;
    this.form.value.hCoa = !!(this.form.value.hCoa);
    this.form.value.hCif = !!(this.form.value.hCif);
    if (this.form.valid) {
      this.form.value.email = this.form.value.email.toLowerCase();
      const addresstype = (this.form.value.addressType) ? this.form.value.addressType + ' ' : '';
      const addresscom =  (this.form.value.addressComplement && this.form.value.addressComplement !== '0') ? '(' + this.form.value.addressComplement + ')' + ' ' : '';
      this.form.value.companyAddress = this.form.value.addressNumber + ', ' + addresstype + '' + this.form.value.addressStreet + ' ' + this.form.value.postalCode + ' ' + addresscom + this.form.value.city + ', ' + this.form.value.country;
      this.cgpService.cgpRequest(this.form.value).subscribe(res => {
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


  emailValidation(email: any): void {
    this.cgpService.emailValidate(email.value, 'USER').subscribe((response) => {
      this.emailValidate = response.status != '200';
    });

  }

}
