import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { Ticket } from 'src/app/models/Ticket';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  Ticket: Ticket;
  firstMessage:Message;

  selectedService;
  listServices;
  listSujets: any = [];
  listSujetSelected = [];

  TicketForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),//Ils doit forcément selectionner
    service: new FormControl('', Validators.required),
  })

  get description() { return this.TicketForm.get('description'); }

  constructor(private router: Router,private TicketService:TicketService,private sujetServ:SujetService,private serv:ServService) { }

  ngOnInit(): void {
    this.Ticket = <Ticket>history.state;
    if (!this.Ticket._id) {
      this.router.navigate(["/"])
    }
    this.serv.getAll().subscribe((data) => {
      this.listServices = data;
      data.forEach(service => {
        this.listSujets[service._id] = [];
      });
    }, (error) => {
      console.log(error)
    })

    this.sujetServ.getAll().subscribe((data) => {
      data.forEach(sujet => {
        this.listSujets[sujet.service_id].push(sujet);
      });
      console.log(this.listSujets)
    }, (error) => {
      console.log(error)
    })

    this.TicketService.getFirstMessage(this.Ticket._id).subscribe((data)=>{
      this.firstMessage=data;
    },(error)=>{
      console.log(error)
    })

  }

}
