import { Component, OnInit } from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-cgp-more-experts',
  templateUrl: './cgp-more-experts.component.html',
  styleUrls: ['./cgp-more-experts.component.scss']
})
export class CgpMoreExpertsComponent implements OnInit {

  public details: any = {};
  public subSpeciality: any;
  public search: any;
  public cgpCount = 0;

  constructor(private strapiService: StrapiService,
              private route: ActivatedRoute,
              public ngxLoader: NgxUiLoaderService) {
    this.route.params.subscribe(params => {
      this.subSpeciality = params.subSpeciality;
      this.search = params.search;
    });
    this.strapiService.cgpCount.subscribe(res => {
      this.cgpCount = res;
      setTimeout(() => {
      }, 100);

    });
  }

  ngOnInit(): void {
    if (this.subSpeciality === 'speciality' || this.subSpeciality === 'type') {
      this.details.specialtyName = this.search;
    } else {
      this.getDetails();
    }
  }


  getDetails() {
    this.strapiService.getSubTopicDetails(this.subSpeciality).subscribe((res: any) => {
        this.details = res.data[0];
      },
      (err: any) => {
      });
  }

}
