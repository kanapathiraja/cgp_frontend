import { Component, OnInit } from '@angular/core';
import { CgpService } from '../../../services/cgp.service';

@Component({
  selector: 'app-why-cgp',
  templateUrl: './why-cgp.component.html',
  styleUrls: ['./why-cgp.component.scss']
})
export class WhyCgpComponent implements OnInit {
  faqsList: any = [];

  constructor( private cgpService: CgpService) {
      this.getAllContent();
    }

    whyCGPData: any;

  ngOnInit(): void {
      this.getAllFaqs();
  }


  async getAllFaqs(){
    this.cgpService.getAllFaqs().subscribe((response) => {
      if (response != null){
        this.faqsList = response.data;
      }
    }, errors => {
        console.log(errors);
    });
  }

  async getAllContent(){
    const content_url = 'why-cgp';
    this.cgpService.getAllContent(content_url).subscribe((response) => {
      if (response != null && response.length > 0){
        this.whyCGPData = response[0];
      }
    }, errors => {
        console.log(errors);
    });
  }

}
