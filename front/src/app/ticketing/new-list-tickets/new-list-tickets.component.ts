import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { MessageService as ToastService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';
import { saveAs } from "file-saver";
import mongoose from 'mongoose';
import { FileUpload } from 'primeng/fileupload';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { Notification } from 'src/app/models/notification';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-new-list-tickets',
  templateUrl: './new-list-tickets.component.html',
  styleUrls: ['./new-list-tickets.component.scss']
})
export class NewListTicketsComponent implements OnInit {

  sujetDropdown: any[] = [
  ];
  serviceDropdown: any[] = [
  ];
  USER: User
  constructor(private TicketService: TicketService, private ToastService: ToastService,
    private ServService: ServService, private SujetService: SujetService, private AuthService: AuthService,
    private NotifService: NotificationService, private Socket: SocketService, private router: Router, private MessageService: MessageService) { }
  tickets: Ticket[] = []
  ticketsOnglets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('',),
    resum: new FormControl(''),
    priorite: new FormControl("false"),
    module: new FormControl('',),
    type: new FormControl('',),
    documents: new FormControl([]),
    agent_id: new FormControl('',),
    _id: new FormControl('', Validators.required),
    demande : new FormControl('',),
    campus: new FormControl('',),
    filiere:new FormControl('',),
  })
  stats = {
    en_attente: 0,
    en_cours: 0
  }
  token: any;
  demandeDropdown:any;
  showDemandeDropdown:boolean =false;
  filterService = [];
  filtreSujet = [{ label: 'Tous les sujets', value: null },
  { label: 'Module Ressources humaines', value: "Module Ressources humaines" },
  { label: 'Module Pédagogie', value: "Module Pédagogie" },
  { label: 'Module Administration', value: "Module Administration" },
  { label: 'Module Admission', value: "Module Admission" },
  { label: 'Module Commerciale', value: "Module Commerciale" },
  { label: 'Module Partenaires', value: "Module Partenaires" },
  { label: 'Module iMatch', value: "Module iMatch" },
  { label: 'Module Booking', value: "Module Booking" },
  { label: 'Module Questionnaire', value: "Module Questionnaire" },
  { label: 'Module International', value: "Module International" },
  { label: 'Module CRM', value: "Module CRM" },
  { label: 'Module Intuns', value: "Module Intuns" },
  { label: 'Module Gestions des emails', value: "Module Gestions des emails" },
  { label: 'Module Admin IMS', value: "Module Admin IMS" },
  { label: 'Module Générateur Docs', value: "Module Générateur Docs" },
  { label: 'Module Ticketing', value: "Module Ticketing" },
  { label: 'Espace Personnel', value: "Espace Personnel" },
  ];
  filterStatut = [
    { label: 'En attente', value: "En attente de traitement" },
    { label: 'En cours', value: "En cours de traitement" },
    { label: 'Traité', value: "Traité" },
  ]

  statutDropdown = [
    { label: 'En attente', value: "En attente de traitement" },
    { label: 'En cours', value: "En cours de traitement" },
    { label: 'Traité', value: "Traité" },
  ]
  filterAgent = [
    { label: 'Tous les users', value: null }
  ]
  sujetDic = {}
  serviceDic = {}
  updateTicketList() {
    this.TicketService.getAllMine(this.token.id).subscribe((dataM: Ticket[]) => {
      this.tickets = dataM
      dataM.forEach(e => {
        e.origin = 'Mine'
        e.documents_service.forEach(ds => { ds.by = "Agent" })
        e.documents = e.documents.concat(e.documents_service)
      })
      this.TicketService.getAllAssigne(this.token.id).subscribe(data => {
        data.forEach(e => {
          e.origin = 'Assigne'
          e.documents_service.forEach(ds => { ds.by = "Agent" })
          e.documents = e.documents.concat(e.documents_service)
        })
        this.tickets = this.tickets.concat(data)
        let service_dic = {};
        this.USER.roles_list.forEach((val) => {
          if (!service_dic[val.module])
            service_dic[val.module] = val.role
        })
        //IF this.user ticketing !='Super-Admin'
        let role = service_dic['Ticketing']
        if (role && role != 'Super-Admin')
          this.TicketService.getAllNonAssigneV2(this.USER?.service_list || []).subscribe(nonassigne => {
            nonassigne.forEach(e => {
              e.origin = 'Non Assigne'
              e.documents_service.forEach(ds => { ds.by = "Agent" })
              e.documents = e.documents.concat(e.documents_service)
            })
            this.tickets = this.tickets.concat(nonassigne)
            this.tickets.sort((a, b) => {
              if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                return -1
              else
                return 1
            })

            this.defaultTicket = this.tickets
            console.log(this.defaultTicket)
            this.onFilterTicket()
            let tempDate = new Date()
            tempDate.setDate(tempDate.getDate() - 2)
            this.stats = {
              en_attente: Math.trunc(this.tickets.reduce((total, next) => total + (new Date(next?.date_ajout).getTime() < tempDate.getTime() ? 1 : 0), 0)),
              en_cours: Math.trunc(this.tickets.reduce((total, next) => total + (next?.statut == "En cours" ? 1 : 0), 0)),
            }
          })
        else
          this.TicketService.getAllNonAssigne().subscribe(nonassigne => {
            nonassigne.forEach(e => {
              e.origin = 'Non Assigne'
              e.documents_service.forEach(ds => { ds.by = "Agent" })
              e.documents = e.documents.concat(e.documents_service)
            })
            this.tickets = this.tickets.concat(nonassigne)
            this.tickets.sort((a, b) => {
              if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                return -1
              else
                return 1
            })

            this.defaultTicket = this.tickets
            console.log(this.defaultTicket)
            this.onFilterTicket()
            let tempDate = new Date()
            tempDate.setDate(tempDate.getDate() - 2)
            this.stats = {
              en_attente: Math.trunc(this.tickets.reduce((total, next) => total + (new Date(next?.date_ajout).getTime() < tempDate.getTime() ? 1 : 0), 0)),
              en_cours: Math.trunc(this.tickets.reduce((total, next) => total + (next?.statut == "En cours" ? 1 : 0), 0)),
            }
          })

      })
    })

  }
  filterBase = ['En attente de traitement', 'En cours de traitement']
  @ViewChild('dt1', { static: true }) dt1: any;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'))
    this.AuthService.getPopulate(this.token.id).subscribe(r => {
      this.USER = r
      this.ticketsOnglets = r.savedTicket
      this.updateTicketList()
    })

    this.dt1.filter(this.filterBase, 'statut', 'in')
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceDropdown.push({ label: val.label, value: val._id })
        this.filterService.push({ label: val.label, value: val._id })
        this.serviceDic[val._id] = val.label
      })
    })
    this.SujetService.getAll().subscribe(data => {
      data.forEach(element => {
        this.sujetDic[element._id] = element.label
      });
    })

    this.AuthService.getAllAgent().subscribe(users => {
      users.forEach(u => {
        this.filterAgent.push({ label: `${u.firstname} ${u.lastname}`, value: u._id })
      })
    })
  }

  delete(id, ri) {
    if (confirm("Êtes-vous sur de vouloir supprimer ce ticket ?")) {
      this.TicketService.delete(id).subscribe(data => {
        this.tickets.splice(ri, 1)
      })
    }
  }
  onUpdate(ticket: Ticket) {
    this.ticketUpdate = ticket
    this.TicketForm.patchValue({ ...ticket, service_id: ticket.sujet_id.service_id._id })
    this.SujetService.getAllByServiceID(ticket.sujet_id.service_id._id).subscribe(data => {
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
      this.TicketForm.patchValue({ sujet_id: ticket.sujet_id._id })
    })
  }

  onSubmitUpdate() {
    let documents = this.TicketForm.value.documents
    this.uploadedFiles.forEach(element => {
      documents.push({ path: element.name, name: element.name, _id: new mongoose.Types.ObjectId().toString() })
    });
    this.TicketService.update({ ...this.TicketForm.value, documents }).subscribe(data => {
      this.updateTicketList()
      this.uploadedFiles.forEach((element, idx) => {
        let formData = new FormData()
        //ERREUR ICI
        formData.append('ticket_id', this.TicketForm.value._id)
        formData.append('document_id', documents[idx]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
      this.TicketForm.reset()
      this.ticketUpdate = null
      this.ticketAssign = null
      this.ToastService.add({ severity: 'success', summary: "Modification du Ticket avec succès" })
    })
  }

  onSelectService() {
    this.sujetDropdown = []
    this.SujetService.getAllByServiceID(this.TicketForm.value.service_id).subscribe(data => {
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
    })
    this.AuthService.getAllByServiceFromList(this.TicketForm.value.service_id).subscribe(data => {
      this.dropdownMember = []
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }

  downloadFile(index, ri: Ticket) {
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }
  deleteFile(index, ri: Ticket) {
    ri.documents.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents: ri.documents }).subscribe(data => {

      this.ToastService.add({ severity: 'success', summary: 'Documents supprimé' })
    })
  }

  downloadFileService(index, ri: Ticket) {
    this.TicketService.downloadFileService(ri._id, ri.documents_service[index]._id, ri.documents_service[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents_service[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

  deleteFileService(index, ri: Ticket) {
    ri.documents_service.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents_service: ri.documents_service }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: 'Documents supprimé' })
    })
  }

  uploadedFiles: File[] = []
  onUpload(event: { files: File[] }, fileUpload: FileUpload, ticket: Ticket) {
    this.uploadedFiles.push(event.files[0])
    let documents = ticket.documents_service
    this.uploadedFiles.forEach(element => {
      let tempid = new mongoose.Types.ObjectId().toString()
      documents.push({ path: element.name, nom: element.name, _id: tempid })
      let formData = new FormData()
      formData.append('ticket_id', ticket._id)
      formData.append('document_id', tempid)
      formData.append('file', element)
      formData.append('path', element.name)
      this.TicketService.addFileService(formData).subscribe(data => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
      })
    });
    this.TicketService.update({ documents_service: documents, _id: this.ticketTraiter._id }).subscribe(r => { this.uploadedFiles = [] })
    fileUpload.clear()
  }

  getDelaiTraitrement(ticket: Ticket) {
    let date1 = new Date()
    if (ticket.statut == 'Traité' && ticket.date_fin_traitement)
      date1 = new Date(ticket.date_fin_traitement)
    let date2 = new Date(ticket.date_ajout)

    var diff = {
      sec: 0,
      min: null,
      hour: 0,
      day: 0
    }							// Initialisation du retour
    var tmp = date1.getTime() - date2.getTime();

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;					// Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);	// Nombre de minutes (partie entière)
    diff.min = tmp % 60;					// Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);	// Nombre d'heures (entières)
    diff.hour = tmp % 24;					// Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);	// Nombre de jours restants
    diff.day = tmp;
    if (diff.min < 10)
      diff.min = "0" + diff.min.toString()

    return `${diff.day}J ${diff.hour}H${diff.min}`;
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

  seeMore(str: string, type = "Description") {
    this.seeMoreObj = { str, type }
    this.seeMoreBool = true
  }
  seeMoreObj = { str: "", type: "" }
  seeMoreBool = false
  ticketTraiter: Ticket
  TicketFormTraiter = new FormGroup({
    user_id: new FormControl(''),
    description: new FormControl('')
  })
  onTraiter(ticket, index) {
    let ids = []
    this.ticketsOnglets.forEach((r: Ticket) => {
      ids.push(r._id)
    })
    if (!ids.includes(ticket._id)) {
      this.ticketsOnglets.push(ticket)
      this.AuthService.update({ _id: this.token.id, savedTicket: this.ticketsOnglets }).subscribe(r => {
        this.activeIndex1 = this.ticketsOnglets.length + 1
      })
      this.ToastService.add({ severity: 'success', summary: "Le ticket a été épinglé à vos onglets" })
    } else {
      this.activeIndex1 = ids.indexOf(ticket._id) + 2
      this.ToastService.add({ severity: 'info', summary: "Ce ticket se trouve déjà dans vos onglets" })
    }

  }
  onUpdateTraiter() {
    let date_fin_traitement = null
    if (this.TicketForm.value.statut == 'Traité')
      date_fin_traitement = new Date()

    let documents_service = this.TicketForm.value.documents_service
    if (!documents_service)
      documents_service = []
    this.uploadedFiles.forEach(element => {
      documents_service.push({ path: element.name, name: element.name, _id: new mongoose.Types.ObjectId().toString() })
    });
    this.TicketService.update({ ...this.TicketForm.value, date_fin_traitement, documents_service }).subscribe(data => {
      if (this.TicketForm.value.statut != this.ticketTraiter.statut) {
        this.Socket.NewNotifV2('Ticketing - Super-Admin', `Le ticket ${this.ticketTraiter.customid} a changé de statut, l'état actuel est ${this.TicketForm.value.statut}`)
        this.NotifService.createV2(new Notification(null, null, false, `Le ticket ${this.ticketTraiter.customid} a changé de statut, l'état actuel est ${this.TicketForm.value.statut}`, new Date(), null, this.ticketTraiter?.sujet_id?.service_id?._id), 'Ticketing', "Super-Admin").subscribe(test => { console.log(test) })
        this.Socket.NewNotifV2(this.ticketTraiter.createur_id, `Le ticket ${this.ticketTraiter.customid} a changé de statut, l'état actuel est ${this.TicketForm.value.statut}`)
        this.NotifService.create(new Notification(null, null, false, `Le ticket ${this.ticketTraiter.customid} a changé de statut, l'état actuel est ${this.TicketForm.value.statut}`, new Date(), this.ticketTraiter.createur_id, this.ticketTraiter?.sujet_id?.service_id?._id)).subscribe(test => { })
        this.AuthService.getPopulate(this.ticketTraiter.createur_id).subscribe(userCreator => {
          this.TicketService.sendMailUpdateStatut({ id: this.ticketTraiter.customid, statut: this.TicketForm.value.statut, createur_email: userCreator.email }).subscribe(() => { })
        })

      }

      this.TicketForm.reset()
      this.updateTicketList()
      this.ticketTraiter = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du Ticket avec succès' })
      this.uploadedFiles.forEach((element, idx) => {
        let formData = new FormData()
        formData.append('ticket_id', this.TicketForm.value._id)
        formData.append('document_id', documents_service[idx + this.TicketForm.value.documents_service.length]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
    })
  }

  goToAddTicket() {
    this.router.navigate(['ticketing/gestion/ajout'])
  }
  onCreateSujetLabel(ticket: Ticket) {
    let r = ticket?.sujet_id?.label
    if (ticket.module)
      r = r + " - " + ticket.module
    if (ticket.type)
      r = r + " - " + ticket.type
    return r
  }
  messageList = []
  loadCommentaires(event: any) {
    console.log(event)
    if (event._id) {
      this.MessageService.getAllByTicketID(event._id).subscribe(messages => {
        this.messageList = messages
        console.log(this.messageList)
      })
    }
    else if (event.index != 0)
      this.MessageService.getAllByTicketID(this.ticketsOnglets[event.index - 1]._id).subscribe(messages => {
        this.messageList = messages
      })
  }

  onAjoutCommentaire(ticket: Ticket) {
    this.ticketTraiter = ticket
    this.TicketForm.patchValue({ ticket_id: this.ticketTraiter._id })
  }

  onAddCommentaire() {
    this.MessageService.create({ ...this.TicketFormTraiter.value, user_id: this.token.id, ticket_id: this.ticketTraiter._id, id: this.token.id }).subscribe(m => {
      this.ToastService.add({ severity: 'success', summary: "Ajout du commentaire avec succès" })

      this.MessageService.getAllByTicketID(this.ticketTraiter._id).subscribe(messages => {
        this.messageList = messages
        this.ticketTraiter = null
        this.TicketFormTraiter.reset()
      })
    })
  }

  updateTicketStatut(ticket: Ticket) {
    this.TicketService.update({ ...ticket }).subscribe(t => {
      this.updateTicketList()
    })
  }
  deleteTicket(ticket: Ticket) {
    this.ticketsOnglets.splice(this.ticketsOnglets.indexOf(ticket), 1)
    this.AuthService.update({ _id: this.token.id, savedTicket: this.ticketsOnglets }).subscribe(r => {
    })
  }

  handleClose(e) {
    this.deleteTicket(this.ticketsOnglets[e.index - 2])
  }
  filterType = ['Mine']
  filterStatutTicket = []
  defaultTicket = []
  onFilterTicket() {
    this.tickets = []
    this.defaultTicket.forEach((t: Ticket) => {
      let r = true
      if (this.filterStatutTicket.includes("Urgent")) {
        r = t.priorite
      }
      if (this.filterStatutTicket.includes("Tickets > 24 heures")) {
        let tempDate = new Date()
        tempDate.setDate(tempDate.getDate() - 2)
        if (!(new Date(t.date_ajout).getTime() < tempDate.getTime()))
          r = false
      }
      if (this.filterType.includes(t.origin) == false)
        r = false
      if (r)
        this.tickets.push(t)
    })
  }
YpareoDropdown:any[]=[
  { label: 'Accés', value: "Acces" },
  { label: "Ajout d'un étudiant", value: "Ajout" },
  { label: 'Autre', value: "Autre" },
];
MicrosoftDropdown:any[]=[
  { label: 'Réinitialisation du mot de passe', value: "Réinitialisation du mot de passe" },
  { label: 'Création du compte Microsoft 365', value: "Création du compte Microsoft 365" },
  { label: "Problème d'accès à Microsoft 365", value: "Problème d'accès à Microsoft 365" },
  { label: "Problème TEAMS", value: "Problème TEAMS" },
  { label: "Problème Outlook", value: "Problème Outlook" },
  { label: "Problème OneDrive", value: "Problème OneDrive" },
];
SiteinternetDropdown:any[]=[
  { label: 'Contenu', value: "Contenu" },
  { label: "Formulaire d'admission", value: "Formulaire d'admission" },
  { label: 'Beug', value: "Beug" },
  { label: 'Autre', value: "Autre" },
];
  moduleDropdown: any[] = [
    { label: 'Module Ressources humaines', value: "Module Ressources humaines" },
    { label: 'Module Pédagogie', value: "Module Pédagogie" },
    { label: 'Module Administration', value: "Module Administration" },
    { label: 'Module Admission', value: "Module Admission" },
    { label: 'Module Commerciale', value: "Module Commerciale" },
    { label: 'Module Partenaires', value: "Module Partenaires" },
    { label: 'Module iMatch', value: "Module iMatch" },
    { label: 'Module Booking', value: "Module Booking" },
    { label: 'Module Questionnaire', value: "Module Questionnaire" },
    { label: 'Module International', value: "Module International" },
    { label: 'Module CRM', value: "Module CRM" },
    { label: 'Module Intuns', value: "Module Intuns" },
    { label: 'Module Gestions des emails', value: "Module Gestions des emails" },
    { label: 'Module Admin IMS', value: "Module Admin IMS" },
    { label: 'Module Générateur Docs', value: "Module Générateur Docs" },
    { label: 'Module Ticketing', value: "Module Ticketing" },
    { label: 'Espace Personnel', value: "Espace Personnel" },
  ];

  IMS_Type_Dropdown: any[] = [
    { label: 'Création', value: "Création" },
    { label: 'Evolution', value: "Evolution" },
    { label: 'Correction', value: "Correction" },
  ]
  showModuleDropdown: boolean = false;
  showTypeDropdown: boolean = false;

  onSubjectChange() {
    const selectedSubject = this.sujetDic[this.TicketForm.get('sujet_id').value];

    if (this.serviceDic[this.TicketForm.get('service_id').value] === "Support informatique") {
      this.showTypeDropdown = true;
    } else {
      this.showTypeDropdown = false;
    }
    if (selectedSubject === "IMS") {
      this.showModuleDropdown = true;
      this.showTypeDropdown = true;
      this.TicketForm.get('module').setValidators([Validators.required]);
      this.TicketForm.get('module').updateValueAndValidity();
    }else if (selectedSubject ==="Ypareo"){
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      this.showDemandeDropdown=true;
      this.demandeDropdown=this.YpareoDropdown;
    }else if (selectedSubject ==="Microsoft"){
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      this.showDemandeDropdown=true;
      this.demandeDropdown=this.MicrosoftDropdown
    }else if (selectedSubject ==="Site internet"){
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      this.showDemandeDropdown=true;
      this.demandeDropdown=this.SiteinternetDropdown;
    }
    else {

      this.TicketForm.get('module').clearValidators();
      this.TicketForm.get('module').updateValueAndValidity();
      this.TicketForm.get('module').reset();
      this.showModuleDropdown = false;
    }
  };

  ticketAssign: Ticket;
  dropdownMember = []
  onAssign(ticket: Ticket) {
    this.ticketAssign = ticket
    this.TicketForm.patchValue({ ...ticket, service_id: ticket.sujet_id.service_id._id })
    this.SujetService.getAllByServiceID(ticket.sujet_id.service_id._id).subscribe(data => {
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
      this.TicketForm.patchValue({ sujet_id: ticket.sujet_id._id })
    })
    this.AuthService.getAllByServiceFromList(ticket.sujet_id.service_id._id).subscribe(data => {
      this.dropdownMember = []
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }
  activeIndex1 = 1
  onSelectFilterService(service_id: string) {
    this.AuthService.getAllByServiceFromList(service_id).subscribe(users => {
      this.filterAgent = []
      users.forEach(u => {
        this.filterAgent.push({ label: `${u.firstname} ${u.lastname}`, value: u._id })
      })
    })
  }
}

