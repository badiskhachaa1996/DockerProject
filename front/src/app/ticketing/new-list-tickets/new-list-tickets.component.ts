import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, UntypedFormGroup } from '@angular/forms';

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
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/User';
import { Sujet } from 'src/app/models/Sujet';
import { Service } from 'src/app/models/Service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Table } from 'primeng/table';
import { error } from 'console';
import { RhService } from 'src/app/services/rh.service';
@Component({
  selector: 'app-new-list-tickets',
  templateUrl: './new-list-tickets.component.html',
  styleUrls: ['./new-list-tickets.component.scss']
})
export class NewListTicketsComponent implements OnInit {
  TICKETID = this.route.snapshot.paramMap.get('ticket_id');
  campusDropdown: any[] = [
    { value: 'Paris', label: "Paris" },
    { value: "Marne", label: "Marne" },
    { value: 'Montpelier', label: "Montpelier" },
  ];
  serviceFiltered: string[] = []
  sujetDropdown: any[] = [
  ];
  serviceDropdown: any[] = [
  ];
  modeOptions = [
    { label: 'Personnel' },
    { label: 'Service' }
  ]
  USER: User
  isAgent = false
  constructor(private route: ActivatedRoute, private TicketService: TicketService, private ToastService: ToastService,
    private ServService: ServService, private SujetService: SujetService, private AuthService: AuthService,
    private NotifService: NotificationService, private Socket: SocketService, private router: Router,
    private MessageService: MessageService, private diplomeService: DiplomeService, private CollaborateurService: RhService) { }
  tickets: Ticket[] = []
  ticketsService: Ticket[] = []
  ticketsOnglets = []
  ticketUpdate: Ticket;
  TicketForm = new UntypedFormGroup({
    sujet_id: new FormControl(null, Validators.required),
    service_id: new FormControl(null, Validators.required),
    description: new FormControl('',),
    resum: new FormControl(''),
    priorite: new FormControl(false),
    module: new FormControl('',),
    type: new FormControl('',),
    statut: new FormControl('',),
    documents: new FormControl([]),
    agent_id: new FormControl(null,),
    _id: new FormControl(null, Validators.required),
    demande: new FormControl('',),
    campus: new FormControl('',),
    filiere: new FormControl('',),
    date_limite: new FormControl('',),
    note_assignation: new FormControl('',),
  })
  stats = {
    en_attente: 0,
    en_cours: 0
  }
  token: any;
  demandeDropdown: any;
  showDemandeDropdown: boolean = false;
  filterService = [];
  filtreSujet = [
  ];
  filterStatut = [
    { label: 'En attente', value: "En attente de traitement" },
    { label: 'En cours', value: "En cours de traitement" },
    { label: 'Traité', value: "Traité" },
  ]
  selectedSite = null
  filterSite: any[] = [
    { label: 'Tous les sites', value: null },
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];
  statutDropdown = [
    { label: 'En attente', value: "En attente de traitement" },
    { label: 'En cours', value: "En cours de traitement" },
    { label: 'Traité', value: "Traité" },
  ]
  filterAgent = [
  ]
  sujetDic = {}
  serviceDic = {}
  createurList = []
  defaultTicketService = []
  updateTicketList(isFirst = false) {
    this.TicketService.getAllMine(this.token.id).subscribe((dataM: Ticket[]) => {

      dataM.forEach(e => {
        e.origin = 'Mine'
        e.documents_service.forEach(ds => { ds.by = "Agent" })
        e.documents = e.documents.concat(e.documents_service)
      })
      this.tickets = dataM
      this.TicketService.getAllAssigne(this.token.id).subscribe(data => {
        data.forEach(e => {
          e.origin = 'Assigne'
          e.documents_service.forEach(ds => { ds.by = "Agent" })
          e.documents = e.documents.concat(e.documents_service)
        })
        this.tickets = this.tickets.concat(data)
        console.log(data)
        let service_dic = {};
        this.USER.roles_list.forEach((val) => {
          if (!service_dic[val.module])
            service_dic[val.module] = val.role
        })
        //IF this.user ticketing !='Super-Admin'
        let role = service_dic['Ticketing']
        if (!role || role != 'Super-Admin') {
          let serviceList = []
          this.USER.roles_ticketing_list.forEach(val => {
            if (val?.role == 'Responsable')
              serviceList.push(val.module)
          })
          this.TicketService.getAllNonAssigneV2(serviceList || []).subscribe(nonassigne => {
            nonassigne.forEach(e => {
              e.origin = 'Non Assigne'
              e.documents_service.forEach(ds => { ds.by = "Agent" })
              e.documents = e.documents.concat(e.documents_service)
            })
            this.ticketsService = nonassigne
            this.TicketService.getAllAssigneV2(serviceList || []).subscribe(allAssigne => {
              allAssigne.forEach(e => {
                e.origin = 'Assigne Service'
                e.documents_service.forEach(ds => { ds.by = "Agent" })
                e.documents = e.documents.concat(e.documents_service)
              })
              this.ticketsService = this.ticketsService.concat(allAssigne)


              this.tickets.sort((a, b) => {
                if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                  return -1
                else
                  return 1
              })

              this.ticketsService.sort((a, b) => {
                if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                  return -1
                else
                  return 1
              })
              this.defaultTicket = this.tickets
              this.defaultTicketService = this.ticketsService
              this.filteredValues = this.tickets
              this.filteredValuesService = this.ticketsService
              this.onFilterTicket()
              let tempDate = new Date()
              tempDate.setDate(tempDate.getDate() - 2)
              this.stats = {
                en_attente: Math.trunc(this.ticketsService.reduce((total, next) => total + (new Date(next?.date_ajout).getTime() < tempDate.getTime() ? 1 : 0), 0)),
                en_cours: Math.trunc(this.ticketsService.reduce((total, next) => total + (next?.statut == "En cours" ? 1 : 0), 0)),
              }
              if (isFirst) {
                this.CollaborateurService.getCollaborateurByUserId(this.token.id).then(r => {
                  let site = ''
                  if (Array.isArray(r.localisation) && r.localisation.length != 0)
                    site = r.localisation[0]
                  else if (!Array.isArray(r.localisation)) {
                    let buffer: any = r.localisation
                    site = buffer
                  }
                  if (site && this.UserServiceDic['Ressources Humaines'] && this.UserServiceDic['Ressources Humaines'] == 'Responsable') {
                    this.selectedSite = site
                    this.dt1.filter(site, 'site', 'in')
                    if (this.dt2)
                      this.dt2.filter(site, 'site', 'in')
                  }

                })
              }
            })
          })
        }
        else
          this.TicketService.getAllNonAssigne().subscribe(nonassigne => {
            nonassigne.forEach(e => {
              e.origin = 'Non Assigne'
              e.documents_service.forEach(ds => { ds.by = "Agent" })
              e.documents = e.documents.concat(e.documents_service)
            })
            this.ticketsService = nonassigne
            this.TicketService.getAllAssigneAdmin().subscribe(allAssigne => {
              allAssigne.forEach(e => {
                e.origin = 'Assigne Service'
                e.documents_service.forEach(ds => { ds.by = "Agent" })
                e.documents = e.documents.concat(e.documents_service)
              })
              this.ticketsService = this.ticketsService.concat(allAssigne)

              this.tickets.sort((a, b) => {
                if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                  return -1
                else
                  return 1
              })
              this.ticketsService.sort((a, b) => {
                if (new Date(a.date_ajout).getTime() > new Date(b.date_ajout).getTime())
                  return -1
                else
                  return 1
              })
              this.defaultTicket = this.tickets
              this.defaultTicketService = this.ticketsService
              this.onFilterTicket()
              if (isFirst) {
                this.CollaborateurService.getCollaborateurByUserId(this.token.id).then(r => {
                  let site = ''
                  if (Array.isArray(r.localisation) && r.localisation.length != 0)
                    site = r.localisation[0]
                  else if (!Array.isArray(r.localisation)) {
                    let buffer: any = r.localisation
                    site = buffer
                  }
                  if (site && this.UserServiceDic['Ressources Humaines'] && this.UserServiceDic['Ressources Humaines'] == 'Responsable') {
                    this.selectedSite = site
                    this.dt1.filter(site, 'site', 'equals')
                    if (this.dt2)
                      this.dt2.filter(site, 'site', 'equals')
                  }

                })
              }
              let tempDate = new Date()
              tempDate.setDate(tempDate.getDate() - 2)
              this.stats = {
                en_attente: Math.trunc(this.ticketsService.reduce((total, next) => total + (new Date(next?.date_ajout).getTime() < tempDate.getTime() ? 1 : 0), 0)),
                en_cours: Math.trunc(this.ticketsService.reduce((total, next) => total + (next?.statut == "En cours" ? 1 : 0), 0)),
              }
            })
          })

      })
    })

  }
  roleAccess = ''
  filterBase = []//'En attente de traitement', 'En cours de traitement'
  @ViewChild('dt1', { static: true }) dt1: Table;
  @ViewChild('dt2', { static: true }) dt2: Table;
  hideTicket = true
  UserServiceDic = {}
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'))
    if (this.router.url == '/ticketing/mes-tickets-services')
      this.filterType = ['Non Assigne']


