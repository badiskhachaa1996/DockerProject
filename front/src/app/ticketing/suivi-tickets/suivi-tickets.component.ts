import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { io } from 'socket.io-client';
import { Message } from 'src/app/models/Message';
import { Ticket } from 'src/app/models/Ticket';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import { Service } from 'src/app/models/Service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { saveAs as importedSaveAs } from 'file-saver';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { SocketService } from 'src/app/services/socket.service';
import { MessageService as MsgService } from 'src/app/services/message.service';
import jwt_decode from "jwt-decode";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
  selector: 'app-suivi-tickets',
  templateUrl: './suivi-tickets.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./suivi-tickets.component.scss']
})
export class SuiviTicketsComponent implements OnInit {

  socket = io(environment.origin.replace('/soc', ''));
  [x: string]: any;

  ticketList: Ticket[] = [];
  token: any;
  tickets: any;
  serviceList = [];
  sujetList = [];

  filterService;
  filterSujet;
  filterStatut;

  userconnected: User;
  etudiant: Etudiant;

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

  showCard: Boolean = true;
  agentList = []


  ticketUserInWaiting: Ticket[] = [];
  ticketUserTraite: Ticket[] = [];
  ticketUserInQueue: Ticket[] = [];

  dropdownService: any[] = [{ label: "Tous les services", value: null }];
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

