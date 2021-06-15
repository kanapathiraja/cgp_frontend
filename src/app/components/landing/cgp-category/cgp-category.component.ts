import {Component, NgZone, OnInit, ViewChild, Renderer2} from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {ActivatedRoute, Router} from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
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
import {CgpService} from '../../../services/cgp.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'app-cgp-category',
  templateUrl: './cgp-category.component.html',
  styleUrls: ['./cgp-category.component.scss']
})
export class CgpCategoryComponent implements OnInit {
  @ViewChild("swiperRef", { static: false }) swiperRef?: SwiperComponent;
  show: boolean | undefined;
  subTopicShow = false;

  public cgpList: any = [];
  public id = '';
  public details: any;
  public search = '';
  public mostViewArticles: any[] = [];
  public mostRecentArticles: any[] = [];

  slides = Array.from({ length: 1 }).map(
    (el, index) => `Slide ${index + 1}`
  );
  public updateExpert: any;

  constructor(private strapiService: StrapiService,
              private route: ActivatedRoute,
              private cgpService: CgpService,
              private ngZone: NgZone,
              private router: Router,
              private renderer: Renderer2,
              public ngxLoader: NgxUiLoaderService,
              private sessionService: SessionService) {
  this.renderer.addClass(document.body, 'cgp-grid-sec');
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.search = params.search;
    });
    this.cgpService.categoruCGP.subscribe(res => {
      setTimeout(() => {
        this.subTopicShow = false;
        this.updateExpert = res;
        this.ngOnInit();
      }, 100);

    });
  }

  ngOnInit(): void {
    this.specialityDetails();
    this.cgpListBasedoncategory();
    this.mostViewed();
    this.mostRecent();
  }

  specialityDetails() {
    this.strapiService.getSpecialtiesandSubtopic(this.id).subscribe((res: any) => {
        this.details = res.data[0];
        this.subTopicShow = true;
        this.updateExpert = this.updateExpert ? this.updateExpert : 'nonSearch';
      },
      (err: any) => {
      });
  }

  cgpListBasedoncategory() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: 45
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
        this.ngxLoader.stopLoader('loader-cgp');
        this.cgpList = res.data.slice(0, 12);
        // this.cgpList = res.data;

      },
      (err: any) => {
      });
  }

  mostViewed() {
    this.strapiService.specialityArticles(this.id, 8, 'viewed', 'all').subscribe((res: any) => {
        this.mostViewArticles = res.data;
      },
      (err: any) => {
      });
  }

  mostRecent() {
    this.strapiService.specialityArticles(this.id, 4, 'recent', 'all').subscribe((res: any) => {
        this.mostRecentArticles = res.data;
      },
      (err: any) => {
      });
  }

  subtopicDetails(url: string) {
    this.ngZone.run(() => {
      this.router.navigate([url]);
    });
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cgp-grid-sec');
  }
}
