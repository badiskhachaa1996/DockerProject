import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tick } from 'chart.js';
import { subscribeOn } from 'rxjs';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-tickets-assignes',
  templateUrl: './tickets-assignes.component.html',
  styleUrls: ['./tickets-assignes.component.scss']
})
export class TicketsAssignesComponent implements OnInit {
  constructor(private TicketService: TicketService) { }
  tickets = []
  ticketTraiter: Ticket;
  TicketForm = new FormGroup({
    note: new FormControl(''),
    statut: new FormControl(''),
    _id: new FormControl('', Validators.required)
  })

  onUpdate() {
    this.TicketService.update({ ...this.TicketForm.value }).subscribe(data => {

    })
  }
  // En attente de traitement (par défaut) / En cours de traitement / En suspension / Traité  
  etatDropdown = [
    { label: 'En attente de traitement', value: "En attente de traitement" },
    { label: 'En cours de traitement', value: "En cours de traitement" },
    { label: 'En suspension', value: "En suspension" },
    { label: 'Traité', value: "Traité" },
  ]
  ngOnInit(): void {
    this.TicketService.getAll().subscribe(data => {
      this.tickets = data
    })
  }

  decline(ticket, ri) {
    if (confirm()) {
      this.tickets.splice(ri, 1)
    }
  }

  onTraiter(ticket, index) {
    this.ticketTraiter = ticket
    this.TicketForm.patchValue({ ...ticket })
  }

}
