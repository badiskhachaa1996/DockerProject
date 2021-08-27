import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  styleUrls: ['./list-ticket.component.css']
})
export class ListTicketComponent implements OnInit {

  serviceList=[];
  sujetList=[];

  tabUser: any[] = [];
  UserPreInscrit: any[] = [];
  UserInscrit: any[] = [];

  cols: any[];

  draggedUser: any;

  showForm: string = "Ajouter";

  dragStart(event, user: any) {
    this.draggedUser = user;
  }

  dragEnd(event) {
    this.draggedUser = null;
  }

  dragListToPreInscrit(event?) {
    this.tabUser.splice(this.tabUser.indexOf(this.draggedUser), 1)
    this.UserPreInscrit.push(this.draggedUser)
    this.Accepted()
  }

  dragPreInscritToInscrit(event?) {
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(this.draggedUser), 1)
    this.UserInscrit.push(this.draggedUser)
  }

  dragInscritToList(event?) {
    this.UserInscrit.splice(this.UserInscrit.indexOf(this.draggedUser), 1)
    this.tabUser.push(this.draggedUser)
  }

  constructor(private TicketService:TicketService,private SujetService:SujetService,private ServService:ServService,private router:Router) { }

  ngOnInit(): void {
    this.TicketService.getQueue().subscribe((data) => {
      this.tabUser = data;
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
        this.tabUser = data;
      }
    })

    this.cols = [
      { field: 'serviceList[sujetList[sujet_id].service_id]', header: 'Service' },
      { field: 'sujetList[sujet_id]', header: 'Sujet' },
    ];
  }
  ListToPreInscrit(user, event?) {
    this.tabUser.splice(this.tabUser.indexOf(user), 1)
    this.UserPreInscrit.push(user)
    this.Accepted()
  }

  PreInscritToInscrit(user, event?) {
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(user), 1)
    this.UserInscrit.push(user)
  }

  InscritToList(user, event?) {
    this.UserInscrit.splice(this.UserInscrit.indexOf(user), 1)
    this.tabUser.push(user)
  }

  Accepted(){
    //TODO Affected to the user

  }

  modify(data){
    this.router.navigateByUrl("/ticket/update",{state:data})
  }
}
