import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';

import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { ServService } from './services/service.service';
import { MsalService } from '@azure/msal-angular';

const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',

})
export class AppTopBarComponent {

  notif = false;
  Notifications: Notification[] = [];
  socket = io(environment.origin.replace('/soc', ''));

  constructor(public appMain: AppMainComponent, private serv: ServService, private router: Router, private NotificationService: NotificationService,private msalService:MsalService) { }

  //Methode de deconnexion
  onDisconnect() {
    localStorage.removeItem('token');
    this.msalService.logoutRedirect();
    this.router.navigate(['login']);
  }
  setToZero() {

    this.Notifications = []

  }
  ngOnInit() {
    let temp: any = jwt_decode(localStorage.getItem("token"))

    if (temp.service_id) {
      this.serv.getAServiceByid(temp.service_id).subscribe(service => {

        let serviceName = service.dataService.label
        if (serviceName.includes("Admission")) {
          this.NotificationService.getAdmissionNotifi().subscribe(notifAdmission => {
            if (notifAdmission.length != 0) {
              notifAdmission.forEach(ad_notif => {
                this.Notifications.push(ad_notif)

              });

            }
            else {
              console.log("aucune notif admission trouvé")
            }
          })

        }
        else {
          // recupérer les notifs des autres services
        }

      }
      )
    }

    this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
      this.Notifications = data;
      if (data.length != 0) {
        this.notif = true;
      }



    }, error => {
      console.error(error)
    })
    this.socket.on("NewNotif", (data) => {
      this.Notifications.push(data)
      this.notif = true;
    })
    this.socket.on("reloadNotif", () => {
      this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
        this.Notifications = data;
        this.notif = data.length != 0;

      }, error => {
        console.error(error)
      })
    })
  }
}