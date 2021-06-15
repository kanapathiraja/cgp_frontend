import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgpService } from '../../../services/cgp.service';
import { SessionService } from '../../../services/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {SweetAlertService} from '../../../services/sweet-alert.service';


@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.scss']
})
export class NewArticleComponent implements OnInit {
  @ViewChild('modalClose') modalClose: any;
  cgpTagData: any[] = [];
  cgpSpecialityData: any[] = [];
  cgpSubtopicData: any[] = [];
  cgpTagForm: FormGroup;
  cgpSpecialityForm: FormGroup;
  cgpSubtopicForm: FormGroup;
  cgpArticleForm!: FormGroup;
  cgpArticleForm2!: FormGroup;
  submitCGPArticle = false;
  submitCGPArticle2 = false;
  cgpSpecialityCheck = false;
  cgpSubtopicCheck = false;
  cgpTagsCheck = false;
  cgpId: any;
  url: any;
  url1: any;
  filename: any;
  selectedFile: any;
  selectedFileURL: any;
  showModal = false;
  selectedSpeciality: any = [];
  selectedSubtopic: any = [];
  selectedTag: any = [];
  article_upload: any;
  article_banner: any;
  type: any;
  articleID: any;
  name: any;
  visual: any;
  ckEditorConfig: any;
  vid: any;
  viewCGPSubtopicDetails: any = [];
  viewCGPTagDetails: any = [];
  viewCGPSpecialitiesDetails: any = [];
  buttonDisable : boolean = false;
  buttonAddDisable : boolean = false;
  errorVideoMsg: boolean =false;
  errorAudioMsg: boolean =false;


  constructor(private router: Router, private formBuilder: FormBuilder,
              private cgpService: CgpService,
              private sessionService: SessionService,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              public ngxLoader: NgxUiLoaderService,
              private ng2ImgMax: Ng2ImgMaxService,
              private sweetAlertService: SweetAlertService) {
      this.type = 'article';
      this.route.params.subscribe(params => {
        this.name = params.name;
      });


      this.initCGPArticlesInfo();
      this.initCGPArticlesInfo2();

      this.cgpSpecialityForm = this.formBuilder.group({
      cgpSpecialityValue: this.formBuilder.array([])
    });

      this.cgpSubtopicForm = this.formBuilder.group({
      cgpSubtopicValue: this.formBuilder.array([])
    });

      this.cgpTagForm = this.formBuilder.group({
        cgpTagValue: this.formBuilder.array([])
      });

      this.url1 = 'assets/images/upload.png';

      this.ckEditorConfig = {
        removePlugins : 'image,pwimage'
       };
    }

