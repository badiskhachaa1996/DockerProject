import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { ServService } from 'src/app/services/service.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-list-tickets-traite',
  templateUrl: './list-tickets-traite.component.html',
  styleUrls: ['./list-tickets-traite.component.scss']
})
export class ListTicketsTraiteComponent implements OnInit {


  constructor(private TicketService: TicketService, private ToastService: MessageService, private ServService: ServService) { }
  tickets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  filterService = []
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
  initAffecter(ticket) {
    this.TicketAffecter = ticket
  }

  onAffectation(id) {
    console.log(id)
    this.TicketService.update({ _id: this.TicketAffecter._id, agent_id: id }).subscribe(data => {
      this.tickets.splice(this.tickets.indexOf(this.TicketAffecter), 1)
      this.TicketAffecter = null
      this.ToastService.add({ severity: 'success', summary: "Affectation du ticket avec succès" })
    })
  }

}
