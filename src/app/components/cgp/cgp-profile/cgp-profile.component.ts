import { Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgpService } from '../../../services/cgp.service';
import { SessionService } from '../../../services/session.service';
import { environment } from 'src/environments/environment';
import {StrapiService} from '../../../services/strapi.service';
import {MapsAPILoader  } from '@agm/core';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {SweetAlertService} from '../../../services/sweet-alert.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-cgp-profile',
  templateUrl: './cgp-profile.component.html',
  styleUrls: ['./cgp-profile.component.scss']
})
export class CgpProfileComponent implements OnInit {
  @ViewChild('myModalCloseCGPEdit') modalClose: any;
  @ViewChild('myModalCloseCGPDesc') modalCloseDesc: any;
  @ViewChild('myModalCloseCGPPractical') modalClosePractical: any;
  @ViewChild('myModalCloseCGPTeam') modalCloseTeam: any;
  @ViewChild('myModalCloseCGPLocation') modalLocationClose: any;
  @ViewChild('search_location', { static: false }) searchElementRef!: ElementRef;

  submitCGPAttempt = false;
  submitCGPPresentationAttempt = false;
  submitCGPPracticalAttempt = false;
  submitCGPTeamAttempt = false;
  selectedSpeciality: any = [];
  selectedSubtopic: any = [];
  selectedTag: any = [];
  selectedPartner: any = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  scale = 1;
  transform: ImageTransform = {};
  value = 45;
  emailValidate = false;
  checkaddress: boolean = false;

  practicalInfoData = [
    {
      startTime: '',
      endTime: '',
      dayId: '0',
      dayName: 'Sunday',
      language: 'CGP-PROFILE.sunday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '1',
      dayName: 'Monday',
      language: 'CGP-PROFILE.monday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '2',
      dayName: 'Tuesday',
      language: 'CGP-PROFILE.tuesday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '3',
      dayName: 'Wednesday',
      language: 'CGP-PROFILE.wednesday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '4',
      dayName: 'Thursday',
      language: 'CGP-PROFILE.thursday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '5',
      dayName: 'Friday',
      language: 'CGP-PROFILE.friday',
    },
    {
      startTime: '',
      endTime: '',
      dayId: '6',
      dayName: 'Saturday',
      language: 'CGP-PROFILE.saturday',
    },
  ];


  cgpCustomerData: any[] = [];
  cgpSpecialityData: any[] = [];
  cgpPartnerData: any[] = [];
  cgpSubtopicData: any[] = [];
  cgpTagData: any[] = [];

  // edit form init
   cgpPracticalInfoForm!: FormGroup;
   cgpTeamInfoForm!: FormGroup;
   cgpInfoForm!: FormGroup;
   cgpPresentationForm!: FormGroup;
   cgpCustomerForm: FormGroup;
   cgpSpecialityForm: FormGroup;
   cgpPartnerForm: FormGroup;
   cgpSubtopicForm: FormGroup;
   cgpTagForm: FormGroup;


  // view Data init
   viewCGPInfoDetails: any;
   viewCGPTeamInfoDetails: any [] = [];
   viewCGPCustomerInfoDetails: any = [];
   viewCGPPracticalInfoDetails: any = [];
   viewCGPSpecialitiesDetails: any = [];
   viewCGPPartnersDetails: any = [];
   viewCGPSubtopicDetails: any = [];
   viewCGPTagDetails: any = [];
   cgpCustomerInfoForm: any = [];

   cgpId: any;
   search_clear: any;
   email: any;
   url: any;
   url_logo: any;
   teamurl: any;
   selectedFile: any;
   selectedFile_logo: any;
   img_url: any;
   startPage = 0;
   paginationLimit = 3;
  countteam: any;
  public articlesList: any[] = [];
  website: any;
  zoom = 10;
  longitude = 0;
  latitude = 0;
  labelOptions: any;
  icon: any;
  address: any;
  Timeerr: any = [];
  

  // role_status: any = ['ADMIN', 'COLLABORATOR', 'DIRECTOR']


  constructor(
    private formBuilder: FormBuilder,
    private cgpService: CgpService,
    private sessionService: SessionService,
    private strapiService: StrapiService,
    private apiloader: MapsAPILoader,
    private ng2ImgMax: Ng2ImgMaxService,
    public ngxLoader: NgxUiLoaderService,
    public router: Router,
    private ngZone: NgZone,
    private sweetAlertService: SweetAlertService,
    ) {
     // CGP Practical Information init form
    this.cgpPracticalInfoForm = this.formBuilder.group({
      twitter : [''],
      facebook : [''],
      linkedIn : [''],
      instagram : [''],
      youtube : [''],
      cgpId: '',
      datevalidate: ['', Validators.required],
      cgpPracticalInfo: this.formBuilder.array(this.practicalInfoData.map(value => {
        return this.initCGPPracticalInformation(value.dayName, value.startTime, value.endTime, value.language, '');
      }))
    });

    this.getAllCustomer();
    this.getAllSpeciality();
    this.getAllPartner();


    // cgp Client init Form
    this.cgpCustomerForm = this.formBuilder.group({
      cgpCustomerValue: this.formBuilder.array([])
    });

    this.cgpSpecialityForm = this.formBuilder.group({
      cgpSpecialityValue: this.formBuilder.array([])
    });

    this.cgpPartnerForm = this.formBuilder.group({
      cgpPartnerValue: this.formBuilder.array([])
    });

    this.cgpSubtopicForm = this.formBuilder.group({
      cgpSubtopicValue: this.formBuilder.array([])
    });


    this.cgpTagForm = this.formBuilder.group({
      cgpTagValue: this.formBuilder.array([])
    });


     // CGP Team Information init form
    this.initCGPTeamInformation();
    this.initCGPPresentation();
    this.initCGPInfo();
    this.img_url = environment.IMG_URL;


  }

