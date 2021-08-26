import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  selectedService;

  TicketForm: FormGroup= new FormGroup({
    description:new FormControl('',Validators.required)
  })

  addTicket(){
    //Enregistrement du Ticket
    let req = <any>{
      id:jwt_decode(localStorage.getItem("token")["id"]),
      sujet_id:this.TicketForm.value,//TODO
      description:this.TicketForm.value.description,
      document:this.TicketForm.value//TODO
    }
    this.TicketService.create(req).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Création du Ticket', detail:'Création réussie'});
      this.router.navigate(['/'])
    },(error)=>{
      console.log(error)
    });
    
  }

  get description() { return this.TicketForm.get('description'); }

  constructor(private router: Router,private TicketService:TicketService,private messageService: MessageService) { }

  ngOnInit(): void {
  }

}
