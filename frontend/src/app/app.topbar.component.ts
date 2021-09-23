import { Component, Inject, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { interval, Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { User } from './models/User';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationService } from './services/notification.service';
import { Notification } from './models/notification';
import { url } from 'inspector';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListUserComponent } from './authentification/list-user/list-user.component';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})


//emit value in sequence every 10 second
export class AppTopBarComponent implements OnInit {
  data: string;
  currentRoot = this.router.url;
  profilePicture: any;
  public notifications;
  connected = false;
  subscription: Subscription;
  source = interval(3000);
  keycloak: any;
  isAuth = false;
  notif = false;
  userInformations: any;
  role: string;
  userconnected: User;
  Notifications: Notification[] = [];
  User: User;
  userupdate: User = null;
  imageToShow: any = "../assets/images/avatar.PNG"

  socket = io("http://localhost:3000");

  notifMapping:
    { [k: string]: string } = { '=0': '', 'other': '#' };

  constructor(public app: AppComponent, private AuthService: AuthService,
    private router: Router, private NotificationService: NotificationService,
    private msalBroadcastService: MsalBroadcastService,
    private listUserComponent: ListUserComponent, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService) { }

  userForm: FormGroup = new FormGroup({
    lastname: new FormControl('', Validators.required),//Lettre et espace
  });
  ngOnInit() {
    this.connected = true;
    this.profilePicture = '../assets/layout/images/pages/avatar.png';
    if (localStorage.getItem("token") != null) {
      this.isAuth = true;
      let temp: any = jwt_decode(localStorage.getItem("token"))
      this.AuthService.getById(temp.id).subscribe((data) => {
        this.userconnected = jwt_decode(data.userToken)["userFromDb"];
        this.socket.emit("userLog", this.userconnected)
      }, (error) => {
        console.log(error)
      })

      this.AuthService.getProfilePicture(temp.id).subscribe((data) => {
        if (data.error) {
          this.imageToShow = "../assets/images/avatar.PNG"
        } else {
          const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.documentType })
          let reader: FileReader = new FileReader();
          reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
          }, false);
          if (blob) {
            this.imageToShow = "../assets/images/avatar.PNG"
            reader.readAsDataURL(blob);
          }
        }

      })

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

      this.socket.on("reloadImage", () => {
        this.AuthService.getProfilePicture(temp.id).subscribe((data) => {
          if (data.error) {
            this.imageToShow = "../assets/images/avatar.PNG"
          } else {
            const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
            let blob: Blob = new Blob([byteArray], { type: data.documentType })
            let reader: FileReader = new FileReader();
            reader.addEventListener("load", () => {
              this.imageToShow = reader.result;
            }, false);
            if (blob) {
              this.imageToShow = "../assets/images/avatar.PNG"
              reader.readAsDataURL(blob);
            }
          }

        })
      })

    }
  }


  onLogout() {
    localStorage.clear();
    this.isAuth = false;
    this.msalService.logoutPopup();
    this.router.navigate(['/login'])
  }
}

