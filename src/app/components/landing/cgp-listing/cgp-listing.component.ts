import {Component, OnInit, Renderer2} from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {ActivatedRoute} from '@angular/router';
import {SessionService} from '../../../services/session.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-cgp-listing',
  templateUrl: './cgp-listing.component.html',
  styleUrls: ['./cgp-listing.component.scss']
})
export class CgpListingComponent implements OnInit {
  public cgpList: any = [];
  public search = '';


  constructor(private strapiService: StrapiService,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private sessionService: SessionService,
              public ngxLoader: NgxUiLoaderService) {
    this.renderer.addClass(document.body, 'cgp-list-grid-sec');
    this.route.params.subscribe(params => {
      this.search = params.search;
    });
    this.strapiService.cgpSearch.subscribe(res => {
      setTimeout(() => {
        this.ngOnInit();
      }, 100);

    });
  }

  ngOnInit(): void {
    this.getSearchList();
  }

  getSearchList() {
    const data = {
      latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
      longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
      distance: 45
    };
    this.ngxLoader.startLoader('loader-cgp');
    this.strapiService.getCgpBySpecialties(this.search, data).subscribe((res: any) => {
        this.cgpList = res.data;
        this.ngxLoader.stopLoader('loader-cgp');
      },
      (err: any) => {
      });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'cgp-list-grid-sec');
  }
}
