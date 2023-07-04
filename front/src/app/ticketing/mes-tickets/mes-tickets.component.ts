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
@Component({
  selector: 'app-mes-tickets',
  templateUrl: './mes-tickets.component.html',
  styleUrls: ['./mes-tickets.component.scss']
})
export class MesTicketsComponent implements OnInit {
  sujetDropdown: any[] = [
  ];
  serviceDropdown: any[] = [
  ];
  prioriteDropdown: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];
  constructor(private TicketService: TicketService, private ToastService: MessageService, private ServService: ServService, private SujetService: SujetService) { }
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
    en_attente: 0,
    en_suspension: 0,
    traite: 0
  }
  token: any;
  filterService = [{ label: 'Tous les services', value: null }]
  filterStatut = [
    { label: 'Tous les états de traitement', value: null },
    { label: 'En attente de traitement', value: "En attente de traitement" },
    { label: 'En cours de traitement', value: "En cours de traitement" },
    { label: 'En suspension', value: "En suspension" },
    { label: 'Traité', value: "Traité" },
  ]
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'))
    this.TicketService.getAllMine(this.token.id).subscribe(data => {
      this.tickets = data
      this.stats = {
        en_attente: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'En attente de traitement' ? 1 : 0), 0)),
        en_suspension: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'En suspension' ? 1 : 0), 0)), // Somme ((Statut de commission équal à Facturé payé ou A la source ou Compensation) *Montant de la commission)  
        //next?.statut == 'Facture payé' || next?.statut == 'A la source' || next?.statut == 'Compensation'
        traite: Math.trunc(data.reduce((total, next) => total + (next?.statut == 'Traité' ? 1 : 0), 0)),
      }
    })
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
    if (this.uploadedFiles[0]) {
      documents.push({ path: this.uploadedFiles[0].name, name: this.uploadedFiles[0].name, _id: new mongoose.Types.ObjectId().toString() })
    }
    this.TicketService.update({ ...this.TicketForm.value, documents }).subscribe(data => {
      this.TicketService.getAllMine(this.token.id).subscribe(data => {
        this.tickets = data
      })
      if (this.uploadedFiles[0]) {
        let formData = new FormData()
        formData.append('ticket_id', data._id)
        formData.append('document_id', documents[documents.length - 1]._id)
        formData.append('file', this.uploadedFiles[0])
        formData.append('path', this.uploadedFiles[0].name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès' })
        })
      }
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
  onUpload(event: { files: File[] }) {
    this.uploadedFiles = event.files
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
}
