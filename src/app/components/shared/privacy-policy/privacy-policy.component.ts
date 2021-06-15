import { Component, OnInit } from '@angular/core';
import { CgpService } from '../../../services/cgp.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor( private cgpService: CgpService) { 
    this.getAllContent();
  }

  privacyPolicy: any;

  ngOnInit(): void {
  }

  async getAllContent(){
    this.cgpService.getPrivacyPolicy().subscribe((response) => {
      if (response != null){
        this.privacyPolicy = response.data[0].content;
      }
    }, errors => {
        console.log(errors);
    });
  }

}
