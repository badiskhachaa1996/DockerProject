import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { Ticket } from 'src/app/models/Ticket';
import jwt_decode from "jwt-decode";
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';
import { MessageService } from 'primeng/api';

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
  dicIDServices;
  listSujets: any = [];
  listSujetSelected = [];

  TicketForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),//Ils doit forcément selectionner
    service: new FormControl('', Validators.required),
  })

  addTicket(){
    //Enregistrement du Ticket
    console.log(this.TicketForm.value)
    let req = {
      id:this.Ticket._id,
      id_message:this.firstMessage._id,
      sujet_id:this.TicketForm.value.sujet._id,
      description:this.TicketForm.value.description,
      //document:this.TicketForm.value//TODO
    }
    this.TicketService.updateFirst(req).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Modification du Ticket', detail:'Modification réussie'});
      this.router.navigate(['/ticket/suivi'])
    },(error)=>{
      console.log(error)
    });
    
  }

  get description() { return this.TicketForm.get('description'); }

  constructor(private router: Router,private TicketService:TicketService,private sujetServ:SujetService,private serv:ServService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.Ticket = <Ticket>history.state;
    if (!this.Ticket._id) {
      this.router.navigate(["/ticket/suivi"])
    }
    this.serv.getAll().subscribe((data) => {
      this.listServices = data;
      data.forEach(service => {
        this.listSujets[service._id] = [];
      });
      this.sujetServ.getAll().subscribe((data) => {
        data.forEach(sujet => {
          this.listSujets[sujet.service_id].push(sujet);
          if(sujet._id==this.Ticket.sujet_id){
            this.listServices.forEach(serv => {
              if(serv._id==sujet.service_id){
                this.TicketForm.patchValue({service:serv,sujet:sujet})
              }
            });
          }
        });
      }, (error) => {
        console.log(error)
      })
    }, (error) => {
      console.log(error)
    })

    this.TicketService.getFirstMessage(this.Ticket._id).subscribe((data)=>{
      this.firstMessage=data.dataMessage;
      this.TicketForm.patchValue({description:this.firstMessage.description})
    },(error)=>{
      console.log(error)
    })

  }

}
