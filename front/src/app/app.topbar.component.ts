import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';

import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { ServService } from './services/service.service';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './services/auth.service';

const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',

})
export class AppTopBarComponent {

  logo = "assets/images/logo-ims-new.png"
  notif = false;
  Notifications = 0;
  socket = io(environment.origin.replace('/soc', ''));

  constructor(public appMain: AppMainComponent, private serv: ServService, private router: Router, private NotificationService: NotificationService, private msalService: MsalService, private AuthService: AuthService, private ToastService: MessageService) { }

  //Methode de deconnexion
  onDisconnect() {
    localStorage.removeItem('token');
    this.msalService.logoutRedirect();
    this.router.navigate(['login']);
  }
  setToZero() {

    this.Notifications = 0

  }
  ngOnInit() {
    let temp: any = jwt_decode(localStorage.getItem("token"))
    let url = window.location.href;
    //console.log(url)
    if (url.includes('ims.adgeducation')) //ims.adgeducation
      this.logo = "assets/images/logo_adg.png"
    if (temp.service_id) {
      this.serv.getAServiceByid(temp.service_id).subscribe(service => {
        let serviceName = service.dataService.label
        if (serviceName.includes("Admission")) {
          this.NotificationService.getAdmissionNotifi().subscribe(notifAdmission => {
            if (notifAdmission.length != 0) {
              this.Notifications = notifAdmission.length
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
      this.Notifications = data.length;
      if (data.length != 0) {
        this.notif = true;
      }



    }, error => {
      console.error(error)
    })
    this.socket.on("NewNotif", (data) => {
      this.Notifications += 1
      this.notif = true;
    })
    this.socket.on("NewNotifV2", (data) => {
      this.Notifications += 1
      this.notif = true;
      this.ToastService.add({ severity: 'info', summary: "Vous avez reçu une nouvelle notification", detail: data })
    })
    this.socket.on("reloadNotif", () => {
      this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
        this.Notifications = data.length;
        this.notif = data.length != 0;

      }, error => {
        console.error(error)
      })
    })
    this.AuthService.getById(temp.id).subscribe((data) => {
      let userconnected = jwt_decode(data.userToken)["userFromDb"];
      if (userconnected) {
        this.socket.emit("userLog", jwt_decode(data.userToken)["userFromDb"])
      }
    }, (error) => {
      console.error(error)
    })
  }
}