    this.AuthService.getPopulate(this.token.id).subscribe(r => {
      this.USER = r
      this.isAgent = (r.role != 'user')
      if (r.haveNewAccess)
        if ((r.type == 'Reponsable' || r.type == 'Collaborateur' || r.type == 'Formateur' || r.type_supp.includes('Collaborateur') || r.type_supp.includes('Reponsable')))
          this.isAgent = true
        else
          this.isAgent = false
      if (this.isAgent) {
        let service_dic = {};
        r.roles_list.forEach((val) => {
          if (!service_dic[val.module])
            service_dic[val.module] = val.role
        })
        this.UserServiceDic = service_dic
        this.roleAccess = 'Admin'
        if (service_dic['Ticketing'])
          this.roleAccess = service_dic['Ticketing']
      } else
        this.roleAccess = "Spectateur"
      this.ticketsOnglets = r.savedTicket
      if (this.TICKETID)
        this.TicketService.getPopulate(this.TICKETID).subscribe(ticket => {
          if (ticket && ticket?.agent_id?._id == this.token.id) {
            this.ticketsOnglets.push(ticket)
            this.MessageService.getAllByTicketID(ticket._id).subscribe(messages => {
              this.messageList = messages
            })
            setTimeout(() => {
              this.activeIndex1 = 2 + this.ticketsOnglets.length
            }, 2)
          }
        })
      this.updateTicketList(true)

    })