  updateList() {
    this.TicketService.getAllByUser(this.token["id"]).subscribe((data) => {
      this.ticketList = data;
      this.ticketList.forEach((ticket, index) => {
        this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
          (sujet) => {
            ticket["service_id"] = sujet.dataSujet.service_id
            this.ticketList.splice(index, 1, ticket)
          }
        )
      })
    }, (error) => {
      console.error(error)
    })
  }

  constructor(private AuthService: AuthService, private router: Router, private TicketService: TicketService,
    private SujetService: SujetService, private ServService: ServService, private messageService: MessageService,
    private MsgServ: MsgService, private NotifService: NotificationService, private Socket: SocketService,
    private EtudiantService: EtudiantService) { }

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else {
      if (localStorage.getItem('modify') == "true") {
        this.router.navigate(['/profil/creation'])
      }
      this.AuthService.getById(this.token.id).subscribe((data) => {
        this.userconnected = jwt_decode(data.userToken)["userFromDb"];
        if (this.userconnected) {
          this.socket.emit("userLog", jwt_decode(data.userToken)["userFromDb"])
        }
        this.EtudiantService.getByUser_id(this.token.id).subscribe(etu => {
          this.etudiant = etu
        })
      }, (error) => {
        console.error(error)
      })
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

      this.AuthService.getAllAgent().subscribe(data => {
        data.forEach(a => {
          this.agentList.push({ label: a.firstname + " " + a.lastname, value: a._id })
        })
        this.TicketFormAssign.patchValue({ agent: this.agentList[0].value })
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
          //Fonction permettant de cacher le service "Ressources Humaines" en fonction du statut
          if (localStorage.getItem("token") != null) {
            let temp: any = jwt_decode(localStorage.getItem("token"))
            this.AuthService.getById(temp.id).subscribe((dataU) => {
              this.userconnected = jwt_decode(dataU.userToken)["userFromDb"];
              if ((this.userconnected.role == "user" && this.userconnected.type != "Salarié") || (this.userconnected.role == "user" && this.userconnected.type != "Alternant/Stagiaire")) {
                this.filterService.splice(this.filterService.indexOf(new Service("Ressources Humaines", "61e940adc4be5b08430674b6")));
              }
            })
          }
          data.forEach(service => {
            this.dropdownService.push({ label: service.label, value: service._id })
            this.serviceList[service._id] = service.label;
          });
        }
      })

      this.ServService.getAll().subscribe((data) => {
        this.listServices = data;
        data.forEach(service => {
          this.listSujets[service._id] = [];
        });
        this.SujetService.getAll().subscribe((dataS) => {
          dataS.forEach(sujet => {
            this.listSujets[sujet.service_id].push(sujet);
          });
        })
      }, (error) => {
        console.error(error)
      })
    }
    this.socket.on("refreshSuivi", () => {
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
              console.error(error);
            });
      }
      this.updateList()
    })
    this.updateList();

    //Recuperation des tickets en cours de traitement
    this.TicketService.getCountTicketUserInWaiting(this.token.id).subscribe(
      ((response) => { this.ticketUserInWaiting = response; }),
      ((error) => { console.error(error) })
    );

    //Recuperation des tickets traité
    this.TicketService.getCountTicketUserTraite(this.token.id).subscribe(
      ((response) => { this.ticketUserTraite = response; }),
      ((error) => { console.error(error) })
    );

    //Recuperation des tickets en queue d'entrée
    this.TicketService.getCountTicketUserQueue(this.token.id).subscribe(
      ((response) => { this.ticketUserInQueue = response; }),
      ((error) => { console.error(error) })
    );
  }
  showAssignForm = false
  TicketFormAssign = new FormGroup({
    description: new FormControl('', Validators.required),
    agent: new FormControl('', Validators.required),
    file: new FormControl(''),
    value: new FormControl(null, Validators.maxLength(20000000))
  })

  createAdminTicket() {
    this.AuthService.getInfoById(this.TicketFormAssign.value.agent).subscribe(u => {
      let ticket = {
        id: this.token.id,
        service_id: u.service_id,
        agent_id: this.TicketFormAssign.value.agent,
        description: this.TicketFormAssign.value.description,
      }
      this.TicketService.createAdmin(ticket).subscribe(t => {
        this.messageService.add({ severity: 'success', summary: "Création du ticket avec succès", detail: "L'agent a reçu un mail de cette demande" })
        this.updateList()
        let comment = {
          description: this.TicketFormAssign.value.description,
          id: this.token.id,
          ticket_id: t.doc._id,
          file: this.TicketFormAssign.value.file,
          isRep: false

        }

        this.MsgServ.create(comment).subscribe((data) => {
          this.comments.push(data.doc);
          this.messageService.add({ severity: 'success', summary: 'Gestion de message', detail: 'Le fichier a bien été envoyé' });
          let agenttoNotif = t.doc.agent_id;
          this.selectedTicket = null;
          this.commentForm.reset();
          this.Socket.NewMessageByUser(agenttoNotif)
          this.NotifService.create(new Notification(null, t.doc._id, false, "Nouveau Message", null, agenttoNotif)).subscribe((notif) => {
            this.NotifService.newNotif(notif)
          }, (error) => {
            console.error(error)
          });
        }, (error) => {
          console.error(error)
        });
        this.Socket.AddNewTicket(u.service_id)
        this.showAssignForm = false
        this.TicketFormAssign.setValue({ description: "", agent: this.agentList[0].value, file: "", value: null })
      }, error => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: "Un problème est survenu", detail: error.error })
      })
    })

  }

  TicketForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
    agent: new FormControl('')
  })

  TicketForm1: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
  })
  modify(dataT) {
    this.toggleFormUpdate()
    this.Ticket = dataT;
    this.ServService.getAll().subscribe((data) => {
      this.listServices1 = data;
      data.forEach(service => {
        this.listSujets1[service._id] = [];
      });

      this.SujetService.getAll().subscribe((dataS) => {
        dataS.forEach(sujet => {
          this.listSujets1[sujet.service_id].push(sujet);
          if (sujet._id == this.Ticket.sujet_id) {
            this.listServices1.forEach(serv => {
              if (serv._id == sujet.service_id) {
                this.TicketForm1.patchValue({ service: serv, sujet: sujet, description: this.Ticket.description })
              }
            });
          }
        });
      }, (error) => {
        console.error(error)
      })
    }, (error) => {
      console.error(error)
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
      this.SujetService.getASujetByid(data.sujet_id).subscribe((sujet) => {
        this.Socket.refreshAll(sujet.dataSujet.service_id, data.createur_id)
      })
      this.updateList()
      this.TicketForm1.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification du ticket', detail: 'Votre ticket a bien été modifié' });
      this.showFormUpdate = false
    }, (error) => {
      console.error(error)
    });
  }

  toggleFormAdd() {
    this.showFormAdd = true
    this.showFormUpdate = false;
    this.selectedTicket = null;
    this.scrollToTop()
  }
  toggleFormUpdate() {
    this.showFormUpdate = true
    this.showFormAdd = false
    this.selectedTicket = null;
    this.scrollToTop()
  }


  toggleFormCommentAdd(ticket) {
    this.commentForm.reset()
    this.selectedTicket = ticket;
    this.showFormAdd = false;
    this.showFormUpdate = false;
    this.scrollToTop()
  }

  addTicket() {
    //Enregistrement du Ticket
    let req = {
      id: jwt_decode(localStorage.getItem("token"))["id"],
      sujet_id: this.TicketForm.value.sujet._id,
      description: this.TicketForm.value.description,
      etudiant_id: this?.etudiant?._id
    }
    this.TicketService.create(req).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Création du ticket', detail: 'Votre ticket a bien été crée' });
      this.updateList()
      this.Socket.AddNewTicket(this.TicketForm.value.sujet.service_id)
      this.TicketForm = new FormGroup({
        description: new FormControl('', Validators.required),
        sujet: new FormControl('', Validators.required),
        service: new FormControl('', Validators.required),
      })
      this.showFormAdd = false;

    }, (error) => {
      console.error(error)
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

  loadMessages(ticket: Ticket) {
    this.comments = []
    this.MsgServ.getAllByTicketID(ticket._id)
      .subscribe(
        data => {
          console.log(data)
          this.comments = data;
        },
        error => {
          console.error(error);
        });
  }
  SendComment() {
    let isrep;
    if (this.selectedTicket.agent_id != jwt_decode(localStorage.getItem('token'))['id']) {
      isrep = true
    }

    let comment = {
      description: this.commentForm.value.description,
      id: jwt_decode(localStorage.getItem('token'))['id'],
      ticket_id: this.selectedTicket._id,
      file: this.commentForm.value.file,
      isRep: isrep

    }

    this.MsgServ.create(comment).subscribe((data) => {
      this.comments.push(data.doc);
      this.messageService.add({ severity: 'success', summary: 'Gestion de message', detail: 'Votre message a bien été envoyé' });
      let agenttoNotif = this.selectedTicket.agent_id;
      this.selectedTicket = null;
      this.commentForm.reset();
      this.Socket.NewMessageByUser(agenttoNotif)
      this.NotifService.create(new Notification(null, data.doc.ticket_id, false, "Nouveau Message", null, agenttoNotif)).subscribe((notif) => {
        this.NotifService.newNotif(notif)
      }, (error) => {
        console.error(error)
      });
    }, (error) => {
      console.error(error)
    });

  }

  downloadFile(message: Message) {
    this.loadingMessage = message._id;
    this.MsgServ.downloadFile(message._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), message.document)
      this.loadingMessage = null;
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

  onUploadFile(event) {
    let reader = new FileReader();
    if (event.files && event.files.length > 0) {
      this.loading = true
      let file = event.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.TicketFormAssign.get('file').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        })
        this.TicketFormAssign.get('value').setValue(reader.result.toString().split(',')[1])
        this.loading = false;
      };
    }
    this.fileInput.clear();
  }

  get value() { return this.commentForm.get('value'); }
  get value_admin() { return this.TicketFormAssign.get('value'); }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (event.field == "service") {
        value1 = this.serviceDic[this.sujetList[data1.sujet_id].service_id].label
        value2 = this.serviceDic[this.sujetList[data2.sujet_id].service_id].label
      } else if (event.field == "sujet") {
        value1 = this.sujetList[data1.sujet_id].label
        value2 = this.sujetList[data2.sujet_id].label
      } else if (event.field == "agent") {
        this.AllUsers.forEach(user => {
          if (user._id == data1.agent_id) {
            value1 = user.firstname + " " + user.lastname;

          }
          if (user._id == data2.agent_id) {
            value2 = user.firstname + " " + user.lastname;
          }
        })
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
        if (value1 < value2) {
          result = -1
        } else {
          result = (value1 > value2) ? 1 : 0;
        }
      return (event.order * result);
    });
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }


}
