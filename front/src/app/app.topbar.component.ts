import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
const io = require("socket.io-client");    

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    notif = false;
    Notifications: Notification[] = [];
    socket = io(environment.origin.replace('/soc', ''));

    constructor(public appMain: AppMainComponent, private router: Router, private NotificationService: NotificationService,) { }

    //Methode de deconnexion
    onDisconnect()
    {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
    }

    ngOnInit() {
        let temp: any = jwt_decode(localStorage.getItem("token"))
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
