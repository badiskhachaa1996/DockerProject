import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { interval, Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { User } from './models/User';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})


//emit value in sequence every 10 second
export class AppTopBarComponent implements OnInit {
  data: string;
  profilePicture: any;
  public notifications;
  connected = false;
  subscription: Subscription;
  source = interval(3000);
  keycloak: any;
  isAuth = false;
  userInformations: any;
  role: string;
  userconnected: User;
  Notifications: Notification[] = [];

  notifMapping:
    { [k: string]: string } = { '=0': '', 'other': '#' };

  constructor(public app: AppComponent, private AuthService: AuthService, private router: Router, private NotificationService: NotificationService){ }

  ngOnInit() {
    console.log("AHOY")
    this.NotificationService.test()
    console.log("YODAYO")
    this.connected = true;
    this.profilePicture = '../assets/layout/images/pages/avatar.png';
    if (localStorage.getItem("token") != null) {
      this.isAuth = true;
      let temp: any = jwt_decode(localStorage.getItem("token"))
      this.AuthService.getById(temp.id).subscribe((data) => {
        this.userconnected = jwt_decode(data.userToken)["userFromDb"];
      }, (error) => {
        console.log(error)
      })
      this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
        this.Notifications = data;
        console.log(data)
      }, error => {
        console.error(error)
      })
    }

  }
  onLogout() {
    localStorage.clear();
    this.isAuth = false;
    this.router.navigate(['/login'])
  }
}

