import {Component, Input, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import { LabelType, Options } from 'ng5-slider';
import { StrapiService } from 'src/app/services/strapi.service';
import {MapsAPILoader  } from '@agm/core';
import { SessionService } from 'src/app/services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';


@Component({
  selector: 'app-cgp-grid',
  templateUrl: './cgp-grid.component.html',
  styleUrls: ['./cgp-grid.component.scss']
})
export class CgpGridComponent implements OnInit {
  @ViewChild('myModalCloseCGPDistance') modalClose: any;
  @ViewChild('myModalCloseCGPLocation') modalLocationClose: any;
  @ViewChild('myModalCloseCGPAvailability') modalAvailabilityClose: any;
  @ViewChild('search_location', { static: false }) searchElementRef!: ElementRef;
  @Input() cgpList: any[] = [];
  @Input() search: any;
  @Input() subSpeciality: any;
  @Input() speciality: any;
  @Input() type: any;
  @Input() updateExpert: any;
  selectedType = '';
  selectedDay = '';
  selectedTime: any;

  value = 45;
  options: Options = {
    floor: 1,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value + '<b>Km</b>';
        case LabelType.High:
          return value + '<b>Km</b>';
        default:
          return value + '<b>Km</b>';
      }
    }
  };
  address: any;
  latitude: any;
  longitude: any;
  searchClear: any;
  routerCheck: any;
  days = [
    { id: 'Sunday', day: 'CGP-PROFILE.sun', active: false },
    { id: 'Monday', day: 'CGP-PROFILE.mon', active: false },
    { id: 'Tuesday', day: 'CGP-PROFILE.tue', active: false},
    { id: 'Wednesday', day: 'CGP-PROFILE.wed', active: false },
    { id: 'Thursday', day: 'CGP-PROFILE.thu', active: false },
    { id: 'Friday', day: 'CGP-PROFILE.fri', active: false },
    { id: 'Saturday', day: 'CGP-PROFILE.sat', active: false }];

  timeSlot = [
    { time: '08 - 12', startTime: '08:00', endTime: '12:00', active: false},
    { time: '12 - 16', startTime: '12:00', endTime: '16:00', active: false},
    { time: '16 - 20', startTime: '16:00', endTime: '20:00', active: false}
  ];

  constructor( private strapiService: StrapiService,
               private route: ActivatedRoute,
               private router: Router,
               private apiloader: MapsAPILoader,
               private ngZone: NgZone,
               private sessionService: SessionService,
               public ngxLoader: NgxUiLoaderService) {
                this.route.params.subscribe(params => {

                  this.search = params.search;
                });
                this.routerCheck = this.router.url.split('/');
  }

  ngOnInit(): void {
    this.apiLoader();
    this.address = (JSON.parse(this.sessionService.getLocal('location'))) ? (JSON.parse(this.sessionService.getLocal('location')).address) : 'Searching for GeoLocation...';

    if (!this.cgpList.length) {
      if (this.type === 'landing' || this.subSpeciality === 'type') {
        this.validateAddress();
      } else if (this.subSpeciality === 'speciality') {
        this.cgpListBasedoncategory();
      } else if (this.subSpeciality) {
        this.cgpListBasedonSubtopic();
      }
    }

  }

  cgpListBasedonSubtopic() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: this.value
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.getCgpListBySubtopic(this.subSpeciality, 0, data).subscribe((res: any) => {
        this.ngxLoader.stopLoader('loader-cgp');
        if (this.routerCheck[2] !== 'more-advisors') {
          this.cgpList = res.data.slice(0, 12);
        } else {
          this.cgpList = res.data;
        }
        this.strapiService.cgpCount.next(this.cgpList.length);

      },
      (err: any) => {
      });
  }

  cgpListBasedoncategory() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: this.value
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
        this.ngxLoader.stopLoader('loader-cgp');
        if (this.routerCheck[2] !== 'more-advisors') {
        this.cgpList = res.data.slice(0, 12);
      } else {
        this.cgpList = res.data;
      }

        this.strapiService.cgpCount.next(this.cgpList.length);

      },
      (err: any) => {
      });
  }

  updateDistance(){
      const data = {
        latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
        longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
        distance: this.value
      };
      if (this.updateExpert){
      this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
        this.modalClose.nativeElement.click();
        if (this.routerCheck[2] !== 'more-advisors') {
            this.cgpList = res.data.slice(0, 12);
          } else {
            this.cgpList = res.data;
          }
        },
        (err: any) => {
        });
     }else{
       if (this.type === 'landing' || this.subSpeciality === 'type') {
         this.validateAddress();
         this.modalClose.nativeElement.click();
       } else if (this.subSpeciality === 'speciality') {
         this.cgpListBasedoncategory();
         this.modalClose.nativeElement.click();
       } else {
         this.cgpListBasedonSubtopic();
         this.modalClose.nativeElement.click();
       }
    }


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
  validateAddress(){
    this.latitude = this.latitude ? this.latitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lat : 49.611622);
    this.longitude = this.longitude ? this.longitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lon : 6.131935);
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.value
    };
    this.sessionService.setLocal('location', JSON.stringify({address: this.address, lat: this.latitude, lon: this.longitude}));
    if (this.updateExpert){
        this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
        this.modalLocationClose.nativeElement.click();
        if (this.routerCheck[2] !== 'more-advisors') {
              this.cgpList = res.data.slice(0, 12);
            } else {
              this.cgpList = res.data;
            }
        this.strapiService.cgpCount.next(this.cgpList.length);
        },
        (err: any) => {
        });
     }else{
      this.strapiService.updateDistance(data).subscribe((res: any) => {
      this.modalLocationClose.nativeElement.click();
      if (this.routerCheck[2] !== 'more-advisors') {
            this.cgpList = res.data.slice(0, 12);
          } else {
            this.cgpList = res.data;
          }
      this.strapiService.cgpCount.next(this.cgpList.length);
      this.searchClear = '';
    },
    (err: any) => {
    });
   }
  }


  cgpListBasedonAvailability() {
    const choseday: any = [];
    const chosetime: any = [];
    this.days.forEach((element: {  id: string; day: string, active: boolean  }) => {
      if (element.active == true) { choseday.push(element.id); }
    });
    this.timeSlot.forEach((element: {  time: string, startTime: string, endTime: string, active: boolean  }) => {
      if (element.active == true) { chosetime.push({startTime: element.startTime, endTime: element.endTime}); }
    });
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: this.value,
      dayName: choseday.join(', '),
      time: chosetime
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.nearbyCgpList(data).subscribe((res: any) => {
      this.modalAvailabilityClose.nativeElement.click();
      this.ngxLoader.stopLoader('loader-cgp');
      this.cgpList = res.data;
      this.strapiService.cgpCount.next(this.cgpList.length);
      },
      (err: any) => {
      });
  }




  clearAll(){
    this.value = 45;
    this.latitude = JSON.parse(this.sessionService.getLocal('cur_location')).lat;
    this.longitude = JSON.parse(this.sessionService.getLocal('cur_location')).lon;
    this.address = JSON.parse(this.sessionService.getLocal('cur_location')).address;
    this.sessionService.setLocal('location', JSON.stringify({address: this.address, lat: this.latitude, lon: this.longitude}));
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.value
    };
    this.days.forEach((element: {  id: string; day: string, active: boolean  }) => {
      if (element.active == true) { element.active = false }
    });
    this.timeSlot.forEach((element: {  time: string, startTime: string, endTime: string, active: boolean  }) => {
      if (element.active == true) { element.active = false}
    });
    const data1 = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.value,
      dayName: '',
      time: ''
    };
    this.strapiService.nearbyCgpList(data).subscribe((res: any) => {
      this.cgpList = res.data;
      this.strapiService.cgpCount.next(this.cgpList.length);
      },
      (err: any) => {
      });
    if (this.updateExpert){
      this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
      this.modalClose.nativeElement.click();
      if (this.routerCheck[2] !== 'more-advisors') {
            this.cgpList = res.data.slice(0, 12);
          } else {
            this.cgpList = res.data;
          }
      },
      (err: any) => {
      });
   }else{
      if (this.type === 'landing' || this.subSpeciality === 'type') {
        this.validateAddress();
      } else if (this.subSpeciality === 'speciality') {
        this.cgpListBasedoncategory();
      } else {
        this.cgpListBasedonSubtopic();
      }
    }
  }


  selectTime(index: number){
    this.timeSlot[index].active = !this.timeSlot[index].active;
  }

  selectDay(index: number){
    this.days[index].active = !this.days[index].active;
   }

  ngOnDestroy() {
    this.modalClose.nativeElement.click();
    this.modalLocationClose.nativeElement.click();
  }

}
