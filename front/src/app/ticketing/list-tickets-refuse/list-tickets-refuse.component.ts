import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-list-tickets-refuse',
  templateUrl: './list-tickets-refuse.component.html',
  styleUrls: ['./list-tickets-refuse.component.scss']
})
export class ListTicketsRefuseComponent implements OnInit {


  constructor(private TicketService: TicketService, private ToastService: MessageService) { }
  tickets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  ngOnInit(): void {
    this.TicketService.getAllRefuse().subscribe(data => {
      this.tickets = data
    })
  }

  getAttente(temp_date) {
    let date_creation = new Date(temp_date).getTime()
    let total = new Date().getTime() - date_creation
    let day = Math.floor(total / 86400000)
    total = total % 86400000
    let hours =  Math.floor(total / 3600000)
    total = total % 3600000
    let minutes =  Math.floor(total / 60000)
    return `${day}J ${hours}H${minutes}m`
  }

}
