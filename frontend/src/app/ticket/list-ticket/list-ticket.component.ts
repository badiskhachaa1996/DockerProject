import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit {

  serviceList=[];
  sujetList=[];

  queueList: any[] = [];
  AccAffList: any[] = [];
  allTickets: any[] = [];

  cols: any[];

  draggedTicket: any;

  showForm: string = "Ajouter";

  dragStart(event, user: any) {
    this.draggedTicket = user;
  }

  dragEnd(event) {
    this.draggedTicket = null;
  }

  //QueueToAccAff
  dragListToPreInscrit(event?) {
    this.queueList.splice(this.queueList.indexOf(this.draggedTicket), 1)
    this.AccAffList.push(this.draggedTicket)
    this.Accepted()
  }

  //AccAffToAll
  dragPreInscritToInscrit(event?) {
    this.AccAffList.splice(this.AccAffList.indexOf(this.draggedTicket), 1)
    this.allTickets.push(this.draggedTicket)
  }

  //AllToQueue
  dragInscritToList(event?) {
    this.allTickets.splice(this.allTickets.indexOf(this.draggedTicket), 1)
    this.queueList.push(this.draggedTicket)
  }

  constructor(private TicketService:TicketService,private SujetService:SujetService,private ServService:ServService,private router:Router) { }

  ngOnInit(): void {
    let token = jwt_decode(localStorage.getItem("token"))
    if(token==null){
      this.router.navigate(["/login"])
    }else if(!token["role"].includes("agent")){
      //this.router.navigate(["/ticket/suivi"])
    }
    this.TicketService.getQueue().subscribe((data) => {
      this.queueList = data;
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

    this.TicketService.getAccAff().subscribe((data) => {
      if(!data.message){
        this.queueList = data;
      }
    })

    this.cols = [
      { field: 'serviceList[sujetList[sujet_id].service_id]', header: 'Service' },
      { field: 'sujetList[sujet_id]', header: 'Sujet' },
    ];
  }

  //QueueToAccAff
  ListToPreInscrit(user, event?) {
    this.queueList.splice(this.queueList.indexOf(user), 1)
    this.AccAffList.push(user)
    this.Accepted()
  }

  //AccAffToAll
  PreInscritToInscrit(user, event?) {
    this.AccAffList.splice(this.AccAffList.indexOf(user), 1)
    this.allTickets.push(user)
  }

  //AllToQueue
  InscritToList(user, event?) {
    this.allTickets.splice(this.allTickets.indexOf(user), 1)
    this.queueList.push(user)
  }

  Accepted(){
    //TODO Affected to the user
  }

  getServiceIDOfUser(){
    //TODO En fonction du role du joueur doit return l'id de son service
    let token = localStorage.getItem("token")
    let user;
    if(token!=null){
      user=jwt_decode(token)
      if(user.role=="admin"){
        return "Admin"
      }else if(user.role=="Agent Admission" || user.role=="Responsable Admission"){
        return "Admission"
      }
    }
  }

  modify(data){
    this.router.navigateByUrl("/ticket/update",{state:data})
  }
}
