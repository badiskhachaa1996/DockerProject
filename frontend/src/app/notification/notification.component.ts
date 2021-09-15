import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TicketService } from '../services/ticket.service';
import jwt_decode from "jwt-decode";
import { SujetService } from '../services/sujet.service';
import { AuthService } from '../services/auth.service';
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
  userDic: any[] = [];
  retour: boolean = false;
  constructor(private NotificationService: NotificationService, private TicketService: TicketService, private SujetService: SujetService, private AuthService:AuthService) { }
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
                  this.NotificationService.reloadNotif({id:jwt_decode(localStorage.getItem("token"))["id"]})
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
      this.AuthService.getAll().subscribe(data=>{
        data.forEach(element => {
          this.userDic[element._id]= element;
        });
      })
    }

  }
}
