import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TicketService } from '../services/ticket.service';
import jwt_decode from "jwt-decode";
import { SujetService } from '../services/sujet.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  token = null;
  notifications: any = [];
  listTicket: any[] = [];
  sujetDic: any[] = [];
  retour: boolean = false;
  constructor(private NotificationService: NotificationService, private TicketService: TicketService, private SujetService: SujetService) { }
  // "Nouveau Ticket Affecté" "Modification d'un ticket" "Nouveau Message" "Traitement de votre ticket" "Revert d'un ticket"

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))

    if (this.token["role"].includes("user")) {
      this.retour = true;
    }

    let token = localStorage.getItem("token")
    // this.NotificationService.refreshNeeded.subscribe(() =>{
    //   this.NotificationService.get20ByUserID(token["id"]);
    //  });
    // }
    // public get20ByUserID(){

    if (token) {


      token = jwt_decode(token)
      this.NotificationService.get20ByUserID(token["id"])
        .subscribe(
          data => {
            this.notifications = data;
            this.NotificationService.viewNotifs(this.notifications)
              .subscribe(
                response => {
                },
                error => {
                  console.log(error);
                });
          },
          error => {
            console.log(error);
          });

      this.TicketService.getAll()
        .subscribe(
          data => {
            data.forEach(ticket => {
              this.listTicket[ticket._id] = ticket;
            });
          },
          error => {
            console.log(error);
          });
      this.SujetService.getAll().subscribe(data => {
        data.forEach(sujet => {
          this.sujetDic[sujet._id] = sujet;
        });
      })
    }

  }
}
