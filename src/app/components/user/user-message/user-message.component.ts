import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnInit {
  user: any;
  cgpTeamUser: any;
  conversationList: any;
  messageList: any;
  model = {
    message: ''
  };
  selectedConversation: any;
  teamMember: any;
  reloading = false;
  submitted = false;
  constructor(private ref: ChangeDetectorRef,private messageService: MessageService, private sessionService: SessionService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.getTeamUserDetails();
  }

  getTeamUserDetails() {
    const teamUserId = this.sessionService.getLocal('teamUserId');
    this.messageService.getTeamUserById(teamUserId).subscribe( (cgpTeamUser) => {
      if(cgpTeamUser) {
        this.cgpTeamUser = cgpTeamUser.data;
        this.getConversationList();
      }
    });


  }

  hoverCard() {
    this.getConversationsCount()
  }

  getConversationsCount() {
    this.messageService.getAllUserConversationCount().subscribe( (Response)=> {
      console.log('Response', Response)
        this.prepareConversationCount(Response.data);
        this.onLoadNext();
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
          conversionList.count= 0;
        }
        return conversionList })
    } else {
      this.conversationList.forEach((element: any) => {
        element.count = 0;
      });
    }

  }


  getConversationList() {
      this.messageService.getUserConversationList(this.user.id).subscribe( (Response)=> {
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
         fromUser:  conversation.users,
         toUser:  conversation.cgpTeams,
         count: 0
       }
       conversationList.push(list);
    });
    this.getConversationsCount()
    return conversationList;
  }


  changeConversation(conversation: any) {
    this.selectedConversation = conversation;
    this.getAllConversation(this.selectedConversation.conversationId);
    this.viewAllUserConversation(this.selectedConversation);
  }

  viewAllUserConversation(selectedConversation: any) {
    const payload = {
      conversationId: selectedConversation.conversationId,
      fromUserId: selectedConversation.toUser.id
    }
    this.messageService.viewAllTeamConversation(payload).subscribe( (Response)=> {
      console.log('Response', Response)
    }, (error) => {
      console.log(error)
    });
  }

  getAllConversation(conversationId:any) {
    // const conversationId = this.conversationList[0].id
    this.messageService.getMessageList(conversationId).subscribe( (Response)=> {
      console.log('Response', Response)
      this.messageList = Response.data[0]
      this.onLoadNext();

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

  get sortData() {
    if(this.messageList && this.messageList.length > 0) {
      return this.messageList.sort((a: any, b: any) => {
        return  <any>new Date(a.createdAt) - <any>new Date(b.createdAt);
      });
    }

  }

  resetUserForm(form: NgForm) {
		form.resetForm();
	}

  onSubmit(f: NgForm) {
    this.submitted = true;
    if(f.invalid) {
      return
    }
    const message = {
      message: this.model.message,
      fromUserId: this.user.id,
      teamUserId: this.selectedConversation?.toUser?.id ? this.selectedConversation.toUser.id :  this.cgpTeamUser.id,
      createdBy:  this.user.id,
      isReadUser: true,
      isReadTeam: false
    }
    this.messageService.sendMessage(message).subscribe( (Response)=> {
      this.resetUserForm(f);
      if(this.selectedConversation && this.selectedConversation.conversationId !== undefined) {
        setTimeout(() => {
          this.getAllConversation(this.selectedConversation.conversationId)
        this.getConversationsCount()
        this.changeConversation(this.selectedConversation);
        }, 500);

      } else {
        setTimeout(() => {
          this.getConversationList();
          this.getConversationsCount()
        }, 500);

      }
    }, (error) => {
      console.log(error)
    })
  }

}
