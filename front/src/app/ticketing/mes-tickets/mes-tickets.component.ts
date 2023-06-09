import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-mes-tickets',
  templateUrl: './mes-tickets.component.html',
  styleUrls: ['./mes-tickets.component.scss']
})
export class MesTicketsComponent implements OnInit {

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
    let token: any = jwt_decode(localStorage.getItem('token'))
    this.TicketService.getAllMine(token.id).subscribe(data => {
      this.tickets = data
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
    this.TicketForm.patchValue({ ...ticket })
  }

  onSubmitUpdate() {
    this.TicketService.update({ ...this.TicketForm.value }).subscribe(data => {
      this.TicketForm.reset()
      this.ticketUpdate = null
      this.ToastService.add({ severity: 'success', summary: "Modification du Ticket avec succès" })
    })
  }

  onSelectService() {

  }

}
