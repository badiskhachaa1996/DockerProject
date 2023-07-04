import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { TicketService } from 'src/app/services/ticket.service';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-list-tickets-traite',
  templateUrl: './list-tickets-traite.component.html',
  styleUrls: ['./list-tickets-traite.component.scss']
})
export class ListTicketsTraiteComponent implements OnInit {


  constructor(private TicketService: TicketService, private ToastService: MessageService, private ServService: ServService, private UserService: AuthService) { }
  tickets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  filterService = [{ label: 'Tous les services', value: null }]
  ngOnInit(): void {
    this.TicketService.getAllTraite().subscribe(data => {
      this.tickets = data
    })
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.filterService.push({ label: val.label, value: val._id })
      })
    })
  }

  getTraitement(date_traitement, date_ajout) {
    let total = new Date(date_traitement).getTime() - new Date(date_ajout).getTime()
    let day = Math.floor(total / 86400000)
    total = total % 86400000
    let hours = Math.floor(total / 3600000)
    total = total % 3600000
    let minutes = Math.floor(total / 60000)
    return `${day}J ${hours}H${minutes}m`
  }

  getMoyenneTraitement() {
    let totalTimeStamp = 0
    this.tickets.forEach((val: Ticket) => {
      totalTimeStamp += new Date(val.date_fin_traitement).getTime() - new Date(val.date_ajout).getTime()
    })
    totalTimeStamp = totalTimeStamp / this.tickets.length
    let day = Math.floor(totalTimeStamp / 86400000)
    totalTimeStamp = totalTimeStamp % 86400000
    let hours = Math.floor(totalTimeStamp / 3600000)
    totalTimeStamp = totalTimeStamp % 3600000
    let minutes = Math.floor(totalTimeStamp / 60000)
    return `${day}J ${hours}H${minutes}m`
  }

  TicketAffecter = null
  dropdownMember = []
  formAffectation = new FormGroup({
    _id: new FormControl('', Validators.required),
    agent_id: new FormControl('', Validators.required),
    date_limite: new FormControl(''),
    note_assignation: new FormControl(''),
  })
  initAffecter(ticket) {
    this.TicketAffecter = ticket
    this.formAffectation.patchValue({ ...ticket })
    this.UserService.getAllByServiceFromList(ticket.sujet_id.service_id._id).subscribe(data => {
      this.dropdownMember = []
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }

  memberSelected: string;
  onAffectation() {
    this.TicketService.update({ ...this.formAffectation.value }).subscribe(data => {
      this.tickets.splice(this.tickets.indexOf(this.TicketAffecter), 1)
      this.TicketAffecter = null
      this.ToastService.add({ severity: 'success', summary: "Affectation du ticket avec succès" })
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