  ngOnInit(): void {
    if (JSON.parse(this.sessionService.getLocal('user')) !== null){
      this.cgpId = JSON.parse(this.sessionService.getLocal('user')).cgpId;
      this.getAllSpeciality();
    }
    if (this.name){
      this.getArticleDetails(this.name);
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

  async getAllSpeciality(){
    this.cgpService.getSpecialityByCgp(this.cgpId).subscribe((response) => {
      if (response != null && response.data.length > 0){
        this.cgpSpecialityData = response.data;
        this.cgpSpecialityForm = this.formBuilder.group({
          cgpSpecialityValue: this.formBuilder.array(this.cgpSpecialityData.map(value => {
            return this.initCGPSpecialityInformation(value.specialtyName, value.id, value.active);
          }))
        });
      }
    }, errors => {
      this.cgpSpecialityData = [];
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

          } else {
            this.selectedSubtopic = this.cgpSubtopicData.filter((array_el) => {
              return this.viewCGPSubtopicDetails.filter(function(anotherOne_el: { id: any, subtopics: any; }){
                return anotherOne_el.subtopics.id == array_el.id;
              }).length == 1;
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
          if(type === 'change') {
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
          } else {
            this.selectedTag = this.cgpTagData.filter((array_el) => {
              return this.viewCGPTagDetails.filter(function(anotherOne_el: { id: any, subtopicTags: any; }){
                return anotherOne_el.subtopicTags.id == array_el.id;
              }).length == 1;
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

  initCGPSpecialityInformation(specialtyName: string, id: string, active: boolean) {
    return this.formBuilder.group({
      specialtyName,
      id,
      active: false
    });
  }


  initCGPArticlesInfo(){
    this.cgpArticleForm =  this.formBuilder.group({
        type: ['article'],
        title: ['', Validators.required],
        description: ['', Validators.required],
        articleEditor: ['', Validators.required],
        embedURLVideo: [''],
        embedURLAudio: [''],
        guide_url: ['']
      });
  }

  initCGPArticlesInfo2(){
    this.cgpArticleForm2 =  this.formBuilder.group({
        image_url: ['', Validators.required],
        speciality: [''],
        subtopics: [''],
        tags: ['']
      });
  }

  onInsertArticle(){
    this.submitCGPArticle = true;
    if (this.cgpArticleForm.valid) {
      this.showModal = true;
      this.submitCGPArticle = false;
      if (this.type === 'video' && this.visual === ''){
        this.vid = document.getElementById('videoId');
        this.vid.pause();
        this.vid.currentTime = 0;
        this.errorVideoMsg = false;
      }else if (this.type === 'podcast' && this.visual === ''){
        this.vid = document.getElementById('audioId');
        this.vid.pause();
        this.vid.currentTime = 0;
        this.errorAudioMsg = false;
      }else if (this.visual === 'video-embed' || this.visual === 'audio-embed'){
        const iframes = document.querySelector('iframe');
        if ( iframes ) {
          const iframeSrc = iframes.src;
          iframes.src = iframeSrc;
        }
      }

    }
  }

  onInsertArticle2(){
    this.submitCGPArticle2 = true;
    this.cgpSpecialityCheck = !this.selectedSpeciality.length;
    this.cgpSubtopicCheck = !this.selectedSubtopic.length;
    this.cgpTagsCheck = !this.selectedTag.length;
    if (this.cgpArticleForm2.valid && !this.cgpSpecialityCheck && !this.cgpSubtopicCheck && !this.cgpTagsCheck) {
      this.addEditArticles('publish');
   }
  }
  saveDraft(){
    this.submitCGPArticle = true;
    if (this.cgpArticleForm.valid) {
      this.addEditArticles('draft');
   }
  }

  addEditArticles(status: any){
    const data = {
      title: this.cgpArticleForm.value.title,
      description: this.cgpArticleForm.value.description,
      type: (this.visual) ? this.visual : this.type,
      articleImage: this.article_upload,
      articleUrl: this.article_banner,
      status,
      articleEditor: this.cgpArticleForm.value.articleEditor,
      speciality: this.selectedSpeciality,
      subtopics: this.selectedSubtopic,
      tags: this.selectedTag,
      cgp: this.cgpId
    };
    if (this.articleID){
    this.cgpService.updateCGPArticle(data, this.articleID).subscribe((response) => {
        if (status === 'draft'){
          this.router.navigate(['/cgp/contents'], { fragment: 'tabs-1' }); }else{
            this.router.navigate(['/cgp/contents'], { fragment: 'tabs-2' });
          }
    },
      err => {
        const title = 'CGP.CONTENTS.Contents';
        const message = 'SERVER-RESPONSE.' + err.message;
        this.sweetAlertService.showSwalError(title, message);
      });
  }else{
    this.cgpService.addCGPArticle(data).subscribe((response) => {
      if (status === 'draft'){
        this.router.navigate(['/cgp/contents'], { fragment: 'tabs-1' }); }else{
          this.router.navigate(['/cgp/contents'], { fragment: 'tabs-2' });
        }
    },
      err => {
        const title = 'CGP.CONTENTS.Contents';
        const message = 'SERVER-RESPONSE.' + err.message;
        this.sweetAlertService.showSwalError(title, message);
      });
  }
  }

  goBack(){
    this.showModal = false;
  }

  get cgpSpecialityInfoValue() {
    return this.cgpSpecialityForm.controls.cgpSpecialityValue.value;
  }

  get cgpSubtopicInfoValue() {
    return this.cgpSubtopicForm.controls.cgpSubtopicValue.value;
  }

  get cgpTagInfoValue() {
    return this.cgpTagForm.controls.cgpTagValue.value;
  }

  onSelectFile(event: any, type: any) {

    if (event.target.files && event.target.files[0]) {
       const reader = new FileReader();
       this.selectedFile = event.target.files[0];
       this.filename = event.target.files[0].name;
       if (this.filename.length > 20){
       this.filename = (this.filename.substring( 0, 20)) + '.....' + this.filename.substr(this.filename.lastIndexOf('.') + 1); }
       reader.readAsDataURL(event.target.files[0]); // read file as data url
       reader.onload = (event: any) => { // called once readAsDataURL is completed
             this.url = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
           };

       if (type === 'video'){
          // this.cgpArticleForm.controls.embedURLVideo.disable();
          this.cgpArticleForm.get('embedURLVideo')?.clearValidators();
          this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
          this.visual = '';
          this.cgpArticleForm.controls.embedURLVideo.reset();
          // this.buttonAddDisable = true;
       }else if (type === 'podcast'){
        // this.cgpArticleForm.controls.embedURLAudio.disable();
        this.cgpArticleForm.get('embedURLAudio')?.clearValidators();
        this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
        this.visual = '';
        this.cgpArticleForm.controls.embedURLAudio.reset();
        // this.buttonAddDisable = true;
       }else if (type === 'guide'){
         this.cgpArticleForm.get('guide_url')?.clearValidators();
         this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
       }else if (type === 'article'){
        this.cgpArticleForm.get('embedURLAudio')?.clearValidators();
        this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
        this.cgpArticleForm.get('embedURLVideo')?.clearValidators();
        this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
        this.cgpArticleForm.get('guide_url')?.clearValidators();
        this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
       }
       this.ngxLoader.startLoader('loader-cgp');
       const uploadBanner = new FormData();
       uploadBanner.append('upload', this.selectedFile);
       this.buttonDisable = true;
       this.cgpService.addCGPArticleUpload(uploadBanner).subscribe((response) => {
           this.article_upload = response.file;
           this.ngxLoader.stopLoader('loader-cgp');
           this.buttonDisable = false;
      });

    }
}

onSelectBannerFile(event: any) {

  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    const image = event.target.files[0];
    this.ng2ImgMax.resizeImage( image, 768, 262).subscribe(
        result => {
          this.selectedFileURL = new File([result], result.name);
          reader.readAsDataURL(result); // read file as data url
        },
        error => {
          console.log('Oh no!', error);
        }
      );

    reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url1 = event.target.result;
      };
    const uploadBanner = new FormData();
    uploadBanner.append('upload', image);
    this.buttonDisable = true;
    this.cgpService.addCGPArticleUpload(uploadBanner).subscribe((response) => {
         this.article_banner = response.file;
         this.buttonDisable = false;
    });

    this.cgpArticleForm2.get('image_url')?.clearValidators();
    this.cgpArticleForm2.get('image_url')?.updateValueAndValidity();

  }
}
addTagFn(specialtyName: any) {
  return { specialtyName, tag: true };
  }

  addURL(type: any){
    this.submitCGPArticle = true;
    if(this.cgpArticleForm.value.embedURLAudio || this.cgpArticleForm.value.embedURLVideo){
      this.ngxLoader.startLoader('loader-cgp');
    if (this.cgpArticleForm.valid) {
      if (type === 'podcast-embed'){
        this.visual = 'podcast-embed';
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.cgpArticleForm.value.embedURLAudio);
        this.article_upload = this.cgpArticleForm.value.embedURLAudio;
        this.errorAudioMsg = false;
        this.ngxLoader.stopLoader('loader-cgp');
      }else{
        this.visual = 'video-embed';
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.cgpArticleForm.value.embedURLVideo);
        this.article_upload = this.cgpArticleForm.value.embedURLVideo;
        this.ngxLoader.stopLoader('loader-cgp');
        this.errorVideoMsg = false;
      }
      this.submitCGPArticle = false;
    }
    }else if (this.cgpArticleForm.valid) {
      if (type === 'podcast-embed'){
      this.errorAudioMsg = true;}
      else{
        this.errorVideoMsg = true;
      }
    }

    }

    getArticleDetails(name: any){
      const data = {
        latitude: JSON.parse(this.sessionService.getLocal('location')).lat,
        longitude: JSON.parse(this.sessionService.getLocal('location')).lon,
        distance: 45
      };

      this.cgpService.getCGPArticleDetails(name, data).subscribe((response) => {
         this.type = response.data[0].type;
         this.articleID = response.data[0].id;
         this.viewCGPSpecialitiesDetails = response.data[0].cgpArticlesSpecialities;
         this.viewCGPSubtopicDetails  = response.data[0].cgpArticlesSubtopics;
         this.viewCGPTagDetails  = response.data[0].cgpArticlesTags;

         this.subTopicsAndTagsList(response.data[0].cgpArticlesSpecialities);
         if (response.data[0].articleUrl){
         this.url1 = response.data[0].articleUrl;
         this.cgpArticleForm2.get('image_url')?.clearValidators();
         this.cgpArticleForm2.get('image_url')?.updateValueAndValidity();
        }

         if (response.data[0].type === 'video-embed'){
              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(response.data[0].articleImage);
              this.visual = 'video-embed';
              // this.embedURLVideo = response.data[0].articleImage;
              this.type = 'video';
          }else if (response.data[0].type === 'podcast-embed'){
              this.visual = 'podcast-embed';
              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(response.data[0].articleImage);
              // this.embedURLAudio = response.data[0].articleImage;
              this.type = 'podcast';
          } else if (response.data[0].type === 'guide') {
           this.url = response.data[0].articleImage;
           const fileArray = response.data[0].articleImage.includes('/') ? response.data[0].articleImage.split('/') : response.data[0].articleImage.split('\\');
           const guideName = fileArray[5].split('_');
           this.filename = guideName[1];
           if (this.filename.length > 20){
           this.filename = (this.filename.substring( 0, 20)) + '.....' + this.filename.substr(this.filename.lastIndexOf('.') + 1);
           }
         } else {
              if (response.data[0].articleImage){
                this.url = response.data[0].articleImage;
                this.visual ='';
              }
         }

         const cgpArticleData = {
           title: response.data[0].title,
           description: response.data[0].description,
           type: this.type,
           embedURLAudio: response.data[0].type === 'audio-embed' ? response.data[0].articleImage : '',
           embedURLVideo: response.data[0].type === 'video-embed' ? response.data[0].articleImage : '',
           articleEditor: response.data[0].articleEditor,
           guide_url: ''
         };
         this.cgpArticleForm = this.formBuilder.group(cgpArticleData);


      }, errors => {
        console.log(errors);
     });
    }

  subTopicsAndTagsList(speciality: any) {
    let value = speciality.length;
    this.selectedSpeciality = this.cgpSpecialityData.filter((array_el) => {
      return this.viewCGPSpecialitiesDetails.filter(function(anotherOne_el: { id: any, specialties: any; }){
        return anotherOne_el.specialties.id == array_el.id;
      }).length == 1;
    });
    // for (const element of dataArray) {
    //   this.selectedSpeciality.push(element.specialties);
    // }
    console.log(this.selectedSpeciality)
    for (const [index, data] of speciality.entries()) {
      this.getAllSubtopic(data.specialties.id, index === value - 1, 'edit');
      this.getAllTags(data.specialties.id, index === value - 1, 'edit');
    }
  }

    changeType(type: any){
     this.type = type;
     this.url = '';
     this.visual = '';
     this.cgpArticleForm.patchValue({
      embedURLAudio: '',
      embedURLVideo: ''
    });

     if (type === 'video'){
      this.cgpArticleForm.get('embedURLVideo')?.setValidators([Validators.required]);
      this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLAudio')?.clearValidators();
      this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
      this.cgpArticleForm.get('guide_url')?.clearValidators();
      this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
      this.cgpArticleForm.get('articleEditor')?.clearValidators();
      this.cgpArticleForm.get('articleEditor')?.updateValueAndValidity();
      // this.cgpArticleForm.controls.embedURLVideo.enable();
      // this.buttonAddDisable = false;
     }else if (type === 'podcast'){
      this.cgpArticleForm.get('embedURLAudio')?.setValidators([Validators.required]);
      this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLVideo')?.clearValidators();
      this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
      this.cgpArticleForm.get('guide_url')?.clearValidators();
      this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
      this.cgpArticleForm.get('articleEditor')?.clearValidators();
      this.cgpArticleForm.get('articleEditor')?.updateValueAndValidity();
      // this.cgpArticleForm.controls.embedURLAudio.enable();
      // this.buttonAddDisable = false;
     }else if (type === 'guide'){
      this.cgpArticleForm.get('guide_url')?.setValidators([Validators.required]);
      this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLAudio')?.clearValidators();
      this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLVideo')?.clearValidators();
      this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
      this.cgpArticleForm.get('articleEditor')?.clearValidators();
      this.cgpArticleForm.get('articleEditor')?.updateValueAndValidity();
     }else if (type === 'article'){
      this.cgpArticleForm.get('articleEditor')?.setValidators([Validators.required]);
      this.cgpArticleForm.get('articleEditor')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLAudio')?.clearValidators();
      this.cgpArticleForm.get('embedURLAudio')?.updateValueAndValidity();
      this.cgpArticleForm.get('embedURLVideo')?.clearValidators();
      this.cgpArticleForm.get('embedURLVideo')?.updateValueAndValidity();
      this.cgpArticleForm.get('guide_url')?.clearValidators();
      this.cgpArticleForm.get('guide_url')?.updateValueAndValidity();
     }

    }


}
