import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';


export class Message {
  constructor(
    public message: string,
  ) {  }

}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})


export class MessageComponent implements OnInit, AfterViewInit {
  user: any;
  cgpTeamUser: any;
  conversationList: any;
  messageList: any;
  model = {
    message: ''
  };
  selectedConversation: any;
  reloading = false;
  submitted = false;
  currentDate = new Date();

  constructor(private messageService: MessageService, private ref: ChangeDetectorRef) {
   }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.getTeamUserDetails();
  }

  getTeamUserDetails() {
    this.messageService.getTeamUser(this.user.email).subscribe( (cgpTeamUser) => {
      if(cgpTeamUser) {
        this.cgpTeamUser = cgpTeamUser.data;
        this.getConversationList();
      }
    });


  }


  scrollToElement(): void {
    if(this.messageList && this.messageList.length > 0) {
      let id = 'message'+ this.messageList.length
      let el = document.getElementById(id) as HTMLElement;
      if(el !== null) {
        el.scrollIntoView();
      }
    }

  }


  hoverCard() {
    this.getConversationsCount()
  }


  getConversationsCount() {
    this.messageService.getAllConversationCount().subscribe( (Response)=> {
      console.log('Response', Response)
      this.prepareConversationCount(Response.data);
    }, (error) => {
      console.log(error)
    })
  }

  prepareConversationCount(unreadCountList: any){
    if(unreadCountList && unreadCountList.length > 0) {
      this.conversationList.map((conversionList: any) => {
        var result= unreadCountList.filter((countConversion: any)=> countConversion.conversation_id== conversionList.conversationId);
        if(result.length>0) {
          conversionList.count=result[0].count;
        } else {
          conversionList.count= 0
        }
        return conversionList })
        this.onLoadNext();
    } else {
      this.conversationList.forEach((element: any) => {
        element.count = 0;
      });
      this.onLoadNext();
    }
  }


  getConversationList() {
      this.messageService.getConversationList(this.cgpTeamUser.id).subscribe( (Response)=> {
        console.log('Response', Response)
        this.conversationList = this.prepareConversationLit(Response.data)
        this.onLoadNext();
      }, (error) => {
        console.log(error)
      })
  }

  prepareConversationLit(list: any) {
    let conversationList: any = [];
    list.forEach((conversation: any) => {
       const list = {
         conversationId: conversation.id,
         fromUser:  conversation.users.id == this.user.id ? conversation.users : conversation.cgpTeams,
         toUser:  conversation.users.id == this.user.id ? conversation.cgpTeams : conversation.users,
         count: 0
       }
       conversationList.push(list);
    });
    return conversationList;
  }


  changeConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.getAllConversation(this.selectedConversation.conversationId);
    this.viewAllUserConversation(this.selectedConversation);
  }

  viewAllUserConversation(selectedConversation: any) {
    this.onLoadNext();
    const payload = {
      conversationId: selectedConversation.conversationId,
      fromUserId: selectedConversation.toUser.id
    }
    this.messageService.viewAllUserConversation(payload).subscribe( (Response)=> {
      console.log('Response', Response)
      this.onLoadNextMessage();
    }, (error) => {
      console.log(error)
    })
  }


  onLoadNext(): any {
    this.reloading = true;
    this.ref.detectChanges();
    this.reloading = false;
    this.ref.detectChanges();
  }


  onLoadNextMessage(): any {
    setTimeout(() => {
      this.reloading = true;
    this.ref.detectChanges();
    this.reloading = false;
    this.ref.detectChanges();
    }, 1000);

  }

  get sortData() {
    if(this.messageList && this.messageList.length > 0) {
      return this.messageList.sort((a: any, b: any) => {
        return  <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
      });
    }

  }


  getAllConversation(conversationId:any) {
    this.messageService.getMessageList(conversationId).subscribe( (Response)=> {
      console.log('Response', Response)
      this.messageList = Response.data[0]
      this.onLoadNext();
      this.scrollToElement();
    }, (error) => {
      console.log(error)
    })
  }

  onSubmit(f: NgForm) {
    this.submitted = true;
    if(f.invalid) {
      return
    }
    const message = {
      message: this.model.message,
      fromUserId: this.selectedConversation.toUser.id,
      teamUserId: this.cgpTeamUser.id,
      createdBy:  this.cgpTeamUser.id,
      isReadUser: false,
      isReadTeam: true
    }
    this.messageService.sendMessage(message).subscribe( (Response)=> {
      this.resetUserForm(f);
      if(this.selectedConversation && this.selectedConversation.conversationId !== undefined) {
        // this.viewAllUserConversation(this.selectedConversation);
        // this.getAllConversation(this.selectedConversation.conversationId)
        setTimeout(() => {
          this.getConversationsCount()
          this.changeConversation(this.selectedConversation);
        }, 500);
        // this.viewAllUserConversation(this.selectedConversation);
      } else {
        setTimeout(() => {
          this.getConversationList();
          this.getConversationsCount()
          this.viewAllUserConversation(this.selectedConversation);
        }, 500);

      }
    }, (error) => {
      console.log(error)
    })
  }

  resetUserForm(form: NgForm) {
		form.resetForm();
	}


  ngAfterViewInit() {
    this.scrollToElement();
  }

}
