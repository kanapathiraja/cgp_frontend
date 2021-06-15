import { Component, OnInit } from '@angular/core';
import { CgpService } from '../../../services/cgp.service';
import { SessionService } from '../../../services/session.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';


@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit {

  cgpId: any;
  viewCGPPublishArticle: any [] = [];
  viewCGPDraftArticle: any [] = [];
  startPage = 0;
  paginationLimit = 10;
  paginationLimit1 = 10;
  authorname: any;
  showModal = false;
  status: any;
  id: any;
  tab: any;


  constructor(private cgpService: CgpService,
              private sessionService: SessionService,
              private route: ActivatedRoute,
              private sweetAlertService: SweetAlertService,
              public ngxLoader: NgxUiLoaderService) {

      this.route.fragment.subscribe(fragment  => {
        this.tab = (fragment) ? fragment : 'tabs-2';
      });
    }

  ngOnInit(): void {
    if (JSON.parse(this.sessionService.getLocal('user')) !== null){
      this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
      this.authorname = JSON.parse(this.sessionService.getLocal('user')).firstName + ' ' + JSON.parse(this.sessionService.getLocal('user')).lastName.charAt(0);
      this.getCGPDraftArticle('draft');
      this.getCGPPublishedArticle('publish');
    }
  }

  // tslint:disable-next-line:typedef
  getCGPPublishedArticle(status: any){
    this.ngxLoader.startLoader('loader-cgp');
    this.cgpService.getCGPPublishedArticle(status, this.cgpId).subscribe((response) => {
      this.viewCGPPublishArticle = response.data;
      this.ngxLoader.stopLoader('loader-cgp');
    }, errors => {
      console.log(errors);
   });

  }

  // tslint:disable-next-line:typedef
  getCGPDraftArticle(status: any){
    this.cgpService.getCGPPublishedArticle(status, this.cgpId).subscribe((response) => {
      this.viewCGPDraftArticle = response.data;
    }, errors => {
      console.log(errors);
   });

  }

  showMoreItems() {
     this.paginationLimit = Number(this.paginationLimit) + 10;
  }
  showLessItems() {
    this.paginationLimit = Number(this.paginationLimit) - 10;
  }

  showMoreItems1() {
     this.paginationLimit1 = Number(this.paginationLimit1) + 10;
  }
  showLessItems1() {
    this.paginationLimit1 = Number(this.paginationLimit1) - 10;
  }

  // tslint:disable-next-line:typedef
  deleteArticle(id: any, status: any){
  this.id = id;
  this.status = status;
  this.showModal = true;
  }

  deleteArt(){
      this.cgpService.deleteCGPPublishedArticle(this.id).subscribe((response) => {
        if (this.status === 'publish'){
        this.getCGPPublishedArticle('publish');
        }else{
        this.getCGPDraftArticle('draft');
        }
        const title = 'CGP.CONTENTS.Contents';
        const message = 'SERVER-RESPONSE.' + response.message;
        this.sweetAlertService.showSwalSuccess(title, message);
      }, errors => {
        console.log(errors);
     });
      this.showModal = false;
    }

  goBack(){
    this.showModal = false;
  }

}