    this.dt1.filter(this.filterBase, 'statut', 'in')
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceDropdown.push({ label: val.label, value: val._id })
        this.filterService.push({ label: val.label, value: val._id })
        this.serviceDic[val._id] = val.label
      })
      this.SujetService.getAll().subscribe(dataSujet => {
        let serviceSujetDic = {}
        dataSujet.forEach(element => {
          this.sujetDic[element._id] = element.label
          if (serviceSujetDic[element.service_id])
            serviceSujetDic[element.service_id].push(element)
          else
            serviceSujetDic[element.service_id] = [element]
        });
        data.forEach((service: Service) => {
          if (serviceSujetDic[service._id]) {
            let items = []
            serviceSujetDic[service._id].forEach((suj: Sujet) => {
              items.push({ label: suj.label, value: suj._id })
            })
            this.filtreSujet.push({ label: service.label, value: service._id, items })
          }
        })
      })
    })

    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.filiereDropdown.push({ value: d._id, label: d.titre })
      })
    })
    this.AuthService.getAllAgentPopulate().subscribe(users => {
      let itemsSuperAdmin = []
      let itemsService = {}
      let serviceList: Service[] = []
      users.forEach(u => {
        let service_dic = {};
        u.roles_list.forEach((val) => {
          if (!service_dic[val.module])
            service_dic[val.module] = val.role
        })
        if (service_dic['Ticketing'] && service_dic['Ticketing'] == 'Super-Admin')
          itemsSuperAdmin.push({ label: `${u.firstname} ${u.lastname}`, value: u._id })
        if (u.roles_ticketing_list && u.roles_ticketing_list.length != 0) {
          u.roles_ticketing_list.forEach(r => {
            if (r.module) {
              if (!itemsService[r.module._id]) {
                itemsService[r.module._id] = [{ label: `${u.firstname} ${u.lastname}`, value: u._id }]
                serviceList.push(r.module)
              }
              else
                itemsService[r.module._id].push({ label: `${u.firstname} ${u.lastname}`, value: u._id })
            }
          })
        }
        if (u.service_list && u.service_list.length != 0) {
          u.service_list.forEach((r: Service) => {
            if (r) {
              if (!itemsService[r._id]) {
                itemsService[r._id] = [{ label: `${u.firstname} ${u.lastname}`, value: u._id }]
                serviceList.push(r)
              }
              else {
                let ids = []
                itemsService[r._id].forEach(element => {
                  ids.push(element.value)
                });
                if (ids.indexOf(u._id) == -1)
                  itemsService[r._id].push({ label: `${u.firstname} ${u.lastname}`, value: u._id })
              }

            }
          })
        }
      })
      this.filterAgent.push({
        label: "Tous les services",
        value: null,
        items: itemsSuperAdmin
      })
      serviceList.forEach(s => {
        this.filterAgent.push({
          label: s.label,
          value: s._id,
          items: itemsService[s._id]
        })
      })
    })
  }

  delete(ticket: Ticket, ri) {
    if (confirm("Êtes-vous sur de vouloir supprimer ce ticket ?")) {
      this.TicketService.delete(ticket._id).subscribe(data => {
        this.tickets.splice(this.tickets.indexOf(ticket), 1)
        this.defaultTicket.splice(this.defaultTicket.indexOf(ticket), 1)
        this.ToastService.add({ severity: 'success', summary: `Ticket ${ticket.customid} supprimé` })
      }, error => {
        console.error(error)
        this.ToastService.add({ severity: 'error', summary: `Ticket ${ticket.customid} n'a pas été supprimé`, detail: error.error })
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
    let statut = this.TicketForm.value.statut
    let assigne_by = this.ticketUpdate?.assigne_by
    let agent_id = this.ticketUpdate?.agent_id
    if (this.ticketAssign) {
      statut = "En cours de traitement"
      assigne_by = this.token.id
      agent_id = this.TicketForm.value.agent_id
      if (!agent_id && this.dropdownMember.length != 0)
        agent_id = this.dropdownMember[0].value
    }


    this.TicketService.update({ ...this.TicketForm.value, documents, statut, assigne_by }).subscribe(data => {
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
  TicketFormTraiter = new UntypedFormGroup({
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
        this.activeIndex1 = this.ticketsOnglets.length + 2
      })
      this.ToastService.add({ severity: 'success', summary: "Le ticket a été épinglé à vos onglets" })
    } else {
      this.activeIndex1 = ids.indexOf(ticket._id) + 3
      this.ToastService.add({ severity: 'info', summary: "Ce ticket se trouve déjà dans vos onglets" })
    }

  }
  goToAddTicket() {
    this.router.navigate(['ticketing/gestion/ajout'])
  }
  onCreateSujetLabel(ticket: Ticket) {
    let r = ''
    if (ticket?.sujet_id?.label)
      r = ticket?.sujet_id?.label
    if (ticket.module && ticket.module != "")
      r = r + " - " + ticket.module
    if (ticket.type && ticket.type != "")
      r = r + " - " + ticket.type
    if (ticket.campus && ticket.campus != "")
      r = r + " - " + ticket.campus
    if (ticket.filiere && ticket.filiere != "")
      r = r + " - " + ticket.filiere
    if (ticket.demande && ticket.demande != "")
      r = r + " - " + ticket.demande
    if (ticket.site && ticket.site != "")
      r = r + " - " + ticket.site
    return r
  }
  messageList = []
  loadCommentaires(event: any) {
    this.messageList = []
    if (event._id) {
      this.MessageService.getAllByTicketID(event._id).subscribe(messages => {
        this.messageList = messages
      })
    }
    else if (event.index > 2)
      this.MessageService.getAllByTicketID(this.ticketsOnglets[event.index - 3]._id).subscribe(messages => {
        this.messageList = messages
      })
  }
  deleteCom(idx, m: Message) {
    this.MessageService.delete(m._id).subscribe(delm => {
      this.messageList.splice(idx, 1)
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
    console.log(ticket)
    this.TicketService.sendMailUpdateStatut({ id: ticket.customid, statut: ticket.statut, createur_id: ticket.createur_id }).subscribe(() => { })
  }
  deleteTicket(ticket: Ticket) {
    this.ticketsOnglets.splice(this.ticketsOnglets.indexOf(ticket), 1)
    this.AuthService.update({ _id: this.token.id, savedTicket: this.ticketsOnglets }).subscribe(r => {
    })
  }

  handleClose(e) {
    this.deleteTicket(this.ticketsOnglets[e.index - 2])
  }
  filterType = ['Assigne']
  filterStatutTicket = []
  defaultTicket = []
  onFilterTicket() {
    this.ticketsService = []
    this.tickets = []
    if (this.filterType.indexOf('Assigne Service') != -1)
      this.filterType.splice(this.filterType.indexOf('Assigne Service'), 1)
    if (!this.filterType.includes('Non Assigne') && this.filterType.indexOf('Assigne Service') == -1)
      this.filterType.push('Assigne Service')
    this.createurList = []
    let ids = []
    this.defaultTicketService.forEach((t: Ticket) => {
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
      if (this.filterType.includes(t.origin) == false) {
        r = false
      }

      if (r) {
        this.ticketsService.push(t)
        if (t.createur_id && !ids.includes(t.createur_id._id)) {
          ids.push(t.createur_id._id)
          this.createurList.push({ label: `${t.createur_id.firstname} ${t.createur_id.lastname}`, value: t.createur_id._id })
        }
      }
    })
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
      if (this.filterType.includes(t.origin) == false) {
        r = false
      }

      if (r) {
        this.tickets.push(t)
        if (t.createur_id && !ids.includes(t.createur_id._id)) {
          ids.push(t.createur_id._id)
          this.createurList.push({ label: `${t.createur_id.firstname} ${t.createur_id.lastname}`, value: t.createur_id._id })
        }
      }
    })
    setTimeout(() => {
      this.filteredValues = this.dt1._value
      if (this.dt2)
        this.filteredValuesService = this.dt2._value
      else
        this.filteredValuesService = this.ticketsService
    }, 5)

    this.hideTicket = false
  }
  YpareoDropdown: any[] = [
    { label: 'Accés', value: "Acces" },
    { label: "Ajout d'un étudiant", value: "Ajout" },
    { label: 'Autre', value: "Autre" },
  ];
  MicrosoftDropdown: any[] = [
    { label: 'Réinitialisation du mot de passe', value: "Réinitialisation du mot de passe" },
    { label: 'Création du compte Microsoft 365', value: "Création du compte Microsoft 365" },
    { label: "Problème d'accès à Microsoft 365", value: "Problème d'accès à Microsoft 365" },
    { label: "Problème TEAMS", value: "Problème TEAMS" },
    { label: "Problème Outlook", value: "Problème Outlook" },
    { label: "Problème OneDrive", value: "Problème OneDrive" },
  ];
  SiteinternetDropdown: any[] = [
    { label: 'Contenu', value: "Contenu" },
    { label: "Formulaire d'admission", value: "Formulaire d'admission" },
    { label: 'Beug', value: "Beug" },
    { label: 'Autre', value: "Autre" },
  ];
  moduleDropdown: any[] = [
    { label: 'Espace Personnel', value: "Espace Personnel" },
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
    { label: 'Module Remboursement', value: "Module Remboursement" },
    { label: 'Autre', value: "Autre" },
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
    } else if (selectedSubject === "Ypareo") {

      this.showDemandeDropdown = true;
      this.demandeDropdown = this.YpareoDropdown;
    } else if (selectedSubject === "Microsoft") {

      this.showDemandeDropdown = true;
      this.demandeDropdown = this.MicrosoftDropdown
    } else if (selectedSubject === "Site internet") {

      this.showDemandeDropdown = true;
      this.demandeDropdown = this.SiteinternetDropdown;
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

  onAutoAssign(ticket: Ticket) {
    this.TicketService.update({ _id: ticket._id, agent_id: this.token.id, assigne_by: this.token.id }).subscribe(data => {
      this.updateTicketList()
      this.TicketForm.reset()
      this.ToastService.add({ severity: 'success', summary: "Auto Assignation du Ticket avec succès" })
    })
  }
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
  filteredValues = []
  filteredValuesService = []
  onAddTicket(e) {
    this.updateTicketList()
  }
  onFilter(event, dt: Table, id: string) {
    if (id == "dt1")
      this.filteredValues = event.filteredValue
    else if (id == "dt2")
      this.filteredValuesService = event.filteredValue
    else
      console.log(dt, event)
  }
  filiereDropdown: any[] = [];
  showPedagogieFilter() {
    let r = false
    this.serviceFiltered.forEach(s => {
      if (this.serviceDic[s] == 'Pédagogie' || this.serviceDic[s] == 'Pedagogie' || this.serviceDic[s] == 'Administration')
        r = true
    })
    return r
  }
  filterDate(tab, val) {
    let d1 = new Date(val)
    d1.setHours(0, 0, 0)
    this.dt1.filter(d1.toISOString(), 'date_ajout', "gte")
    /*d1.setHours(23,59,0)
    this.dt1.filter(d1.toISOString(), 'date_ajout', "lte")*/
  }

  customIndexOf(list: Ticket[], id: string) {
    let r = -1
    list.forEach((u, index) => {
      if (u._id == id)
        r = index
    })
    console.log(r)
    return r
  }

}

