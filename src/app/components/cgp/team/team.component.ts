import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../../services/session.service';
import { environment } from 'src/environments/environment';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CgpService } from '../../../services/cgp.service';
import { Router,ActivatedRoute  } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';


class DataTablesResponse {
  list: any[]=[];
  data:any;
  draw: number=0;
  recordsFiltered: number=0;
  recordsTotal: number=0;
}


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})

export class TeamComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective | any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  persons: any[] = [];
  cgpId: any;
  private URL = environment.API_URL;
  id: any;
  showModal = false;
  showModal1 = false;
  showModal2 = false;
  role_status: any = [{name:'ADMIN',value:"Administrator"}, {name:'COLLABORATOR',value:"Collaborator"}];
  teamid: any;
  firstname: any;
  cgpEmailList: any[] = [];
  selectedEmail: any = [];
  emailPattern = "^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,3})$";
  emailValid: boolean = false;
  submitEmail: boolean = false;

  constructor(private cgpService: CgpService, private http: HttpClient, private sessionService: SessionService, private sweetAlertService: SweetAlertService, private router: Router) {
  }

  ngOnInit(): void {
    if (JSON.parse(this.sessionService.getLocal('user')) !== null) {
      this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
    }
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: false,
      lengthChange: false,
      searching: false,
      info: false,
      language: {
        paginate: {
          next: '<i class="fa fa-forward"></i>',
          previous: '<i class="fa fa-backward"></i>',
          first: '<i class="fa fa-step-backward"></i>',
          last: '<i class="fa fa-step-forward"></i>'
        }
      },
      ajax: (dataTablesParameters: any, callback: any) => {
        that.http
          .post<DataTablesResponse>(
            that.URL + 'cgp/team/' + that.cgpId,
            dataTablesParameters, {}
          ).subscribe(resp => {
          console.log(resp.data.list)
          that.persons = resp.data.list;
          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsTotal,
            data: []
          });
        });
      },
      columns: [{ data: 'firstname' }, { data: 'lastname' }, { data: 'email' }, { data: 'status' }, { data: 'role' }]
    };
  }

  deleteTeam(id: any) {
    this.id = id;
    this.showModal = true;
  }

    deleteArt() {
      this.cgpService.deleteCGPTeam(this.id).subscribe((response) => {
        const title = 'CGP.TEAM.The-team';
        const message = 'SERVER-RESPONSE.' + response.message;
        this.sweetAlertService.showSwalSuccess(title, message);
        this.rerender();
      }, errors => {
        console.log(errors);
      });
      this.showModal = false;
    }

  goBack() {
    this.showModal = false;
  }

  goBack1() {
    this.showModal1 = false;
    this.rerender();
  }

  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
    } catch (err) {
      console.log(err);
    }
  }

  changeStatus(event: any, id: any, name: any) {
    let role = event.target.options[event.target.options.selectedIndex].text.toUpperCase();
    if (role == 'ADMIN') {
      console.log(name)
      this.firstname = name;
      this.showModal1 = true;
      this.teamid = id;
    } else {
      let data = {
        "role": role
      }
      this.cgpService.roleUpdate(id, data).subscribe((response) => {
        const title = 'CGP.TEAM.The-team';
        const message = 'SERVER-RESPONSE.' + response.message;
        this.sweetAlertService.showSwalSuccess(title, message);
        this.rerender();
      }, errors => {
        console.log(errors);
      });
    }
  }

    changeStatus1(){
      let data ={
        "role": "ADMIN"
      }
      this.cgpService.roleUpdate(this.teamid,data).subscribe((response) => {
        const title = 'CGP.TEAM.The-team';
        const message = 'SERVER-RESPONSE.' + response.message;
        this.sweetAlertService.showSwalSuccess(title, message);
        this.showModal1 = false;
        this.rerender();
      }, errors => {
        console.log(errors);
     });
    }


  addTagFn(name: any) {
    return {name, tag: true};
  }

  cgpEmailValidate(event: any) {
    if (event.length) {
      let value = event.length;
      for (const [index, data] of event.entries()) {
        console.log(data.name)
        if (data.name.search(this.emailPattern) === -1) {
          console.log(data.name)
          this.emailValid = true;
          return;
        } else {
          this.emailValid = false;
        }
      }
    }
  }

  sendEmail() {
    this.submitEmail = true;
    if (!this.emailValid && this.selectedEmail.length > 0) {
      const cgpEmailListSelected: any = [];
      this.selectedEmail.forEach((element: { name: string, active: boolean }) => {
        cgpEmailListSelected.push(element.name);
      });
      console.log(cgpEmailListSelected)
      let data = {
        "emailId": cgpEmailListSelected,
        "cgpId": this.cgpId
      }

      this.cgpService.teamInvite(data).subscribe((response) => {
          this.submitEmail = false;
          this.showModal2 = true;
          this.cgpEmailList = [];
        },
        err => {
          const title = 'CGP.TEAM.The-team';
          const message = 'SERVER-RESPONSE.' + err.message;
          this.sweetAlertService.showSwalError(title, message);
        });

    }
  }


}
