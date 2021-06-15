import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {ActivatedRoute} from '@angular/router';
import {CgpService} from '../../../services/cgp.service';
import {MapsAPILoader  } from '@agm/core';
import { SessionService } from 'src/app/services/session.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { SEOService } from 'src/app/services/seo.service';


@Component({
  selector: 'app-cgp-article',
  templateUrl: './cgp-article.component.html',
  styleUrls: ['./cgp-article.component.scss']
})
export class CgpArticleComponent implements OnInit {
  @ViewChild('myModalCloseCGPLocation') modalLocationClose: any;
  @ViewChild('search_location', { static: false }) searchElementRef!: ElementRef;

  public speciality: any;
  public subSpeciality: any;
  public cgpList: any[] = [];
  public details: any;
  public mostViewArticles: any[] = [];
  public mostRecentArticles: any[] = [];
  public articlesList: any;
  address: any;
  href: any;
  latitude: any;
  longitude: any;
  metatag: any = [];

  constructor(private strapiService: StrapiService,
              private route: ActivatedRoute,
              private cgpService: CgpService,
              private apiloader: MapsAPILoader,
              private ngZone: NgZone,
              private seoService: SEOService,
              private sessionService: SessionService,
              public ngxLoader: NgxUiLoaderService) {
    this.route.params.subscribe(params => {
      this.speciality = params.speciality;
      this.subSpeciality = params.subSpeciality;
    });
    this.cgpService.subTopicCP.subscribe(res => {
      setTimeout(() => {
        this.ngOnInit();
      }, 100);

    });

  }

  ngOnInit(): void {
    this.getDetails();
    this.cgpListBasedonSubtopic();
    this.articlesBasedonTags();
    this.mostViewed();
    this.mostRecent();
    this.apiLoader();
    this.address = (JSON.parse(this.sessionService.getLocal('location')).address)?(JSON.parse(this.sessionService.getLocal('location')).address):'Searching for your GeoLocation....';
  }

  cgpListBasedonSubtopic() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: 10000
    };
    this.strapiService.getCgpListBySubtopic(this.subSpeciality, '', data).subscribe((res: any) => {
        this.cgpList = res.data;
      },
      (err: any) => {
      });
  }


  getDetails() {
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.getSubTopicDetails(this.subSpeciality).subscribe((res: any) => {
        this.details = res.data[0];
        this.metatag = [
          {name: 'description', content: res.data[0].description},
          {property: 'og:title', content: res.data[0].title},
          {proprety: 'og:description', content: res.data[0].description},
          {property: 'og:image', content: res.data[0].articleUrl},
          {property: 'og:url', content: this.href }];

        this.seoService.updateMetaTags(this.metatag);
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

  mostViewed() {
    this.strapiService.tagsArticles(this.subSpeciality, 9, 'viewed').subscribe((res: any) => {
        this.mostViewArticles = res.data;
      },
      (err: any) => {
      });
  }

  mostRecent() {
    this.strapiService.tagsArticles(this.subSpeciality, 4, 'recent').subscribe((res: any) => {
        this.mostRecentArticles = res.data;
      },
      (err: any) => {
      });
  }

  articlesBasedonTags() {
    this.strapiService.tagsArticles(this.subSpeciality, 4, '').subscribe((res: any) => {
        this.articlesList = res.data;
      },
      (err: any) => {
      });
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
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: 45
    };
    this.sessionService.setLocal('location', JSON.stringify({address: this.address, lat: this.latitude, lon: this.longitude}));
    this.strapiService.getCgpListBySubtopic(this.subSpeciality, '', data).subscribe((res: any) => {
      this.modalLocationClose.nativeElement.click();
      this.cgpList = res.data;
    },
    (err: any) => {
    });
  }

  ngOnDestroy() {
    this.modalLocationClose.nativeElement.click();
  }

}
