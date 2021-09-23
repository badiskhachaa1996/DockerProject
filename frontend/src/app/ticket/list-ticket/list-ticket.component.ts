import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MessageService, SortEvent } from 'primeng/api';
import { saveAs as importedSaveAs } from "file-saver";
import { Message } from 'src/app/models/Message';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit {
  showRevert = null;
  currentComment = null;
  serviceList: any[] = [];
  sujetList: any[] = [];
  listServices: Service[];
  dropdownService: any[] = [{ label: "Tous les services", value: null }];
  listSujets: Sujet[] = [];
  listSujetSelected: any[] = [];
  statutList = environment.statut;

  queueList: Ticket[] = [];

  AccAffList: Ticket[] = [];
  allTickets: Ticket[] = [];

  userList: any[] = [];
  AllUsers: User[] = []
  EnvoyeurList: User[] = [];

  userDic: any[] = [];
  serviceDic: any[] = []

  showSujetQ: Sujet[] = [{ label: "Tous les sujets", _id: null }];
  showSujetAccAff: Sujet[] = [{ label: "Tous les sujets", _id: null }];
  showSujetAll: Sujet[] = [{ label: "Tous les sujets", _id: null }];
  showStatut = [
    { label: "Tous les statuts", value: null },
    { label: "File d'attente", value: "Queue d'entrée" },
    { label: 'En cours de traitement', value: 'En cours de traitement' },
    { label: 'En attente d\'une réponse', value: 'En attente d\'une réponse' },
    { label: 'Traité', value: 'Traité' }
  ]
  showStatutTab2 = [
    { label: "Tous les statuts", value: null },
    { label: 'En cours de traitement', value: 'En cours de traitement' },
    { label: 'En attente d\'une réponse', value: 'En attente d\'une réponse' },
    { label: 'Traité', value: 'Traité' }
  ]


  draggedTicket: Ticket;
  selectedTicket: Ticket;

  showForm: string = "Ajouter";
  showDropDown: Ticket;
  isReponsable: boolean = false;
  isModify: Ticket=null;
  showFormAddComment: boolean = false;

  loading: boolean = false;
  loadingMessage;
  uplo: File;

  messageList: Message[];


  token = null;

  @ViewChild('fileInput') fileInput: FileUpload;
  comments: any = [];

  commentForm: FormGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    statut: new FormControl(this.statutList[0], Validators.required),
    file: new FormControl(''),
    value: new FormControl(null, Validators.maxLength(10000000))
  });

  expandedTraitement = {};
  expandedAll = {};

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

  constructor(private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private router: Router,
    private AuthService: AuthService, private messageService: MessageService, private MsgServ: MsgServ, private NotifService: NotificationService) { }

  updateAccAffList() {
    this.showSujetAccAff = [{ label: "Tous les sujets", _id: null }]
    this.TicketService.getAccAff(this.token["id"]).subscribe((data) => {
      if (!data.message) {
        this.AccAffList = data;
        this.AccAffList.forEach((ticket, index) => {
          this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
            (sujet) => {
              ticket["service_id"] = sujet.dataSujet.service_id
              this.AccAffList.splice(index, 1, ticket)
              this.showSujetAccAff.push(sujet.dataSujet)
            }
          )
        })
      }
    })
  }

  updateAllList() {
    this.showSujetAll = [{ label: "Tous les sujets", _id: null }]
    if (this.token['role'] == "Admin") {
      this.TicketService.getAllAccAff().subscribe((data) => {
        if (!data.message) {
          this.allTickets = data;
          this.allTickets.forEach((ticket, index) => {
            this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
              (sujet) => {
                ticket["service_id"] = sujet.dataSujet.service_id
                this.allTickets.splice(index, 1, ticket)
                this.showSujetAll.push(sujet.dataSujet)
              }
            )
          })
        }
      })
    } else {
      this.TicketService.getTicketsByService(this.token['service_id']).subscribe((data) => {
        if (!data.message) {
          this.allTickets = data.TicketList;
          this.allTickets.forEach((ticket) => {
            this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
              (sujet) => {
                this.showSujetAll.push(sujet.dataSujet)
              }
            )
          })
        }
      })
    }

  }

  updateQueue() {
    this.showSujetQ = [{ label: "Tous les sujets", _id: null }]
    if (this.token['role'] == "Admin") {
      this.TicketService.getQueue().subscribe((data) => {
        if (!data.message) {
          this.queueList = data;
          this.queueList.forEach((ticket, index) => {
            this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
              (sujet) => {
                ticket["service_id"] = sujet.dataSujet.service_id
                this.queueList.splice(index, 1, ticket)
                this.showSujetQ.push(sujet.dataSujet)

              }
            )

          })
        }
      })
    } else {
      this.TicketService.getQueueByService(this.token['service_id']).subscribe((data) => {
        if (!data.message) {
          this.queueList = data.TicketList;
          this.queueList.forEach((ticket) => {
            this.SujetService.getASujetByid(ticket.sujet_id).subscribe(
              (sujet) => {
                this.showSujetQ.push(sujet.dataSujet)
              }
            )
          })
        }
      })
    }

  }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else if (this.token["role"] == "Responsable" || this.token["role"] == "Admin") {
      this.isReponsable = true;
    } else if (this.token["role"].includes("user")) {
      this.router.navigate(["/ticket/suivi"])
    }

    this.ServService.getDic().subscribe((data) => {
      this.serviceDic = data;
    })
    this.updateQueue()
    this.updateAllList()
    this.ServService.getAll().subscribe((data) => {
      this.listServices = data;
      if (!data.message) {
        data.forEach(element => {
          this.dropdownService.push({ label: element.label, value: element._id })
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

    this.updateAccAffList()

    this.AuthService.getAll().subscribe((data) => {
      if (!data.message) {
        data.forEach(user => {
          this.userDic[user._id] = null;
          this.userDic[user._id] = user;
          if (user.role == "Agent" && (user.service_id == this.token["service_id"])) {
            this.userList.push(user);
          }
        });
        this.AllUsers = data;
      }
    })
  }

  //QueueToAccAff
  QueueToAccAff(user, event?) {
    this.queueList.splice(this.queueList.indexOf(user), 1)
    this.Accepted(user)
  }

  Accepted(rawData) {
    let data = {
      id: rawData._id,
      agent_id: jwt_decode(localStorage.getItem("token"))['id'],
      isAffected: false
    }
    this.TicketService.setAccAff(data).subscribe((res) => {
      this.updateAccAffList()
      this.updateAllList()
    }, (error) => {
      console.log(error)
    })
  }

  showDropdownUser(rawData: Ticket) {
    this.showDropDown = (this.showDropDown) ? null : rawData;
    if (rawData && this.token.role == "Admin") {
      this.userList = []
      this.AllUsers.forEach(user => {
        if (user.service_id == this.sujetList[rawData.sujet_id].service_id) {
          this.userList.push({ label: user.lastname + " " + user.firstname, value: user })
        }
      })
    }
  }

  Affected(event) {
    let data = {
      id: this.showDropDown._id,
      agent_id: event.value._id,
      isAffected: true
    }
    this.TicketService.setAccAff(data).subscribe((data) => {
      this.queueList.splice(this.queueList.indexOf(this.showDropDown), 1)
      if (event.value._id == jwt_decode(localStorage.getItem("token"))["id"]) {
        this.updateAccAffList()
      }
      this.NotifService.create(new Notification(null, data._id, false, "Nouveau Ticket Affecté", null, event.value._id)).subscribe((notif) => {
        this.NotifService.newNotif(notif)
      }, (error) => {
        console.log(error)
      });
      this.updateAllList()
      this.showDropDown = null;
    }, (error) => {
      console.error(error)
    })
  }

  TicketForm: FormGroup = new FormGroup({
    sujet: new FormControl('', Validators.required),//Il doit forcément selectionner
    service: new FormControl('', Validators.required),
  })




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
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

  modify(data) {
    this.toggleFormUpdate()
    this.listServices.forEach(element => {
      if (element._id == this.sujetList[data.sujet_id].service_id) {
        this.TicketForm.patchValue({ service: element })
      }
    });
    this.listSujets.forEach(element => {
      if (element._id == data.sujet_id) {
        this.TicketForm.patchValue({ sujet: element })
      }
    });
    this.isModify = data;
  }



  modifyTicket() {
    //Modification du Ticket
    let req = {
      id: this.isModify._id,
      sujet_id: this.TicketForm.value.sujet._id
    }
    if (req.sujet_id != this.isModify.sujet_id) {
      this.TicketService.changeService(req).subscribe((data) => {
        this.messageService.add({ severity: 'success', summary: 'Modification du ticket', detail: 'Le ticket a bien été modifié' });
        this.NotifService.create(new Notification(null, data._id, false, "Modification d'un ticket", null, data.createur_id)).subscribe((notif) => {
          this.NotifService.newNotif(notif)
          
        }, (error) => {
          console.log(error)
        });
        this.updateQueue()
        this.updateAllList()
      }, (error) => {
        console.log(error)
      });
    }
    this.toggleFormUpdate();
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
    return days.toString() + " j " + Hours + " h " + minutes + " min "

  }

  showWorkingTime(rawData) {
    let calc = new Date(new Date().getTime() - new Date(rawData.date_affec_accep).getTime())
    let days = (calc.getUTCDate() - 1 > 0) ? "" + (calc.getUTCDate() - 1) + " j " : " ";
    let Hours = calc.getUTCHours();
    let minutes = calc.getUTCMinutes();
    return days.toString() + Hours + " h " + minutes + " min "
  }



  toggleRevertForm(ticket) {
    this.showRevert = ticket;
    this.showFormAddComment = false;
    this.isModify = null;

  }

  toggleFormUpdate() {
    this.isModify = null;
    this.showRevert = null;
    this.showFormAddComment = false;

  }


  toggleFormCommentAdd(ticket) {
    this.commentForm.reset()
    this.commentForm.setValue({description:"",statut:this.statutList[0],file:'',value:null})
    this.selectedTicket = ticket;
    this.showRevert = null;
    this.isModify = null;
  }

  loadMessages(ticket: Ticket, type: string, expanded) {
    this.comments = null
    this.MsgServ.getAllByTicketID(ticket._id)
      .subscribe(
        data => {
          this.comments = data;
        },
        error => {
          console.log(error);
        });
    this.expandedAll = {};
    this.expandedTraitement = {}
    if (type === "AccAff") {
      this.expandedTraitement[ticket._id] = !expanded;
    } else {

      this.expandedAll[ticket._id] = !expanded;
    }
  }
  SendComment() {
    let comment = {
      description: this.commentForm.value.description,
      id: jwt_decode(localStorage.getItem('token'))['id'],
      ticket_id: this.selectedTicket._id,
      file: this.commentForm.value.file,
      envoyeur: this.EnvoyeurList
    }

    this.MsgServ.getAll().subscribe((data) => {
      if (!data.message) {
        this.EnvoyeurList = data;
      }
    })

    let dataTicket = {
      id: this.selectedTicket._id,
      statut: this.commentForm.value.statut.value
    }
    this.MsgServ.create(comment).subscribe((message) => {
      this.comments.push(message.doc);
      this.messageService.add({ severity: 'success', summary: 'Gestion de message', detail: 'Creation de message réussie' });
      this.showFormAddComment = false;
      console.log(dataTicket)
      if (dataTicket.statut != "Traité") {
        this.NotifService.create(new Notification(null, this.selectedTicket._id, false, "Nouveau Message", null, this.selectedTicket.createur_id)).subscribe((notif) => {
          this.NotifService.newNotif(notif)
          this.TicketService.changeStatut(dataTicket).subscribe((data) => {
            this.updateAccAffList()
            this.updateAllList()
          }, (error) => {
            console.log(error)
          })
        }, (error) => {
          console.log(error)
        });

      } else {
        this.NotifService.create(new Notification(null, this.selectedTicket._id, false, "Traitement de votre ticket", null, this.selectedTicket.createur_id)).subscribe((notif) => {
          this.NotifService.newNotif(notif)
          this.TicketService.changeStatut(dataTicket).subscribe((data) => {
            this.updateAccAffList()
            this.updateAllList()
          }, (error) => {
            console.log(error)
          })
        }, (error) => {
          console.log(error)
        });
      }

    }, (error) => {
      console.log(error)
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
    this.fileInput.clear()
  }

  toggleFormCancel() {
    this.showFormAddComment = !this.showFormAddComment;
  }
  get value() { return this.commentForm.get('value'); }

  RevertForm: FormGroup = new FormGroup({
    justificatif: new FormControl('', Validators.required)
  })


  revert() {
    let data = {
      id: this.showRevert._id,
      justificatif: this.RevertForm.value.justificatif,
      user_revert: this.token['id'],
      revertedByAdmin:this.token.id != this.showRevert.agent_id
    }
    this.TicketService.revert(data).subscribe(ticket => {
      try {
        this.AccAffList.splice(this.AccAffList.indexOf(this.showRevert), 1)
      } catch (error) { }
      this.allTickets.splice(this.allTickets.indexOf(this.showRevert), 1)
      if (ticket) {
        this.updateQueue()
        this.messageService.add({ severity: 'success', summary: 'Renvoie d\'un ticket', detail: 'Le ticket a été renvoyer avec succès dans la queue d\'entrée' });
      }
      this.RevertForm.reset()
      if (this.showRevert.agent_id == this.token['id']) {
        //L'agent a revert son ticket
        //Notifié les responsables de son service
        this.AllUsers.forEach(user => {
          if (user._id != this.token.id && ((user.role == "Responsable" && user.service_id == this.token.service_id) || user.role == "Admin")) {
            this.NotifService.create(new Notification(null, this.showRevert._id, false, "Revert d\'un ticket par Agent", null, user._id)).subscribe(Notif => {
              this.NotifService.newNotif(Notif)
            }, (error) => {
              console.error(error)
            })
          }
        })
        this.showRevert = null
      } else {
        //Avertir l'agent que son ticket a été revert
        this.NotifService.create(new Notification(null, this.showRevert._id, false, "Revert d\'un ticket", null, this.showRevert.agent_id)).subscribe(Notif => {
          this.NotifService.newNotif(Notif)
          this.showRevert = null
        }, (error) => {
          console.error(error)
        })
      }

    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Renvoie d\'un ticket', detail: 'Le renvoie a eu un problème' });
      console.error(error)
    })

  }
}
