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


  notifications: any = [];
  listTicket: any[] = [];
  sujetDic: any[] = [];
  constructor(private NotificationService: NotificationService, private TicketService: TicketService,private SujetService:SujetService) { }
  // "Nouveau Ticket Affecté" "Modification d'un ticket" "Nouveau Message" "Traitement de votre ticket" "Revert d'un ticket"

  ngOnInit(): void {
    let token = localStorage.getItem("token")
    if (token) {
      token = jwt_decode(token)
      this.NotificationService.get20ByUserID(token["id"])
        .subscribe(
          data => {
            this.notifications = data;
            console.log(data)
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
          this.SujetService.getAll().subscribe(data=>{
            data.forEach(sujet => {
              this.sujetDic[sujet._id]=sujet;
            });
          })
    }

  }
  retirer(notification): void {

    this.NotificationService.viewNotifByID(notification._id)
      .subscribe(
        response => {
          this.notifications.splice(this.notifications.indexOf(notification), 1);
        },
        error => {
          console.log(error);
        });
  }
  retirertout() {
    this.NotificationService.viewNotifs(this.notifications)
      .subscribe(
        response => {

          this.notifications = [];
        },
        error => {
          console.log(error);
        });
  }

}