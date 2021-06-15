import { Component, OnInit } from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {SessionService} from '../../../services/session.service';
import { SEOService } from 'src/app/services/seo.service';
import {MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-article-details',
  templateUrl: './cgp-article-view.component.html',
  styleUrls: ['./cgp-article-view.component.scss']
})
export class CgpArticleViewComponent implements OnInit {
  details: any;
  private articleId: any;
  private name: any;
  href: any;
  metatag: any = [];
  address: any;
  longitude = 0;
  latitude = 0;
  filename: any;

  constructor(private strapiService: StrapiService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private seoService: SEOService,
              private sessionService: SessionService,
              private apiloader: MapsAPILoader) {
    this.route.params.subscribe(params => {
      this.name = params.name;
    });
    this.strapiService.articleDetails.subscribe(res => {
      setTimeout(() => {
        this.ngOnInit();
      }, 100);

    });
  }

  ngOnInit(): void {
    this.address = JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).address : '';
    if (!this.address) {
      this.getLocation();
    } else {
      this.getDetails();
    }
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
          this.getDetails();

        } else {
          console.log('Not found');
        }
      });
    });
  }

  getDetails() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: 45
    };
    this.strapiService.articlesDetails(this.name, data).subscribe((res: any) => {
        this.details = res.data[0];
        const fileArray = res.data[0].articleImage.includes('/') ? res.data[0].articleImage.split('/') : res.data[0].articleImage.split('\\');
        const guideName = fileArray[5].split('_');
        for (let [index, value] of guideName.entries()) {
          if (index !== 0) {
            this.filename = this.filename ? this.filename + '_' + value : value
          }
        }
        // this.filename = guideName[1];
        if (this.filename.length > 40){
        this.filename = (this.filename.substring( 0, 40)) + '.....' + this.filename.substr(this.filename.lastIndexOf('.') + 1);
        }
        this.articleId = this.details.id;
        this.metatag = [
          {name: 'description', content: res.data[0].description},
          {property: 'og:title', content: res.data[0].title},
          {proprety: 'og:description', content: res.data[0].description},
          {property: 'og:image', content: res.data[0].articleUrl},
          {property: 'og:url', content: this.href }];

        // this.seoService.updateTitle(res.data[0].title);
        this.seoService.updateMetaTags(this.metatag);
      },
      (err: any) => {
      });
  }

  safeUrl(articleImage: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(articleImage);
  }
}
