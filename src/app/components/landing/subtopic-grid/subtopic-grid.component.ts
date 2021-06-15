import { Component, OnInit } from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';

@Component({
  selector: 'app-subtopic-grid',
  templateUrl: './subtopic-grid.component.html',
  styleUrls: ['./subtopic-grid.component.scss']
})
export class SubtopicGridComponent implements OnInit {

  public subtopics: any = [];

  constructor(private strapiService: StrapiService) { }

  ngOnInit(): void {
    this.specialityList();
  }

  specialityList() {
    this.strapiService.getSpecialtiesandSubtopic('').subscribe((res: any) => {
        res.data.filter((list: {
          id: any;
          specialtyName: any;
          subtopics: any[]; }) => {
         if (list.subtopics.length) {
           list.subtopics.filter((map: {
             specialtyId: any;
             specialtyName: any; }) => {
             map.specialtyId = list.id;
             map.specialtyName = list.specialtyName;
           });
           this.subtopics = this.subtopics.concat(list.subtopics);
         }
        });
      },
      (err: any) => {
      });
  }
}
