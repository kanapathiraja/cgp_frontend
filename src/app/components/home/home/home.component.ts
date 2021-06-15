import {Component, OnInit, Renderer2} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { StrapiService } from 'src/app/services/strapi.service';
import { Options } from 'ng5-slider';
import {MapsAPILoader  } from '@agm/core';
import {CgpService} from '../../../services/cgp.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  value = 45;
  form!: FormGroup;
  specialities: any = [];
  autoUpdate: any = [];
  mostViewArticles: any;
  CgpListUpdate = false;
  latitude: any;
  longitude: any;
  cgpList: any[] = [];
  address: any;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private strapiService: StrapiService,
    private apiloader: MapsAPILoader,
    private cgpService: CgpService,
    private renderer: Renderer2,
    public ngxLoader: NgxUiLoaderService
  ) {
    this.renderer.addClass(document.body, 'cgp-list-grid-sec');
  }

  ngOnInit(): void {
    this.initForm();
    this.getSpecialties();
    this.mostViewed();
    this.address = JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).address : '';
    if (!this.address){
    this.getLocation();
    }else {
      this.nearbyCgpList();
    }
  }

  getSpecialties() {
    this.strapiService.getSpecialties('').subscribe((res: any) => {
      this.specialities = res.data;
    },
    (err: any) => {
    });
  }

  nearbyCgpList() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: this.value
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.nearbyCgpList(data).subscribe((res: any) => {
        this.ngxLoader.stopLoader('loader-cgp');
        this.cgpList = res.data.slice(0, 12);
        this.CgpListUpdate = true;

      },
      (err: any) => {
      });
  }

  getlistforAutocomplete() {
    if (this.form.value.searchKey) {
      this.strapiService.getSpecialties(this.form.value.searchKey).subscribe((data: any) => {
        if (data.status === '201') {
          this.autoUpdate = data.data;
          // data.data.filter((list: {specialtyName: any}) => {
          //   list.specialtyName.toLowerCase().indexOf(this.form.value.searchKey.toLowerCase()) !== -1 ? this.autoUpdate.push(list.specialtyName) : '';
          // });
        } else {
          this.autoUpdate = [];
        }
      });
    }
  }

     initForm() {
      this.form = this.formBuilder.group({
        searchKey: ['', [Validators.required]]
      });
    }

     searchCgp(type: string, value: string) {
       if (value) {
         this.form.value.searchKey = value;
       }
       this.router.navigate(['landing/' + type + '/' + this.form.value.searchKey]);
     }

  searchCategory(type: string, value: string, search: string) {
    this.router.navigate(['landing/' + type + '/' + value + '/' + search]);
    this.cgpService.categoruCGP.next('search');
  }


     keyDownAuthenticate(event: any) {
      if (event.keyCode === 13) {
        this.searchCgp('listing', '');
      }
    }

  valueUpdate(option: any) {
    const data = this.autoUpdate;
    this.autoUpdate = [];
    data.filter((list: any) => {
      list.toLowerCase().indexOf(option.toLowerCase()) !== -1 ? this.autoUpdate.push(list) : '';
    });
  }

  mostViewed() {
    this.strapiService.mostRecentArticles('mostview', 8).subscribe((res: any) => {
        this.mostViewArticles = res.data;
      },
      (err: any) => {
      });
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
         this.longitude = position.coords.longitude;
         this.latitude = position.coords.latitude;
         this.setLocation(this.longitude, this.latitude);
        }, () => {
          this.longitude = 6.131935;
          this.latitude = 49.611622;
          this.setLocation(this.longitude, this.latitude);
        }, {timeout: 10000});
    }
  }

  setLocation(longitude: any, latitude: any){
    this.apiloader.load().then(() => {
      const geocoder = new google.maps.Geocoder;
      const latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({location: latlng}, (results: any) => {
          if (results[0]) {
            this.sessionService.setLocal('cur_location', JSON.stringify({address: results[0].formatted_address, lat: latitude, lon: longitude}));
            this.sessionService.setLocal('location', JSON.stringify({address: results[0].formatted_address, lat: latitude, lon: longitude}));
            this.nearbyCgpList();
          } else {
            console.log('Not found');
          }
      });
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cgp-list-grid-sec');
  }
}
