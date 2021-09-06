import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { MessageService as MsgServ } from 'src/app/services/message.service';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { User } from 'src/app/models/User';
import { Ticket } from 'src/app/models/Ticket';
import { Service } from 'src/app/models/Service';
import { Sujet } from 'src/app/models/Sujet';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit {
  showFormUpdate: boolean = false;
  currentComment = null;
  serviceList: any[] = [];
  sujetList: any[] = [];
  listServices: Service[];
  listSujets: Sujet[] = [];
  listSujetSelected: any[] = [];

  queueList: Ticket[] = [];
  AccAffList: Ticket[] = [];
  allTickets: Ticket[] = [];

  userList: User[] = [];
  userDic: any[] = [];
  serviceDic: any[]=[]

  draggedTicket: Ticket;
  selectedUser: User;

  showForm: string = "Ajouter";
  showDropDown: Ticket;
  isReponsable: boolean = true;
  isModify: Ticket;
  showFormAddComment: boolean = false;

  comments: any = [];
CommentList = [];
  CommentShow = [];
  commentForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    user_id: new FormControl('',[Validators.required]),
    ticket_id: new FormControl('',[Validators.required]),
  });

  dragStart(event, ticket: Ticket) {
    this.draggedTicket = ticket;
  }

  dragEnd(event) {
    this.draggedTicket = null;
  }

  //QueueToAccAff
  dragQueueToAccAff(event?) {
    this.queueList.splice(this.queueList.indexOf(this.draggedTicket), 1)
    this.Accepted(this.draggedTicket)
  }

  /*AccAffToAll
  dragPreInscritToInscrit(event?) {
    this.AccAffList.splice(this.AccAffList.indexOf(this.draggedTicket), 1)
    this.allTickets.push(this.draggedTicket)
  }

  //AllToQueue
  dragInscritToList(event?) {
    this.allTickets.splice(this.allTickets.indexOf(this.draggedTicket), 1)
    this.queueList.push(this.draggedTicket)
  }*/

  constructor(private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private router: Router,
     private AuthService: AuthService, private messageService: MessageService,private MsgServ : MsgServ) { }

  ngOnInit(): void {
    let token = jwt_decode(localStorage.getItem("token"))
    if (token == null) {
      this.router.navigate(["/login"])
    } else if (token["role"].includes("responsable")) {
      //this.router.navigate(["/ticket/suivi"])
      this.isReponsable = true;
    } else if (!token["role"].includes("agent")) {
      //this.router.navigate(["/ticket/suivi"])
    }

    this.ServService.getDic().subscribe((data)=>{
      this.serviceDic=data;
    })
    
    this.TicketService.getQueueByService(token['service_id']).subscribe((data) => {
      if (!data.message) {
        this.queueList = data.TicketList;
      }
    })
    this.ServService.getAll().subscribe((data) => {
      this.listServices = data;
      if (!data.message) {
        data.forEach(element => {
          this.listSujetSelected[element._id] = [];
          this.serviceList[element._id] = element.label;
        });
        this.SujetService.getAll().subscribe((data) => {
          this.listSujets = data;
          if (!data.message) {
            data.forEach(sujet => {
              this.listSujetSelected[sujet.service_id].push(sujet);
              this.sujetList[sujet._id] = { "label": sujet.label, "service_id": sujet.service_id, "_id": sujet._id };
            });
          }
        })
      }
    })

    //getAccAffByService
    this.TicketService.getAccAff(token["id"]).subscribe((data) => {
      if (!data.message) {
        this.AccAffList = data;
      }
    })

    this.AuthService.getAll().subscribe((data) => {
      if (!data.message) {
        data.forEach(user => {
          this.userDic[user._id] = null;
          this.userDic[user._id] = user;
        });
        this.userList = data;
      }
    })


    /*TODO Token['service']
    this.AuthService.getAllByService('61279209649616413cda8a3d').subscribe((data) => {
      if(!data.message){
        this.userList = data;
      }
    })*/

    this.TicketService.getTicketsByService(token['service_id']).subscribe((data) => {
      if (!data.message) {
        this.allTickets = data.TicketList;
      }
    })
  }

  //QueueToAccAff
  QueueToAccAff(user, event?) {
    this.queueList.splice(this.queueList.indexOf(user), 1)
    this.Accepted(user)
  }

  /*AccAffToAll
  PreInscritToInscrit(user, event?) {
    this.AccAffList.splice(this.AccAffList.indexOf(user), 1)
    this.allTickets.push(user)
  }

  //AllToQueue
  InscritToList(user, event?) {
    this.allTickets.splice(this.allTickets.indexOf(user), 1)
    this.queueList.push(user)
  }*/

  Accepted(rawData) {
    let data = {
      id: rawData._id,
      agent_id: jwt_decode(localStorage.getItem("token"))['id'],
      isAffected: false
    }
    this.TicketService.setAccAff(data).subscribe((res) => {
      this.AccAffList.push(res)
      this.allTickets.push(res)
    }, (error) => {
      console.log(error)
    })
  }

  showDropdownUser(rawData) {
    this.showDropDown = (this.showDropDown) ? null : rawData;
  }

  Affected() {
    let data = {
      id: this.showDropDown._id,
      agent_id: this.selectedUser._id,
      isAffected: true
    }
    this.TicketService.setAccAff(data).subscribe((data) => {
      this.queueList.splice(this.queueList.indexOf(this.showDropDown), 1)
      if (this.selectedUser._id == jwt_decode(localStorage.getItem("token"))["id"]) {
        this.AccAffList.push(data)
      }
      this.allTickets.push(data)
      this.showDropDown = null;
    }, (error) => {
      console.error(error)
    })
  }

  TicketForm: FormGroup = new FormGroup({
    sujet: new FormControl('', Validators.required),//Il doit forcément selectionner
    service: new FormControl('', Validators.required),
  })

  modify(data) {
    console.log(data)
    this.listServices.forEach(element => {
      if (element._id == this.sujetList[data.sujet_id].service_id) {
        this.TicketForm.patchValue({ service: element })
      }
    });
    this.listSujets.forEach(element => {
      if (element._id == data.sujet_id) {
        this.TicketForm.patchValue({ sujet: element })
        console.log(this.TicketForm.value)
      }
    });

    this.isModify = (this.isModify) ? null : data;
  }



  modifyTicket() {
    //Modification du Ticket
    let req = {
      id: this.isModify._id,
      sujet_id: this.TicketForm.value.sujet._id
    }
    this.TicketService.changeService(req).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Modification du Ticket', detail: 'Modification réussie' });
      /*TODO If service_id == data --> push
      if(this.sujetList[data.sujet_id].service_id==token.service_id){
        this.queueList.splice(this.queueList.indexOf(this.isModify),1,data)
      }*/
      this.queueList.splice(this.queueList.indexOf(this.isModify), 1)
      this.isModify = null;
      this.toggleFormUpdate();
    }, (error) => {
      console.log(error)
    });

  }


  onChange() {
    this.TicketForm.patchValue({
      sujet: this.listSujetSelected[this.TicketForm.value.service._id][0]
    })
  }

  showWaitingTime(rawData) {
    let calc = new Date(new Date().getTime() - new Date(rawData.date_ajout).getTime())
    let days = calc.getUTCDate() - 1
    let Hours = calc.getUTCHours()
    let minutes = calc.getUTCMinutes()
    if (days == 0) {
      return Hours.toString() + " h " + minutes + " min"
    }
    return days.toString() + Hours + " h " + minutes + " min "

  }

  showWorkingTime(rawData) {
    let calc = new Date(new Date().getTime() - new Date(rawData.date_affec_accep).getTime())
    let days = (calc.getUTCDate() - 1 > 0) ? "" + (calc.getUTCDate() - 1) + " j " : " ";
    let Hours = calc.getUTCHours();
    let minutes = calc.getUTCMinutes();

    return days.toString() + Hours + " h " + minutes + " min "
  }


  
  toggleFormUpdate() {
    this.isModify = null;
  }


  toggleFormCommentAdd() {
    this.showFormAddComment=!this.showFormAddComment;
    // this.showFormUpdateService=false;
    // this.serviceForm.reset();
  }
  SendComment() {
    let comment = new Comment(this.commentForm.value.description,)

    this.MsgServ.create(comment).subscribe((data) => {
      this.CommentShow.push(data)
      this.CommentList.push(data);
      this.messageService.add({ severity: 'success', summary: 'Gestion de message', detail: 'Creation de message réussie' });
      this.showFormAddComment=false;
      this.commentForm.reset();
    }, (error) => {
      if (error.status == 400) {
        //Bad Request (service deja existant)
        //  this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom du sujet est deja existant'});
      }
      console.log(error)
    });
  }

  Comments() {
    this.MsgServ.getAll()
      .subscribe(
        data => {
          this.comments = data;
        },
        error => {
          console.log(error);
        });
  }
}
