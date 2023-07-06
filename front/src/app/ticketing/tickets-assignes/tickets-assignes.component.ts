import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tick } from 'chart.js';
import { subscribeOn } from 'rxjs';
import { Ticket } from 'src/app/models/Ticket';
import { ServService } from 'src/app/services/service.service';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';

import { saveAs } from "file-saver";
import mongoose from 'mongoose';
import { FileUpload } from 'primeng/fileupload';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { SocketService } from 'src/app/services/socket.service';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-tickets-assignes',
  templateUrl: './tickets-assignes.component.html',
  styleUrls: ['./tickets-assignes.component.scss']
})
export class TicketsAssignesComponent implements OnInit {
  constructor(private TicketService: TicketService, private ServService: ServService, private ToastService: MessageService,
    private AuthService: AuthService, private Socket: SocketService, private NotifService: NotificationService) { }
  tickets = []
  USER: User
  stats = {
    en_attente: 0,
    en_suspension: 0,
    traite: 0
  }
  ticketTraiter: Ticket;
  TicketForm = new FormGroup({
    note: new FormControl(''),
    documents: new FormControl([]),
    statut: new FormControl(''),
    _id: new FormControl('', Validators.required)
  })
  filterService = [{ label: 'Tous les services', value: null }]
  filterStatut = [
    { label: 'Tous les états de traitement', value: null },
    { label: 'En attente de traitement', value: "En attente de traitement" },
    { label: 'En cours de traitement', value: "En cours de traitement" },
    { label: 'En suspension', value: "En suspension" },
    { label: 'Traité', value: "Traité" },
  ]
  filterPriorite = [
    { label: 'Toutes les priorité', value: null },
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ]
  onUpdate() {
    let date_fin_traitement = null
    if (this.TicketForm.value.statut == 'Traité')
      date_fin_traitement = new Date()

    let documents = this.TicketForm.value.documents
    if (!documents)
      documents = []
    this.uploadedFiles.forEach(element => {
      documents.push({ path: element.name, name: element.name, _id: new mongoose.Types.ObjectId().toString() })
    });
    this.TicketService.update({ ...this.TicketForm.value, date_fin_traitement, documents }).subscribe(data => {
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
        formData.append('ticket_id', data.doc._id)
        formData.append('document_id', documents[idx]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
    })
  }
  // En attente de traitement (par défaut) / En cours de traitement / En suspension / Traité  
  etatDropdown = [
    { label: 'En attente de traitement', value: "En attente de traitement" },
    { label: 'En cours de traitement', value: "En cours de traitement" },
    { label: 'En suspension', value: "En suspension" },
    { label: 'Traité', value: "Traité" },
  ]
  token;

  updateTicketList() {
    this.TicketService.getAllAssigne(this.token.id).subscribe(data => { //getAllAssigne
      this.tickets = data
      this.stats = {
        en_attente: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'En attente de traitement' ? 1 : 0), 0)),
        en_suspension: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'En suspension' ? 1 : 0), 0)),
        traite: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'Traité' ? 1 : 0), 0)),
      }
    })
  }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.updateTicketList()
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.filterService.push({ label: val.label, value: val._id })
      })
    })
    this.AuthService.getPopulate(this.token.id).subscribe(data => { this.USER = data })
  }
  isDecline: Ticket;
  formDecline = new FormGroup({
    justificatif: new FormControl('', Validators.required)
  })
  initDecline(ticket) {
    this.isDecline = ticket
  }

  decline() {
    this.TicketService.update({ _id: this.isDecline._id, justificatif: this.formDecline.value.justificatif, isReverted: true, statut: "En attente de traitement", date_revert: new Date(), user_revert: this.isDecline.agent_id._id, agent_id: null, isAffected: null }).subscribe(data => {
      this.Socket.NewNotifV2('Ticketing - Super-Admin', `L'agent ${this.USER.lastname} ${this.USER.firstname} a refusé le ticket pour le motif ${this.formDecline.value.justificatif}`)
      this.TicketService.sendMailRefus({ agent_name: `${this.USER.lastname} ${this.USER.firstname}`, motif: this.formDecline.value.justificatif })
      this.NotifService.createV2(new Notification(null, null, false,  `L'agent ${this.USER.lastname} ${this.USER.firstname} a refusé le ticket pour le motif ${this.formDecline.value.justificatif}`, new Date(), null, this.isDecline?.sujet_id?.service_id?._id), 'Ticketing', "Super-Admin").subscribe(test => { console.log(test) })
        
      this.formDecline.reset()

      this.tickets.splice(this.tickets.indexOf(this.isDecline), 1)
      this.isDecline = null
    })
  }

  onTraiter(ticket, index) {
    this.ticketTraiter = ticket
    this.TicketForm.patchValue({ ...ticket })
  }

  ticketPriorite: Ticket
  prioriteForm = new FormGroup({
    priorite_agent: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required),
  })

  prioriteDropdown: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];

  onInitPriorite(ticket, index) {
    this.ticketPriorite = ticket
    this.prioriteForm.patchValue({ ...ticket })
  }

  onUpdatePriorite() {
    this.TicketService.update({ ...this.prioriteForm.value }).subscribe(data => {
      this.TicketForm.reset()
      this.updateTicketList()
      this.ticketPriorite = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de la priorité du ticket avec succès' })
    })
  }

  getAttente(temp_date) {
    let date_creation = new Date(temp_date).getTime()
    let total = new Date().getTime() - date_creation
    let day = Math.floor(total / 86400000)
    total = total % 86400000
    let hours = Math.floor(total / 3600000)
    total = total % 3600000
    let minutes = Math.floor(total / 60000)
    return `${day}J ${hours}H${minutes}m`
  }

  getTraitement(temp_date) {
    let date_creation = new Date(temp_date).getTime()
    let total = new Date().getTime() - date_creation
    let day = Math.floor(total / 86400000)
    total = total % 86400000
    let hours = Math.floor(total / 3600000)
    total = total % 3600000
    let minutes = Math.floor(total / 60000)
    return `${day}J ${hours}H${minutes}m`
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

}
