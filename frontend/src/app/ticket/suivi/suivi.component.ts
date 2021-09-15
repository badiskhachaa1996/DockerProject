import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Ticket } from 'src/app/models/Ticket';
import { Message } from 'src/app/models/Message';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MessageService as MsgService } from 'src/app/services/message.service';
import { saveAs as importedSaveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  [x: string]: any;

  ticketList: Ticket[] = [];
  token: any;
  tickets: any;
  serviceList = [];
  sujetList = [];

  filterService;
  filterSujet;
  filterStatut;

  first = 0;
  rows = 10;
  showForm: string = "Ajouter";
  showFormAdd: boolean = false;
  showFormUpdate: boolean = false;

  selectedService;
  listServices;
  listSujets: any[] = [];

  userDic: any[] = [];

  Ticket: Ticket;
  firstMessage: Message;
  dicIDServices;
  selectedService1;
  listServices1;
  listSujetSelected = [];
  listSujets1: any = [];
  statutList = environment.statut;

  loadingMessage;
  selectedTicket: Ticket;
  showFormAddComment: boolean = false;


  @ViewChild('fileInput') fileInput: ElementRef;
  comments: any = [];

  toggleFormCancel(){
    this.showFormAddComment=!this.showFormAddComment;
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.ticketList ? this.first === (this.ticketList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.ticketList ? this.first === 0 : true;
  }

  constructor( private AuthService: AuthService, private router: Router, private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private messageService: MessageService,private MsgServ:MsgService,private NotifService:NotificationService) { }

  ngOnInit(): void {
    
    this.token = jwt_decode(localStorage.getItem("token"))

    this.Ticket = <Ticket>history.state;

    let token = localStorage.getItem("token")
    if (token == null) {
      this.router.navigate(["/login"])
    }
    this.token = jwt_decode(token);
    this.TicketService.getAllByUser(this.token["id"]).subscribe((data) => {
      this.ticketList = data;
    }, (error) => {
      console.log(error)
    })


    this.AuthService.getAll().subscribe((data) => {
      if (!data.message) {
        data.forEach(user => {
          this.userDic[user._id] = user;
        });
        this.userList = data;
      }
    })

    this.SujetService.getAll().subscribe((data) => {
      if (!data.message) {
        this.filterSujet = data;
        data.forEach(sujet => {
          this.sujetList[sujet._id] = { "label": sujet.label, "service_id": sujet.service_id };
        });
      }
    })


    this.ServService.getAll().subscribe((data) => {
      if (!data.message) {
        //{ label: 'Tous les services', value: null }
        this.filterService = data;
        data.forEach(service => {
          this.serviceList[service._id] = service.label;
        });
      }
    })

    this.ServService.getAll().subscribe((data) => {
      this.listServices = data;
      data.forEach(service => {
        this.listSujets[service._id] = [];
      });
      this.SujetService.getAll().subscribe((data) => {
        data.forEach(sujet => {
          this.listSujets[sujet.service_id].push(sujet);
        });
      })
    }, (error) => {
      console.log(error)
    })
  }

  TicketForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
  })

  TicketForm1: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
  })
  modify(data) {
    this.toggleFormUpdate()
    this.Ticket = data;
    this.ServService.getAll().subscribe((data) => {
      this.listServices1 = data;
      data.forEach(service => {
        this.listSujets1[service._id] = [];
      });

      this.SujetService.getAll().subscribe((data) => {
        data.forEach(sujet => {
          this.listSujets1[sujet.service_id].push(sujet);
          if (sujet._id == this.Ticket.sujet_id) {
            this.listServices1.forEach(serv => {
              if (serv._id == sujet.service_id) {
                this.TicketForm1.patchValue({ service: serv, sujet: sujet,description:this.Ticket.description })
              }
            });
          }
        });
      }, (error) => {
        console.log(error)
      })
    }, (error) => {
      console.log(error)
    })
  }

  modifyTicket() {
    //Modification du Ticket
    let req = {
      id: this.Ticket._id,
      sujet_id: this.TicketForm1.value.sujet._id,
      description: this.TicketForm1.value.description,
    }

    this.TicketService.updateFirst(req).subscribe((data) => {
      this.ticketList.splice(this.ticketList.indexOf(this.Ticket), 1,data);
      this.TicketForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification du ticket', detail: 'Votre ticket a bien été modifié' });
      this.toggleFormUpdate()
    }, (error) => {
      console.log(error)
    });
  }

  toggleFormAdd() {
    console.log(this.TicketForm)
    this.showFormAdd = !this.showFormAdd
    this.showFormUpdate = false;
    this.showFormAddComment=false;


  }
 toggleFormUpdate() {
    this.showFormUpdate = !this.showFormUpdate
    this.showFormAdd = false
   this.showFormAddComment=false;
  }
   

  toggleFormCommentAdd(ticket) {
    this.selectedTicket = ticket;
    this.showFormAddComment = !this.showFormAddComment;
    this.showFormAdd=false;
    this.showFormUpdate = false;
    // this.showFormUpdateService=false;
    // this.serviceForm.reset();
  }

 
  



  addTicket() {
    //Enregistrement du Ticket
    let req = {
      id: jwt_decode(localStorage.getItem("token"))["id"],
      sujet_id: this.TicketForm.value.sujet._id,
      description: this.TicketForm.value.description
    }
    this.TicketService.create(req).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Création du ticket', detail: 'Votre ticket a bien été crée' });
      this.ticketList.push(data.doc)
      this.TicketForm.reset()
      this.TicketForm.setValue({description:null,sujet:'',service:''})
      this.toggleFormAdd()

    }, (error) => {
      console.log(error)
    });

  }

  onChange(event) {
    this.TicketForm.patchValue({
      sujet: this.listSujets[this.TicketForm.value.service._id][0]
    })
  }

  onChange2() {
    this.TicketForm1.patchValue({
      sujet: this.listSujets1[this.TicketForm1.value.service._id][0]
    })
  }

  get description() { return this.TicketForm.get('description'); }

  commentForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    file: new FormControl(''),
    value: new FormControl(null, Validators.maxLength(20000000))
  });

  loadMessages(ticket:Ticket){
    this.comments = []
    this.MsgServ.getAllByTicketID(ticket._id)
    .subscribe(
      data => {
        this.comments = data;
      },
      error => {
        console.log(error);
      });
  }
  SendComment() {
    let isrep;
    if (this.selectedTicket.agent_id!=jwt_decode(localStorage.getItem('token'))['id']) {
        isrep=true

    }

    let comment = {
      description: this.commentForm.value.description,
      id: jwt_decode(localStorage.getItem('token'))['id'],
      ticket_id: this.selectedTicket._id,
      file: this.commentForm.value.file,
      isRep:isrep
      
    }

    this.MsgServ.create(comment).subscribe((data) => {
      this.comments.push(data.doc);
      this.messageService.add({ severity: 'success', summary: 'Gestion de message', detail: 'Votre message a bien été envoyé' });
      this.showFormAddComment = false;
      let agenttoNotif=this.selectedTicket.agent_id ;
      this.selectedTicket = null;
      this.commentForm.reset();
      this.NotifService.create(new Notification(null, data._id, false, "Une reponse a ete publier sur le ticket", null, agenttoNotif)).subscribe((notif) => {
        this.NotifService.newNotif(notif,agenttoNotif)
        console.log(notif)
      }, (error) => {
        console.log(error)
      });
    }, (error) => {
      console.log(error)
    });

  }

  downloadFile(message:Message) {
    this.loadingMessage=message._id;
    this.MsgServ.downloadFile(message._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray],{type:data.documentType}),message.document)
      this.loadingMessage=null;
    }, (error) => {
      console.error(error)
    })
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uplo = file;
    }
    this.onFileChange(event);
  }
  onFileChange(event) {
    let reader = new FileReader();
    if (event.files && event.files.length > 0) {
      this.loading = true
      let file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.commentForm.get('file').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        })
        this.commentForm.get('value').setValue(reader.result.toString().split(',')[1])
        this.loading = false;
      };
    }
  }
  clearFile() {
    this.commentForm.get('file').setValue(null);
    this.commentForm.get('value').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  get value() { return this.commentForm.get('value'); }

}