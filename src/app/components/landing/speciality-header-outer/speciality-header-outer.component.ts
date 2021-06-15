import { Component, OnInit } from '@angular/core';
import {StrapiService} from '../../../services/strapi.service';
import {CgpService} from '../../../services/cgp.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-speciality-header-outer',
  templateUrl: './speciality-header-outer.component.html',
  styleUrls: ['./speciality-header-outer.component.scss']
})
export class SpecialityHeaderOuterComponent implements OnInit {
  selectedTab: any;
  public specialities: any[] = [];
  constructor(private strapiService: StrapiService,
              private cgpService: CgpService,
              private router: Router) { }

  ngOnInit(): void {
    this.specialityList();
  }

  specialityList() {
    this.strapiService.getSpecialtiesandSubtopic('').subscribe((res: any) => {
        this.specialities = res.data;
        console.log(res.data)
      },
      (err: any) => {
      });
  }


  navigateSubtopicUrl(url: string) {
    this.router.navigate([url]);
    console.log(this.router.navigate([url]))
    this.cgpService.subTopicCP.next();
  }

  categoryRedirect(specialty: any) {
    this.selectedTab = specialty.specialtyName;
    this.router.navigate(['/landing/category/' + specialty.id + '/' + specialty.specialtyName]);
    this.cgpService.categoruCGP.next('nonSearch');

  }
}