  ngOnInit(): void {
    this.apiLoader();
    this.address = JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).address : '';
    if (!this.address) {
      this.getLocation();
    } else {
      if (JSON.parse(this.sessionService.getLocal('user')) !== null){
        this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
        this.getInitialCGPInformation(JSON.parse(this.sessionService.getLocal('user')).cgpId);
      }else{
        this.router.navigate(['/']);
      }
    }

  }

  specilaityUpdate(event: any) {
    this.cgpSubtopicForm = this.formBuilder.group({
      cgpSubtopicValue: this.formBuilder.array([])
    });

    this.cgpTagForm = this.formBuilder.group({
      cgpTagValue: this.formBuilder.array([])
    });
    this.cgpSubtopicData = this.cgpTagData = [];
    if (event.length) {
      let value = event.length;
      for (const [index, data] of event.entries()) {
        this.getAllSubtopic(data.id, index === value - 1, 'change');
        this.getAllTags(data.id, index === value - 1, 'change');
      }
    } else {
      this.selectedSubtopic = this.selectedTag = [];
    }

  }

  // initializing CGP Info Form
  initCGPInfo(){
    this.cgpInfoForm = this.formBuilder.group({
      establishmentName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      foundedYear: ['', Validators.required],
      website: ['', Validators.required],
      addressComplement: [''],
      addressType: [''],
      addressNumber: ['', Validators.required],
      addressStreet: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
    });
  }

  // initializing CGP Practical Info Form
  initCGPPracticalInformation(dayName: string, startTime: string, endTime: string, language: string, cgp: string) {
    return this.formBuilder.group({
        dayName,
        startTime,
        endTime,
        language,
        cgp
      });
  }

  // initializing CGP Team Info Form
  initCGPTeamInformation(){
    this.cgpTeamInfoForm =  this.formBuilder.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        // role: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(emailPattern)]],
        designation: ['', Validators.required],
        description: ['', Validators.required],
        addressComplement: [''],
        addressType: [''],
        addressNumber: ['', Validators.required],
        addressStreet: ['', Validators.required],
        city: ['', Validators.required],
        country: ['France', Validators.required],
        postalCode: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*$')]],
         // bannerUrl: ['',Validators.required],
        cgpTeamInfoId: '',
        cgpId: ''
      });
  }

  initCGPPresentation(){
    this.cgpPresentationForm = this.formBuilder.group({
      presentationText: ['', Validators.required],
      cgpId: ''
    });
  }

  initCGPClientInformation(customer_type: string, id: string, active: boolean) {
    return this.formBuilder.group({
      customer_type,
      id,
      active: false
    });
  }

  validateNumber(event: any) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46];

    if (!((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      (excludedKeys.includes(keyCode)))) {
      event.preventDefault();
    }
  }

  initCGPSubtopicInformation(subtopicTitle: string, id: string, active: boolean) {
    return this.formBuilder.group({
      subtopicTitle,
      id,
      active: false
    });
  }

  initCGPTagsInformation(tagTitle: string, id: string, active: boolean) {
    return this.formBuilder.group({
      tagTitle,
      id,
      active: false
    });
  }

  initCGPSpecialityInformation(specialty_name: string, id: string, active: boolean) {
    return this.formBuilder.group({
      specialty_name,
      id,
      active: false
    });
  }

  initCGPPartnerInformation(partner_name: string, id: string, active: boolean, partner_logo: string) {
    return this.formBuilder.group({
      partner_name,
      id,
      active: false,
      partner_logo,
      cgp: ''
    });
  }

  async getAllCustomer(){
    this.cgpService.getAllCustomer().subscribe((response) => {
      if (response != null && response.length > 0){
        this.cgpCustomerData = response;
        this.cgpCustomerForm = this.formBuilder.group({
          cgpCustomerValue: this.formBuilder.array(this.cgpCustomerData.map(value => {
            return this.initCGPClientInformation(value.customer_type, value.id, value.active);
          }))
        });
      }
    }, errors => {
      this.cgpCustomerData = [];
      console.log(errors);
    });
  }

  async getAllSpeciality(){
    this.cgpService.getAllSpeciality().subscribe((response) => {
      if (response != null && response.length > 0){
        this.cgpSpecialityData = response;
        this.cgpSpecialityForm = this.formBuilder.group({
          cgpSpecialityValue: this.formBuilder.array(this.cgpSpecialityData.map(value => {
            return this.initCGPSpecialityInformation(value.specialty_name, value.id, value.active);
          }))
        });
      }
    }, errors => {
      this.cgpSpecialityData = [];
      console.log(errors);
    });
  }

  async getAllPartner(){
    this.cgpService.getAllPartner().subscribe((response) => {
      if (response != null && response.length > 0){
        this.cgpPartnerData = response;
        this.cgpPartnerForm = this.formBuilder.group({
          cgpPartnerValue: this.formBuilder.array(this.cgpPartnerData.map(value => {
            return this.initCGPPartnerInformation(value.partner_name, value.id, value.active, (value.partner_logo ? value.partner_logo.url : ''));
          }))
        });
      }
    }, errors => {
      this.cgpPartnerData = [];
      console.log(errors);
    });
  }

  async getAllSubtopic(specilityId: any, lastIndex: boolean, type: string){
    this.cgpService.getAllSubtopic(specilityId).subscribe((response) => {
      if (response != null && response.data.length > 0){
        this.cgpSubtopicData = this.cgpSubtopicData.concat(response.data);
        this.cgpSubtopicData.sort((a, b) => a.subtopicTitle.localeCompare(b.subtopicTitle));
        this.cgpSubtopicForm = this.formBuilder.group({
          cgpSubtopicValue: this.formBuilder.array(this.cgpSubtopicData.map(value => {
            return this.initCGPSubtopicInformation(value.subtopicTitle, value.id, value.active);
          }))
        });


          if (lastIndex) {
            setTimeout(() => {
              if (type === 'change') {
                const notIn = (array1: any[], array2: any[]) => array1.filter((item1: { id: any; }) => {
                    const item1Str = JSON.stringify(item1.id);
                    return !array2.find((item2: { id: any; }) =>
                      item1Str === JSON.stringify(item2.id));
                  }
                );

                let check = notIn(this.selectedSubtopic, this.cgpSubtopicData);
                this.selectedSubtopic = this.selectedSubtopic.filter(function(obj: any) {
                  return check.indexOf(obj) == -1;
                });
              }
            }, 100);
          }



      }
    }, errors => {
      this.cgpSubtopicData = [];
      console.log(errors);
    });
  }

  async getAllTags(specialityId: any, lastIndex: boolean, type: string){
    this.cgpService.getTagsBySpeciality(specialityId).subscribe((response) => {
      if (response != null && response.data.length > 0){
        this.cgpTagData = this.cgpTagData.concat(response.data);
        this.cgpTagData.sort((a, b) => a.tagTitle.localeCompare(b.tagTitle));
        this.cgpTagForm = this.formBuilder.group({
          cgpTagValue: this.formBuilder.array(this.cgpTagData.map(value => {
            return this.initCGPTagsInformation(value.tagTitle, value.id, value.active);
          }))
        });

          if (lastIndex) {
            setTimeout(() => {
              if (type === 'change') {
                const notIn = (array1: any[], array2: any[]) => array1.filter((item1: { id: any; }) => {
                    const item1Str = JSON.stringify(item1.id);
                    return !array2.find((item2: { id: any; }) =>
                      item1Str === JSON.stringify(item2.id));
                  }
                );

                let check = notIn(this.selectedTag, this.cgpTagData);
                this.selectedTag = this.selectedTag.filter(function(obj: any) {
                  return check.indexOf(obj) == -1;
                });
              }
            }, 100);
          }


      }
    }, errors => {
      this.cgpTagData = [];
      console.log(errors);
    });
  }


  // cgpPracticalInfoForm Update based on index position in start or end time
  onFocusCGPPracticalInfo(index: number, event: any, type: number){
    // console.log(event.value)
    type === 1 ? (this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].startTime = event.value) : this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].endTime = event.value;

    if(this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].endTime && (this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].endTime < this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].startTime)) {
      // this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].endTime = this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].startTime;
      console.log(this.cgpPracticalInfoForm.value.cgpPracticalInfo[index].endTime)
      this.Timeerr[index] = 1;
    }else{
      this.Timeerr[index] = '';
    }
  }

  // client check and uncheck the form
  onChangeCGPCCustomerhecked(index: number, event: any, user: any){
      this.cgpCustomerForm.value.cgpCustomerValue[index].active = event.target.checked;
  }


  get cgpPracticalInfoValue() {
    return this.cgpPracticalInfoForm.controls.cgpPracticalInfo.value;
  }

  get cgpCustomerInfoValue() {
    return this.cgpCustomerForm.controls.cgpCustomerValue.value;
  }

  get cgpSpecialityInfoValue() {
    return this.cgpSpecialityForm.controls.cgpSpecialityValue.value;
  }

  get cgpPartnerInfoValue() {
    return this.cgpPartnerForm.controls.cgpPartnerValue.value;
  }

  get cgpSubtopicInfoValue() {
    return this.cgpSubtopicForm.controls.cgpSubtopicValue.value;
  }

  get cgpTagInfoValue() {
    return this.cgpTagForm.controls.cgpTagValue.value;
  }

