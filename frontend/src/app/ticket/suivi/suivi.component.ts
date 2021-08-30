import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {

  ticketList:Ticket[];
  token:any;

  serviceList=[];
  sujetList=[];

  first = 0;
  rows = 10;

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

  constructor(private router:Router,private AuthService:AuthService,private TicketService:TicketService,private SujetService:SujetService,private ServService:ServService) { }

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
        data.forEach(sujet => {
          this.sujetList[sujet._id]={"label":sujet.label,"service_id":sujet.service_id};
        });
      }
    })
    
    this.ServService.getAll().subscribe((data) => {
      if(!data.message){
        data.forEach(service => {
          this.serviceList[service._id]=service.label;
        });
      }
    })
  }
  modify(data){
    this.router.navigateByUrl("/ticket/update",{state:data})
  }

}
