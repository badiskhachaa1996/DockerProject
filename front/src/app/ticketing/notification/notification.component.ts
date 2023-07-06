import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { TicketService } from '../../services/ticket.service';
import jwt_decode from "jwt-decode";
import { SujetService } from '../../services/sujet.service';
import { AuthService } from '../../services/auth.service';
import { AppTopBarComponent } from '../../app.topbar.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [AppTopBarComponent],
})
export class NotificationComponent implements OnInit {

  token = null;
  notifications: any = [];
  listTicket: any[] = [];
  sujetDic: any[] = [];
  userDic: any[] = [];
  retour: boolean = false;
  constructor(private appTopBarComponent: AppTopBarComponent, private NotificationService: NotificationService, private TicketService: TicketService, private SujetService: SujetService, private AuthService: AuthService) { }


  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    if (this.token) {

      console.log(this.token)

      this.NotificationService.get20ByUserID(this.token.id)
        .subscribe(
          data => {
            this.notifications = data;
            this.NotificationService.viewNotifs(this.notifications)
              .subscribe(
                response => {
                  this.NotificationService.reloadNotif({ id: this.token.id })

                  this.appTopBarComponent.setToZero()
                },
                error => {
                  console.error(error);
                });
          },
          error => {
            console.error(error);
          });

      this.TicketService.getAll()
        .subscribe(
          data => {
            data.forEach(ticket => {
              this.listTicket[ticket._id] = ticket;
            });
          },
          error => {
            console.error(error);
          });
      this.SujetService.getAll().subscribe(data => {
        data.forEach(sujet => {
          this.sujetDic[sujet._id] = sujet;
        });
      })
      this.AuthService.getAll().subscribe(data => {
        data.forEach(element => {
          this.userDic[element._id] = element;
        });
      })

    }
  }
}
