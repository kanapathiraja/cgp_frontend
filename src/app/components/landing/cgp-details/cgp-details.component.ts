import { Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {CgpService} from '../../../services/cgp.service';
import {SessionService} from '../../../services/session.service';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
} from 'swiper/core';
import {StrapiService} from '../../../services/strapi.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {MapsAPILoader} from '@agm/core';

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-cgp-details',
  templateUrl: './cgp-details.component.html',
  styleUrls: ['./cgp-details.component.scss']
})
export class CgpDetailsComponent implements OnInit {
  @ViewChild('myModalCloseCGPLocation') modalLocationClose: any;
  @ViewChild('search_location', { static: false }) searchElementRef!: ElementRef;

  cgpCustomerData: any[] = [];
  cgpSpecialityData: any[] = [];
  cgpPartnerData: any[] = [];

  // view Data init
  viewCGPInfoDetails: any;
  viewCGPTeamInfoDetails: any [] = [];
  viewCGPCustomerInfoDetails: any = [];
  viewCGPPracticalInfoDetails: any = [];
  viewCGPSpecialitiesDetails: any = [];
  viewCGPPartnersDetails: any = [];
  viewCGPSubtopicDetails: any = [];
  viewCGPTagDetails: any = [];

  cgpId: any;
  email: any;
  url: any;
  teamurl: any;
  img_url: any;
  startPage = 0;
  paginationLimit = 4;
  public articlesList: any[] = [];
  website: any;
  address: any;
  public cgpList: any[] = [];
  zoom = 10;
  longitude = 0;
  latitude = 0;
  labelOptions: any;
  icon: any;
  public name: any;
  user: any;
  step1:boolean =true;
  step2:boolean =false;
  step3:boolean =false;
  step4:boolean =false;
  selectedTeam = ''
  closeModel = 'Model'
  selectedFa: any;
  search_clear: any;
  value = 45;


  constructor(private cgpService: CgpService,
              private sessionService: SessionService,
              private route: ActivatedRoute,
              private strapiService: StrapiService,
              public ngxLoader: NgxUiLoaderService,
              public router: Router,
              private apiloader: MapsAPILoader, private ngZone: NgZone,) {
    this.route.params.subscribe(params => {
      this.name = params.name;
      this.address = JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).address : '';
      if (!this.address) {
        this.getLocation();
      } else {
        this.getInitialCGPInformation(this.name);
      }
    });
    window.scroll(0, 0);

    this.getAllCustomer();
    this.getAllSpeciality();
    this.getAllPartner();
    this.teamurl = 'assets/images/cgp-header.png';