getInitialCGPInformation(id: string): void {
  const data = {
    latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
    longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
    distance: 45
  };
  this.ngxLoader.startLoader('loader-cgp');
  this.cgpService.getCGPEmailInformation(id, data).subscribe((response) => {

      if (response.data != null){
        this.cgpId = response.data.id;
        this.getArticlesList('all');
        this.viewCGPInfoDetails = response.data;
        this.latitude = this.viewCGPInfoDetails.geoLocation ? this.viewCGPInfoDetails.geoLocation.coordinates[0] : '';
        this.longitude = this.viewCGPInfoDetails.geoLocation ? this.viewCGPInfoDetails.geoLocation.coordinates[1] : '';
        this.viewCGPPracticalInfoDetails = response.data.cgpPracticalInfo;
        this.viewCGPTeamInfoDetails = response.data.cgpTeams;
        this.viewCGPSpecialitiesDetails  = response.data.cgpSpecialities;
        this.subTopicsAndTagsList();
        this.viewCGPSubtopicDetails  = response.data.cgpSubtopics;
        this.viewCGPTagDetails  = response.data.cgpTags;
        this.countteam = response.data.cgpTeams.length;
        if (response.data.website){
        if (response.data.website.substring(0, 4).toLowerCase() == 'http' || response.data.website.substring(0, 4).toLowerCase() == 'https')
        {
          this.website = response.data.website;
        } else{
          this.website = '//' + response.data.website;
        }
        }

        this.labelOptions = {
          color: '#CC0000',
          fontFamily: '',
          fontSize: '12px',
          fontWeight: 'bold',
          text: this.viewCGPInfoDetails.establishmentName,
          };
        this.icon = {
        labelOrigin: { x: 16, y: 47 },
        url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png'
      };

      //// Customer details View
        this.viewCGPCustomerInfoDetails  = this.cgpCustomerData.filter(function(array_el){
        return response.data.cgpClients.filter(function(anotherOne_el: { clientId: any; }){
          return anotherOne_el.clientId == array_el.id;
        }).length == 1;
      });

        //// Partner details View
        this.viewCGPPartnersDetails  = this.cgpPartnerData.filter(function(array_el){
          return response.data.cgpPartners.filter(function(anotherOne_el: { partnerId: any; }){
            return anotherOne_el.partnerId == array_el.id;
          }).length == 1;
        });

      //// CGP details View
        const cgpInfoData = {
        establishmentName: response.data.establishmentName,
        companyAddress: response.data.companyAddress,
        foundedYear: response.data.foundedYear,
        website: response.data.website,
        bannerImage: response.data.bannerImage,
        addressComplement: response.data.addressComplement,
        addressType: response.data.addressType,
        addressNumber: response.data.addressNumber,
        addressStreet: response.data.addressStreet,
        city: response.data.city,
        country: response.data.country,
        postalCode: response.data.postalCode,
      };
        this.cgpInfoForm = this.formBuilder.group(cgpInfoData);
    }
      this.ngxLoader.stopLoader('loader-cgp');
    }, errors => {
       console.log(errors);
    });
 }

  subTopicsAndTagsList() {
    for (const data of this.viewCGPSpecialitiesDetails) {
      this.getAllSubtopic(data.specialties.id, false, 'edit');
      this.getAllTags(data.specialties.id, false, 'edit');
    }
  }


  // get Cgp practical information and social medial details
  getCGPPracticalInformation(cgpId: string): void {

    this.cgpService.getCGPPracticalInformatio(cgpId).subscribe((response) => {
        if (response.data !== undefined && response.data !== null){
          // response practical info to loop  the value in update practicalInfoData
          const cgpPracticalInfoArray: any[] = [];
          this.practicalInfoData.forEach(element => {
            response.data.cgpPracticalInfo.forEach((cgpPracticalDBValue: { dayName: string, startTime: string, endTime: string}) => {
              if (element.dayName === cgpPracticalDBValue.dayName){
                cgpPracticalInfoArray.push(this.initCGPPracticalInformation(cgpPracticalDBValue.dayName, cgpPracticalDBValue.startTime, cgpPracticalDBValue.endTime, element.language, cgpId));
              }
            });

          });
          if (cgpPracticalInfoArray.length > 0){
            this.cgpPracticalInfoForm = this.formBuilder.group({
              linkedIn: response.data.linkedIn,
              facebook: response.data.facebook,
              twitter: response.data.twitter,
              instagram: response.data.instagram,
              youtube: response.data.youtube,
              cgpId: response.data.cgpId,
              datevalidate: '',
              cgpPracticalInfo: this.formBuilder.array(cgpPracticalInfoArray)
            });
          }
        }
    }, errors => {
        console.log(errors);
    });
  }

  // get service cgp Team Info details
  getCGPTeamInformation(cgpTeamId: string, cgpId: string): void{
    this.teamurl = '';
    this.checkaddress = false;
    if (cgpTeamId){
     this.cgpService.getCGPTeamInfomation(cgpTeamId, cgpId).subscribe((response) => {
        if (typeof response.data !== undefined && response.data !== null){
          const cgpTeamData = {
            cgpTeamInfoId: response.data.id,
            cgp: cgpId,
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            // role: response.data.role,
            email: response.data.email,
            designation: response.data.designation,
            description: response.data.description !== 'null' ? response.data.description : '',
            bannerUrl: response.data.bannerUrl,
            addressComplement: response.data.addressComplement !== 'null' ? response.data.addressComplement : '',
            addressType: response.data.addressType !== 'null' ? response.data.addressType : '',
            addressNumber: response.data.addressNumber,
            addressStreet: response.data.addressStreet,
            city: response.data.city,
            country: response.data.country,
            postalCode: response.data.postalCode,
          };
          console.log(response)
          if(!response.data.city){
            this.checkaddress = true;
          }
          console.log(this.checkaddress)
          this.cgpTeamInfoForm = this.formBuilder.group(cgpTeamData);
          if (response.data.bannerUrl){
          this.teamurl = response.data.bannerUrl;
          }
        }
    }, errors => {
      console.log(errors);
    });
  }else{
    this.teamurl = 'assets/images/cgp-header.png';
    this.cgpTeamInfoForm.reset();

  }

  }

  // get service CGP Description of Presentation
  getCGPPresentation(cgpId: string): void {
        this.cgpService.getCGPPresentation(cgpId).subscribe((response) => {
          if (typeof response.data !== undefined && response.data !== null){
            const cgpPresentationData = { cgpId: response.data.cgpId, presentationText: response.data.presentationText};
            this.cgpPresentationForm = this.formBuilder.group(cgpPresentationData);
          }
        }, errors => {
          console.log(errors);
        });
  }


  // get service cgp Client data
  getCGPCustomerInformation(cgpId: string): void {
    this.cgpService.getCGPCustomerInformation(cgpId).subscribe((response) => {
      if (response.data !== undefined && response.data !== null){
        this.cgpCustomerForm.value.cgpCustomerValue.forEach((element: { customer_type: string; id: string, active: boolean, cgp: any  }) => {
          response.data.forEach((customerValue: { clientId: string }) => {
             if (element.id == customerValue.clientId) {
              element.id == customerValue.clientId;
              element.active = true;
             }

          });
        });

      }
    }, errors => {
      console.log(errors);
    });
  }

  // get service cgp Speciality data
  getCGPSpecialityInformation(cgpId: string): void {

        this.selectedSpeciality = this.cgpSpecialityData.filter((array_el) => {
          return this.viewCGPSpecialitiesDetails.filter(function(anotherOne_el: { id: any, specialties: any; }){
             return anotherOne_el.specialties.id == array_el.id;
          }).length == 1;
       });

        this.selectedSubtopic = this.cgpSubtopicData.filter((array_el) => {
          return this.viewCGPSubtopicDetails.filter(function(anotherOne_el: { id: any, subtopics: any; }){
             return anotherOne_el.subtopics.id == array_el.id;
          }).length == 1;
       });

        this.selectedTag = this.cgpTagData.filter((array_el) => {
          return this.viewCGPTagDetails.filter(function(anotherOne_el: { id: any, subtopicTags: any; }){
             return anotherOne_el.subtopicTags.id == array_el.id;
          }).length == 1;
       });


  }


  // get service cgp Partner data
  getCGPPartnerInformation(cgpId: string): void {
    this.cgpService.getCGPPartnerInformation(cgpId).subscribe((response) => {
      if (response.data !== undefined && response.data !== null){
        this.selectedPartner = this.cgpPartnerData.filter(function(array_el){
          return response.data.filter(function(anotherOne_el: { partnerId: any; }){
             return anotherOne_el.partnerId == array_el.id;
          }).length == 1;
       });
      }
    }, errors => {
      console.log(errors);
    });
  }


  getCGPImage(bannerURL: string, logo: string){
    if (bannerURL){
      this.url = bannerURL;
    }else{
      this.url = 'assets/images/cgp-header.png';
    }
    if (logo){
      this.url_logo = logo;
    }else{
      this.url_logo = 'assets/images/Mask-Group.png';
    }
  }


  // update CGP-Info value
  onUpdateCGPInfo(cgpId: string): void {
    this.submitCGPAttempt = true;
    if (this.cgpInfoForm.valid) {
      const cgpPreparedValuesSpeciality: any = [];
      const cgpPreparedValuesSubtopic: any = [];
      const cgpPreparedValuesTag: any = [];
      this.selectedSpeciality.forEach((element: {  specialty_name: string; id: string, active: boolean  }) => {
        cgpPreparedValuesSpeciality.push(element.id);
      });
      this.selectedSubtopic.forEach((element: {  subtopicTitle: string; id: string, active: boolean  }) => {
        cgpPreparedValuesSubtopic.push(element.id);
      });
      this.selectedTag.forEach((element: {  tagTitle: string; id: string, active: boolean  }) => {
        cgpPreparedValuesTag.push(element.id);
      });
      const cgpInfoFormvalue = {
      specialities: cgpPreparedValuesSpeciality
    };
      const cgpInfoSubtopicValue = {
      subtopics: cgpPreparedValuesSubtopic
    };
      const cgpInfoTagValue = {
      tags: cgpPreparedValuesTag
    };
      const addresstype = (this.cgpInfoForm.value.addressType) ? this.cgpInfoForm.value.addressType + ' ' : '';
      const addresscom =  (this.cgpInfoForm.value.addressComplement && this.cgpInfoForm.value.addressComplement !== '0') ? '(' + this.cgpInfoForm.value.addressComplement + ')' + ' ' : '';

      this.cgpInfoForm.value.companyAddress = this.cgpInfoForm.value.addressNumber + ', ' + addresstype + '' + this.cgpInfoForm.value.addressStreet + ' ' + this.cgpInfoForm.value.postalCode + ' ' + addresscom + this.cgpInfoForm.value.city + ', ' + this.cgpInfoForm.value.country;

      this.cgpService.updateCGPInfo(this.cgpInfoForm.value, cgpId).subscribe((response) => {
      this.cgpService.updateCGPSpecialityInfoService(cgpInfoFormvalue, cgpId).subscribe((response) => {
        this.cgpService.updateCGPSubtopicInfoService(cgpInfoSubtopicValue, cgpId).subscribe((response) => {
          this.cgpService.updateCGPTagInfoService(cgpInfoTagValue, cgpId).subscribe((response) => {
        this.getInitialCGPInformation(this.cgpId);
            this.cgpSubtopicForm = this.formBuilder.group({
              cgpSubtopicValue: this.formBuilder.array([])
            });

            this.cgpTagForm = this.formBuilder.group({
              cgpTagValue: this.formBuilder.array([])
            });
            this.cgpSubtopicData = this.cgpTagData = [];
        this.modalClose.nativeElement.click();
        this.submitCGPAttempt = false;
      });
    });
  });
    },
        err => {
          const title = 'CGP-REGISTER.request';
          const message = 'SERVER-RESPONSE.' + err.message.message;
          this.sweetAlertService.showSwalError(title, message);
        });
  }
  }

    // update cgp practical info value
  onUpdateCGPPracticalInfo(cgpId: string): void {
    for (const val of this.cgpPracticalInfoForm.value.cgpPracticalInfo) {
      if (val.startTime || val.endTime){
        this.cgpPracticalInfoForm.get('datevalidate')?.clearValidators();
        this.cgpPracticalInfoForm.get('datevalidate')?.updateValueAndValidity();
      }
    }
    this.submitCGPPracticalAttempt = true;
    if (this.cgpPracticalInfoForm.valid) {
    this.cgpPracticalInfoForm.value.cgpPracticalInfo.forEach((element: { cgp: any}) => {
      element.cgp = cgpId;
    });
    this.cgpService.updateCGPPracticalInfoService(this.cgpPracticalInfoForm.value, cgpId).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
      this.modalClosePractical.nativeElement.click();
      this.submitCGPPracticalAttempt = false;
     });
    }
  }

    // update CGP-TeamInfo value
  onUpdateCGPTeamInfo(cgpId: string): void {
    this.submitCGPTeamAttempt = true;
    if (this.cgpTeamInfoForm.valid && this.cgpTeamInfoForm.value.firstname.length > 1 && this.cgpTeamInfoForm.value.lastname.length > 1) {
    const cgpTeamvalues = new FormData();
    console.log(this.cgpTeamInfoForm.value);
    cgpTeamvalues.append('cgpId', cgpId);
    cgpTeamvalues.append('firstname', this.cgpTeamInfoForm.value.firstname);
    cgpTeamvalues.append('lastname', this.cgpTeamInfoForm.value.lastname);
    // cgpTeamvalues.append('role', this.cgpTeamInfoForm.value.role);
    cgpTeamvalues.append('email', this.cgpTeamInfoForm.value.email);
    cgpTeamvalues.append('designation', this.cgpTeamInfoForm.value.designation);
    cgpTeamvalues.append('description', this.cgpTeamInfoForm.value.description);
    cgpTeamvalues.append('bannerImage', this.selectedFile);
    cgpTeamvalues.append('addressComplement', this.cgpTeamInfoForm.value.addressComplement);
    cgpTeamvalues.append('addressType', this.cgpTeamInfoForm.value.addressType);
    cgpTeamvalues.append('addressNumber', this.cgpTeamInfoForm.value.addressNumber);
    cgpTeamvalues.append('addressStreet',this.cgpTeamInfoForm.value.addressStreet);
    cgpTeamvalues.append('city', this.cgpTeamInfoForm.value.city);
    cgpTeamvalues.append('country', this.cgpTeamInfoForm.value.country);
    cgpTeamvalues.append('postalCode', this.cgpTeamInfoForm.value.postalCode);

    const addresstype = (this.cgpTeamInfoForm.value.addressType) ? this.cgpTeamInfoForm.value.addressType + ' ' : '';
    const addresscom =  (this.cgpTeamInfoForm.value.addressComplement && this.cgpInfoForm.value.addressComplement !== '0') ? '(' + this.cgpTeamInfoForm.value.addressComplement + ')' + ' ' : '';

    this.cgpTeamInfoForm.value.address = this.cgpTeamInfoForm.value.addressNumber + ', ' + addresstype + '' + this.cgpTeamInfoForm.value.addressStreet + ' ' + this.cgpTeamInfoForm.value.postalCode + ' ' + addresscom + this.cgpTeamInfoForm.value.city + ', ' + this.cgpTeamInfoForm.value.country;

    cgpTeamvalues.append('address', this.cgpTeamInfoForm.value.address);

    if (this.cgpTeamInfoForm.value.cgpTeamInfoId){
    this.cgpService.updateCGPTeamService(cgpTeamvalues, this.cgpTeamInfoForm.value.cgpTeamInfoId).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
      this.modalCloseTeam.nativeElement.click();
      this.submitCGPTeamAttempt = false;
      this.cgpTeamInfoForm.reset();
      this.selectedFile = null;

      // this.cgpService.updateUserInfomation(this.cgpTeamInfoForm.value).subscribe((response) => {
      //   const data = JSON.parse(this.sessionService.getLocal('user'));
      //   data.firstName = this.cgpTeamInfoForm.value.firstName;
      //   data.lastName = this.cgpTeamInfoForm.value.lastName;
      //   this.sessionService.setLocal('user', JSON.stringify(data));
      //   this.reloadComponent();
      // });

    });
  }else{
    this.cgpService.createCGPTeamService(cgpTeamvalues).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
      this.modalCloseTeam.nativeElement.click();
      this.submitCGPTeamAttempt = false;
      this.cgpTeamInfoForm.reset();
    });
  }
  }
  }

  // reloadComponent() {
  //   const currentUrl = this.router.url;
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //   this.router.onSameUrlNavigation = 'reload';
  //   this.router.navigate([currentUrl]);
  // }

  teamValidation(email: any): void {
    this.cgpService.teamEmailValidation(email.value, this.cgpTeamInfoForm.value.cgpTeamInfoId).subscribe((response) => {
      this.emailValidate = response.status != '200';
      console.log(this.emailValidate)
    });

  }

  // update cgp presentation the description service
  onUpdateCGPPresentation(cgpId: string): void {
    this.submitCGPPresentationAttempt = true;
    if (this.cgpPresentationForm.valid) {
    this.cgpService.updateCGPPresentationService(this.cgpPresentationForm.value, cgpId).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
      this.modalCloseDesc.nativeElement.click();
      this.submitCGPPresentationAttempt = false;
    });
    }
  }

  // update cgp CLient Details
  onUpdateCGPClientInformation(cgpId: string): void {
    const cgpClientPreparedValues: any = [];
    this.cgpCustomerForm.value.cgpCustomerValue.forEach((element: { customer_type: string; id: string, active: boolean, cgp: any  }) => {
      if (element.active === true){
        element.cgp = cgpId;
        cgpClientPreparedValues.push(element.id);

      }
    });
    this.cgpService.updateCGPClientInfoService({ clients: cgpClientPreparedValues}, cgpId).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
    });
  }

  onUpdateCGPPartnerInformation(cgpId: string): void {
    const cgpPartnerPreparedValues: any = [];
    this.selectedPartner.forEach((element: {  partner_name: string; id: string, active: boolean  }) => {
      cgpPartnerPreparedValues.push(element.id);
    });
    this.cgpService.updateCGPPartnerInfoService({ partners: cgpPartnerPreparedValues}, cgpId).subscribe((response) => {
      this.getInitialCGPInformation(this.cgpId);
    });
  }

  //////// Company banner Image change ////


onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const FileSize = event.target.files[0].size / 1024 / 1024; // in MB
      if (FileSize > 1) {
           alert('File size exceeds 1 MB');
           return;
       }
      const image = event.target.files[0];
      this.ng2ImgMax.resizeImage( image, 768, 262).subscribe(
        result => {
          this.selectedFile = new File([result], result.name);
          reader.readAsDataURL(result); // read file as data url
        },
        error => {
          console.log('Oh no!', error);
        }
      );

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      };
    }
}

onSelectFileLogo(event: any) {
  if (event.target.files && event.target.files[0]) {

    const FileSize = event.target.files[0].size / 1024 / 1024; // in MB
    if (FileSize > 1) {
         alert('File size exceeds 1 MB');
         return;
     }
    this.imageChangedEvent = event;

  }
}

onSelectFileTeam(event: any) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();

    const FileSize = event.target.files[0].size / 1024 / 1024; // in MB
    if (FileSize > 1) {
         alert('File size exceeds 1 MB');
         return;
     }
    const image = event.target.files[0];
    this.ng2ImgMax.resizeImage( image, 267, 188).subscribe(
      result => {
        this.selectedFile = new File([result], result.name);
        reader.readAsDataURL(result); // read file as data url
      },
      error => {
        console.log('Oh no!', error);
      }
    );

    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.teamurl = event.target.result;
      this.cgpTeamInfoForm.patchValue({
        bannerUrl: this.teamurl
      });
    };
  }
}


