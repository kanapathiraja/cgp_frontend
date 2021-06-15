import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {StrapiService} from '../../../services/strapi.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CgpService } from '../../../services/cgp.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit {

  user: any;
  public autoUpdate: any = [];
  form!: FormGroup;
  cgpSiretList: any = [];
  selectedCGP: any;
  disableCgp:boolean = false;
  landing: boolean = false;
  hidelogin: boolean = false;
  hidePrivacyLogin: boolean = false;

  constructor(
    private router: Router,
    private strapiService: StrapiService,
    private formBuilder: FormBuilder, private cgpService: CgpService, private sessionService: SessionService,) { }

  ngOnInit() {
    this.initForm();
    this.user = JSON.parse(localStorage.getItem('user')!);
    if(this.user){
       this.selectedCGP = this.user.cgpId;
       this.getSiret();
    }
    const currentUrl = this.router.url;
    if(currentUrl == "/auth/login"){
      this.hidelogin = true;
    }else{
      this.hidelogin = false;
    }
    if(currentUrl == "/privacy-policy"){
      this.hidePrivacyLogin = true;
    }else{
      this.hidePrivacyLogin = false;
    }
  }

  logout(): void {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      this.router.navigate(['/auth/login']);
  }
  

  
  initForm() {
    this.form = this.formBuilder.group({
      searchKey: ['', [Validators.required]]
    });
  }

  getlistforAutocomplete() {
    if (this.form.value.searchKey) {
      this.strapiService.getSpecialties(this.form.value.searchKey).subscribe((data: any) => {
        if (data.status === '201') {
          this.autoUpdate = data.data;
        } else {
          this.autoUpdate = [];
        }
      });
    }
  }

  // value update function
  valueUpdate(option: any) {
    let data = this.autoUpdate;
    this.autoUpdate = [];
    data.filter((list: any) => {
      list.toLowerCase().indexOf(option.toLowerCase()) !== -1 ? this.autoUpdate.push(list) : '';
    });
  }

  // enter update search
  keyDownAuthenticate(event: any) {
    if (event.keyCode === 13) {
      this.searchCgp('listing', '');
    }
  }

  // search function
  searchCgp(type: string, value: string) {
    if (value) {
      this.form.value.searchKey = value;
    }
    this.strapiService.cgpSearch.next();
    this.router.navigate(['landing/' + type + '/' + this.form.value.searchKey]);
  }

  getSiret(){
    this.cgpService.getSiret(this.user.email).subscribe((response) => {
      if (response.data != null && response.data.length > 0){
        this.cgpSiretList = response.data;
        if(response.data.length==1){
          this.disableCgp = true;
        }else{
          this.disableCgp = false;
        }
      }
    }, errors => {
      this.cgpSiretList = [];
      console.log(errors);
    });
  }

  changeSiret(event:any){
    console.log(event)
    const data = JSON.parse(this.sessionService.getLocal('user'));
    data.cgpId = event.id;
    data.teamId = event.cgpTeams[0].id;
    if(event.cgpTeams[0].role=='ADMIN'){
      data.role = 'CGP';
    }
    // data.role = 'USER'
    this.sessionService.setLocal('user', JSON.stringify(data));
    this.reloadComponent();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

}
