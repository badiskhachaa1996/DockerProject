import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  [x: string]: any;

  ticketList:Ticket[];
  token:any;

  serviceList=[];
  sujetList=[];

  filterService;
  filterSujet;
  filterStatut;

  first = 0;
  rows = 10;

  showForm: string = "Ajouter";

  selectedService;
  listServices;
  listSujets:any=[];


  
  
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.ticketList ? this.first === (this.ticketList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.ticketList ? this.first === 0 : true;
  }

  constructor(private router:Router, private AuthService:AuthService,private TicketService:TicketService,private SujetService:SujetService,private ServService:ServService) { }

  ngOnInit(): void {
    let token = localStorage.getItem("token")
    if(token==null){
      this.router.navigate(["/login"])
    }
    this.token=jwt_decode(token);
    this.TicketService.getAllByUser(this.token["id"]).subscribe((data)=>{
      this.ticketList=data;
    },(error)=>{
      console.log(error)
    })
    
    this.SujetService.getAll().subscribe((data) => {
      if(!data.message){
        //{ label: 'Tous les sujets', value: null }
          this.filterSujet=data;
        data.forEach(sujet => {
          this.sujetList[sujet._id]={"label":sujet.label,"service_id":sujet.service_id};
        });
      }
    })
    
    this.ServService.getAll().subscribe((data) => {
      if(!data.message){
        //{ label: 'Tous les services', value: null }
        this.filterService=data;
        data.forEach(service => {
          this.serviceList[service._id]=service.label;
        });
      }
    })
  }
  modify(data){
    this.router.navigateByUrl("/ticket/update",{state:data})
  }

  toggleForm() {
    if (this.showForm == "Ajouter") {
      this.showForm = "Fermer";
    } else {
      this.showForm = "Ajouter"
    }

  }

  TicketForm: FormGroup= new FormGroup({
    description:new FormControl('',Validators.required),
    sujet:new FormControl('',Validators.required),
    service:new FormControl('',Validators.required),
  })


  addTicket(){
    //Enregistrement du Ticket
    let req = <any>{
      id:jwt_decode(localStorage.getItem("token"))["id"],
      sujet_id:this.TicketForm.value.sujet._id,
      description:this.TicketForm.value.description,
      //document:this.TicketForm.value//TODO
    }
    this.TicketService.create(req).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Création du Ticket', detail:'Création réussie'});
      this.router.navigate(['/'])
    },(error)=>{
      console.log(error)
    });
    
  }

  onChange(){
    this.TicketForm.patchValue({
      sujet:this.listSujets[this.TicketForm.value.service._id][0]
    })
  }

  get description() { return this.TicketForm.get('description'); }
 }


