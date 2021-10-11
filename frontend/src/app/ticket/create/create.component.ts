import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  selectedService;
  listServices;
  listSujets:any=[];

  TicketForm: FormGroup= new FormGroup({
    description:new FormControl('',Validators.required),
    sujet:new FormControl('',Validators.required),
    service:new FormControl('',Validators.required),
  })

  addTicket(){
    //Enregistrement du Ticket
    let req = {
      id:jwt_decode(localStorage.getItem("token"))["id"],
      sujet_id:this.TicketForm.value.sujet._id,
      description:this.TicketForm.value.description,
      //document:this.TicketForm.value//TODO
    }
    this.TicketService.create(req).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Création du ticket', detail:'Votre ticket a bien été crée'});
      this.router.navigate(['/'])
    },(error)=>{
      console.error(error)
    });
    
  }

  onChange(){
    this.TicketForm.patchValue({
      sujet:this.listSujets[this.TicketForm.value.service._id][0]
    })
  }

  get description() { return this.TicketForm.get('description'); }

  constructor(private router: Router,private TicketService:TicketService,private sujetServ:SujetService,private serv:ServService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.serv.getAll().subscribe((data)=>{
      this.listServices=data;
      data.forEach(service => {
        this.listSujets[service._id]=[];
      });
      this.sujetServ.getAll().subscribe((data)=>{
        data.forEach(sujet => {
          this.listSujets[sujet.service_id].push(sujet);
        });
      })
    },(error)=>{
      console.error(error)
    })

  }

}
