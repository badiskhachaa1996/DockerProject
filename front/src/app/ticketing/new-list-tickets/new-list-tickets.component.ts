import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
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
  constructor(private TicketService: TicketService, private ToastService: MessageService,
    private ServService: ServService, private SujetService: SujetService, private AuthService: AuthService,
    private NotifService: NotificationService, private Socket: SocketService, private router: Router) { }
  tickets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required),
    documents: new FormControl([]),
    _id: new FormControl('', Validators.required)
  })
  stats = {
    en_attente: 0
  }
  token: any;
  filterService = [{ label: 'Tous les services', value: null }]
  filterStatut = [
    { label: 'Tous les statuts', value: null },
    { label: 'En attente', value: "En attente de traitement" },
    { label: 'En cours', value: "En cours de traitement" },
    { label: 'Traité', value: "Traité" },
  ]

  updateTicketList() {
    this.TicketService.getAllMine(this.token.id).subscribe(data => {
      this.tickets = data
      data.forEach(e => { e.origin = true })
      this.stats = {
        en_attente: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'En attente de traitement' ? 1 : 0), 0))
      }
    })
    this.TicketService.getAllAssigne(this.token.id).subscribe(data => {
      data.forEach(e => { e.origin = false })
      this.tickets = this.tickets.concat(data)
    })
  }
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'))
    this.updateTicketList()
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceDropdown.push({ label: val.label, value: val._id })
        this.filterService.push({ label: val.label, value: val._id })
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
      this.TicketService.getAllMine(this.token.id).subscribe(data => {
        this.tickets = data
      })
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
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
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
  onUpload(event: { files: File[] }, fileUpload: FileUpload) {
    this.uploadedFiles.push(event.files[0])
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
  onConvertText(description: string) {
    if (description && description.length > 20)
      description = description.substring(0, 20) + "..."
    return description
  }

  seeMore(str: string, type = "Description") {
    this.seeMoreObj = { str, type }
    this.seeMoreBool = true
  }
  seeMoreObj = { str: "", type: "" }
  seeMoreBool = false
  ticketTraiter: Ticket
  onTraiter(ticket, index) {
    this.ticketTraiter = ticket
    this.TicketForm.patchValue({ ...ticket })
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
        formData.append('document_id', documents_service[idx]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
    })
  }

  ReAssign(ticket: Ticket) {

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
}

