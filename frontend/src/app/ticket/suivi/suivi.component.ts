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
import { MessageService, SortEvent } from 'primeng/api';
import { MessageService as MsgService } from 'src/app/services/message.service';
import { saveAs as importedSaveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { FileUpload } from 'primeng/fileupload';
import { SocketService } from 'src/app/services/socket.service';
const io = require("socket.io-client");

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  socket = io("http://localhost:3000");
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
  serviceDic: any[] = []

  userDic: any[] = [];

  Ticket: Ticket;
  firstMessage: Message;
  dicIDServices;
  selectedService1;
  listServices1;
  listSujetSelected = [];
  listSujets1: any = [];

  dropdownService: any[]=[{label:"Tous les services",value:null}];
  showStatut = [
    { label: "Tous les statuts", value: null },
    { label: "File d'attente", value: "Queue d'entrée" },
    { label: 'En cours de traitement', value: 'En cours de traitement' },
    { label: 'En attente d\'une réponse', value: 'En attente d\'une réponse' },
    { label: 'Traité', value: 'Traité' }
  ]

  loadingMessage;
  selectedTicket: Ticket;


  @ViewChild('fileInput') fileInput: FileUpload;
  comments: any = [];

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

  updateList(){
    this.TicketService.getAllByUser(this.token["id"]).subscribe((data) => {
      this.ticketList = data;
      console.log(data)
      this.ticketList.forEach((ticket,index)=>{
        this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
          (sujet)=>{
            ticket["service_id"]=sujet.dataSujet.service_id
            this.ticketList.splice(index,1,ticket)
          }
        )
      })
    }, (error) => {
      console.log(error)
    })
  }

  constructor( private AuthService: AuthService, private router: Router, private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private messageService: MessageService,private MsgServ:MsgService,private NotifService:NotificationService,private Socket:SocketService) { }

  ngOnInit(): void {
    
    this.token = jwt_decode(localStorage.getItem("token"))
    if (this.token == null) {
      this.router.navigate(["/login"])
    }else{
      if (localStorage.getItem('modify') == "true") {
        this.router.navigate(['/profil/creation'])
      }
      this.updateList()

      this.ServService.getDic().subscribe((data) => {
        this.serviceDic = data;
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
          this.filterService = data;
          data.forEach(service => {
            this.dropdownService.push({label:service.label,value:service._id})
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
    this.socket.on("refreshSuivi", () => {
      console.log("REFRESH SUIVI")
      this.updateList()
    })

    this.socket.on("refreshMessage", () => {
      if (this.comments && this.comments.length > 0) {
        this.MsgServ.getAllByTicketID(this.comments[0].ticket_id)
        .subscribe(
          data => {
            this.comments = data;
          },
          error => {
            console.log(error);
          });
      }
    })
    this.updateList()
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

    this.TicketService.update(req).subscribe((data) => {
      this.ticketList.splice(this.ticketList.indexOf(this.Ticket), 1,data);
      this.TicketForm1.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification du ticket', detail: 'Votre ticket a bien été modifié' });
      this.showFormUpdate=false
    }, (error) => {
      console.log(error)
    });
  }

  toggleFormAdd() {
    this.showFormAdd = true
    this.showFormUpdate = false;
    this.selectedTicket=null;
  }
 toggleFormUpdate() {
    this.showFormUpdate = true
    this.showFormAdd = false
   this.selectedTicket=null;
  }
   

  toggleFormCommentAdd(ticket) {
    this.commentForm.reset()
    this.selectedTicket = ticket;
    this.showFormAdd=false;
    this.showFormUpdate = false;
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
      this.updateList()
      console.log("AddNewTicket "+this.TicketForm.value.sujet.service_id)
      this.Socket.AddNewTicket(this.TicketForm.value.sujet.service_id)
      this.TicketForm.reset()
      this.TicketForm.setValue({description:null,sujet:'',service:''})

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
      let agenttoNotif=this.selectedTicket.agent_id ;
      this.selectedTicket = null;
      this.commentForm.reset();
      this.NotifService.create(new Notification(null, data.doc.ticket_id, false, "Nouveau Message", null, agenttoNotif)).subscribe((notif) => {
        this.NotifService.newNotif(notif)
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
    this.fileInput.clear();
  }

  get value() { return this.commentForm.get('value'); }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (event.field == "service") {
        value1 = this.serviceDic[this.sujetList[data1.sujet_id].service_id].label
        value2 = this.serviceDic[this.sujetList[data2.sujet_id].service_id].label
      }else if(event.field =="sujet"){
        value1 = this.sujetList[data1.sujet_id].label
        value2 = this.sujetList[data2.sujet_id].label
      }  else if (event.field == "agent") {
        this.AllUsers.forEach(user=>{
          if(user._id==data1.agent_id){
            value1 = user.firstname + " " + user.lastname;
            
          }
          if(user._id==data2.agent_id){
            value2 = user.firstname + " " + user.lastname;
          }
        })
      } else if (event.field=="sujet"){
        value1 = this.sujetList[data1.sujet_id].label
        value2 = this.sujetList[data2.sujet_id].label
      }
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

}