    this.img_url = environment.IMG_URL;

  }

  ngOnInit(): void {
    this.apiLoader();
    this.user = JSON.parse(localStorage.getItem('user')!);
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
          this.getInitialCGPInformation(this.name);

        } else {
          console.log('Not found');
        }
      });
    });
  }

  async getAllCustomer(){
    this.cgpService.getAllCustomer().subscribe((response) => {
      if (response !== null && response.length > 0){
        this.cgpCustomerData = response;
      }
    }, errors => {
      this.cgpCustomerData = [];
    });
  }

  async getAllSpeciality(){
    this.cgpService.getAllSpeciality().subscribe((response) => {
      if (response !== null && response.length > 0){
        this.cgpSpecialityData = response;
      }
    }, errors => {
      this.cgpSpecialityData = [];
    });
  }

  async getAllPartner(){
    this.cgpService.getAllPartner().subscribe((response) => {
      if (response !== null && response.length > 0){
        this.cgpPartnerData = response;
      }
    }, errors => {
      this.cgpPartnerData = [];
    });
  }


  getInitialCGPInformation(name: string): void {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: 0
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.cgpService.getCGPInformation(name, data).subscribe((response) => {

      if (response.data !== null){
        this.cgpId = response.data.id;
        this.getArticlesList('all');
        this.viewCGPInfoDetails = response.data;
        this.validateAddress(this.viewCGPInfoDetails['geoLocation'].coordinates);
        this.latitude = this.viewCGPInfoDetails['geoLocation'].coordinates[0];
        this.longitude = this.viewCGPInfoDetails['geoLocation'].coordinates[1];
        this.viewCGPPracticalInfoDetails = response.data.cgpPracticalInfo;
        this.viewCGPTeamInfoDetails = response.data.cgpTeams;
        this.viewCGPSpecialitiesDetails  = response.data.cgpSpecialities;
        this.viewCGPSubtopicDetails  = response.data.cgpSubtopics;
        this.viewCGPTagDetails  = response.data.cgpTags;

        if(response.data.website){
          if(response.data.website.substring(0,4).toLowerCase() == 'http' || response.data.website.substring(0,4).toLowerCase() == 'https')
          {
            this.website = response.data.website;
          } else{
            this.website = '//'+response.data.website;
          }
        }

        // Customer details View
        this.viewCGPCustomerInfoDetails  = this.cgpCustomerData.filter(function(arrayEl){
          return response.data.cgpClients.filter(function(anotherOneEl: { clientId: any; }){
            return anotherOneEl.clientId == arrayEl.id;
          }).length == 1;
        });

        // Partner details View
        this.viewCGPPartnersDetails  = this.cgpPartnerData.filter(function(arrayEl){
          return response.data.cgpPartners.filter(function(anotherOneEl: { partnerId: any; }){
            return anotherOneEl.partnerId == arrayEl.id;
          }).length == 1;
        });

        this.url = response.data.bannerImage;

        this.labelOptions = {
          color: '#CC0000',
          fontFamily: '',
          fontSize: '12px',
          fontWeight: 'bold',
          text: this.viewCGPInfoDetails['establishmentName'],
          }
       this.icon = {
        labelOrigin: { x: 16, y: 47 },
        url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"
      }

      }
      this.ngxLoader.stopLoader('loader-cgp');
    }, errors => {
    });
  }

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 4;
  }

  showLessItems() {
    this.paginationLimit = Number(this.paginationLimit) - 4;
  }
  controlledSwiper: any;
  setControlledSwiper(swiper: any) {
    this.controlledSwiper = swiper;
  }
  breakpoints = {
    500: { slidesPerView: 4, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 40 },
    1024: { slidesPerView: 4, spaceBetween: 50 }
  };

  slides = Array.from({ length: 1000 }).map(
    (el, index) => `Slide ${index + 1}`
  );


  getArticlesList(type: string) {
    this.articlesList = [];
    this.strapiService.cgpArticles(this.cgpId, 8, type).subscribe((res: any) => {
        this.articlesList = res.data;
      },
      (err: any) => {
      });
  }

  validateAddress(value: any){
    const data = {
      latitude: value[0],
      longitude: value[1],
      distance: 45
    };
    this.strapiService.otherCGPList(data, this.cgpId).subscribe((res: any) => {
        this.cgpList = res.data.slice(0, 4);
      },
      (err: any) => {
      });
  }

  specialtyRedirect(type: string, value: string, search: string) {
    this.router.navigate(['landing/' + type + '/' + value + '/' + search]);
    this.cgpService.categoruCGP.next('search');
  }

  tagsRedirect(type: string, value: string) {
    this.router.navigate(['landing/' + type + '/' + value]);
  }

  clickedMarker(){
    window.open('https://www.google.com/maps/search/?api=1&query='+this.latitude+','+this.longitude, "_blank");
  }

    onChange(step:any){
    if(step == 'step1'){
      this.step2 = true;
    }else if(step == 'step2'){
      this.step3 = true;
    }
  }


  clodeModel() {
    this.closeModel = 'modal'
  }

  onSelectFa(event: any){
    this.selectedTeam = event.target.value;
    this.closeModel = 'modal'
  }

  navigateToChat() {
    this.sessionService.setLocal('teamUserId', this.selectedTeam);
    this.router.navigate(['user/message']);
  }
  gotoURL(url:any){
    window.open(url, '_system');
  }

  validateSearchAddress(){
    this.latitude = this.latitude ? this.latitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lat : 49.611622);
    this.longitude = this.longitude ? this.longitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lon : 6.131935);
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.value
    };
    this.sessionService.setLocal('location', JSON.stringify({address: this.address, lat: this.latitude, lon: this.longitude}));
    this.getInitialCGPInformation(this.name);
    this.modalLocationClose.nativeElement.click();
    this.search_clear = '';
  }

  apiLoader(){
    this.apiloader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.address = place.formatted_address;
          });
        });
      });
  }


}