onUpdateCGPImageInfo(cgp: any){
  if (this.selectedFile){
    const uploadBanner = new FormData();
    uploadBanner.append('bannerImage', this.selectedFile);
    this.cgpService.updateCGPBannerImage(uploadBanner, this.cgpId).subscribe((response) => {
      this.selectedFile = null;
      this.getInitialCGPInformation(this.cgpId);
    }); }
  if (this.selectedFile_logo){
    const uploadLogo = new FormData();
    uploadLogo.append('logo', this.selectedFile_logo);
    this.cgpService.updateCGPLogoImage(uploadLogo, this.cgpId).subscribe((response) => {
      this.selectedFile_logo = null;
      this.getInitialCGPInformation(this.cgpId);
    });
    this.imageChangedEvent = '';
    }
  }

  showMoreItems(){
      this.paginationLimit = Number(this.paginationLimit) + 3;
   }

   showLessItems() {
     this.paginationLimit = Number(this.paginationLimit) - 3;
   }

   addTagFn(specialtyName: any) {
      return { specialtyName, tag: true };
    }

  getArticlesList(type: string) {

    this.strapiService.cgpArticles(this.cgpId, 8, type).subscribe((res: any) => {
        this.articlesList = res.data;
      },
      (err: any) => {
      });
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

  apiLoader(){
    this.apiloader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.address = place.formatted_address;
          });
        });
      });
  }

  setLocation(longitude: any, latitude: any){
    this.apiloader.load().then(() => {
      const geocoder = new google.maps.Geocoder;
      const latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({location: latlng}, (results: any) => {
          if (results[0]) {
            this.sessionService.setLocal('cur_location', JSON.stringify({address: results[0].formatted_address, lat: latitude, lon: longitude}));
            this.sessionService.setLocal('location', JSON.stringify({address: results[0].formatted_address, lat: latitude, lon: longitude}));

            if (JSON.parse(this.sessionService.getLocal('user')) !== null){
              this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
              this.getInitialCGPInformation(JSON.parse(this.sessionService.getLocal('user')).cgpId);
            }else{
              this.getInitialCGPInformation(this.cgpId);
            }

          } else {
            console.log('Not found');
          }
      });
    });
  }

  validateAddress(){
    this.latitude = this.latitude ? this.latitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lat : 49.611622);
    this.longitude = this.longitude ? this.longitude : (JSON.parse(this.sessionService.getLocal('location')) ? JSON.parse(this.sessionService.getLocal('location')).lon : 6.131935);
    const data = {
      latitude: this.latitude,
      longitude: this.longitude,
      distance: this.value
    };
    this.sessionService.setLocal('location', JSON.stringify({address: this.address, lat: this.latitude, lon: this.longitude}));
    this.getInitialCGPInformation(this.cgpId);
    this.modalLocationClose.nativeElement.click();
    this.search_clear = '';
  }


  clickedMarker(){
    window.open('https://www.google.com/maps/search/?api=1&query=' + this.latitude + ',' + this.longitude, '_blank');
  }


    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.selectedFile_logo = this.base64ToFile(
          event.base64,
          'filename.png',
        );
    }

    base64ToFile(data: any, filename: any) {

      const arr = data.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--){
          u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    }

      zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    gotoURL(url:any){
      // let fb:any = 'fb://';
      // setTimeout(function () { window.open(url,"_blank"); }, 25);
      // window.location = fb;
      window.open(url, '_system');
    }

  ngOnDestroy() {
    this.modalClose.nativeElement.click();
    this.modalCloseDesc.nativeElement.click();
    this.modalClosePractical.nativeElement.click();
    this.modalCloseTeam.nativeElement.click();
    this.modalLocationClose.nativeElement.click();
  }

  changeAddress(event:any){
    if(event.target.checked == true){
      this.cgpTeamInfoForm.patchValue({
        "addressComplement" : '',
        "addressType" : '',
        "addressNumber" : '',
        "addressStreet" : '',
        "city" : '',
        "country" : '',
        "postalCode" : ''});
        this.checkaddress = true;
    }else{
      this.cgpTeamInfoForm.patchValue({
        "addressComplement" : '',
        "addressType" : '',
        "addressNumber" : '',
        "addressStreet" : '',
        "city" : '',
        "country" : '',
        "postalCode" : ''});
      this.checkaddress = false;
    }
  }

  }
