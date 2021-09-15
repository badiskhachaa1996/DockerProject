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
import { url } from 'inspector';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListUserComponent } from './authentification/list-user/list-user.component';
const io = require("socket.io-client");

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})


//emit value in sequence every 10 second
export class AppTopBarComponent implements OnInit {
  data: string;
  currentRoot= this.router.url;
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
  User : User;
  userupdate: User = null;


  socket = io("http://localhost:3000");

  notifMapping:
    { [k: string]: string } = { '=0': '','other':'#' };
  
  constructor(public app: AppComponent, private AuthService: AuthService, 
    private router: Router, private NotificationService: NotificationService,
    private listUserComponent: ListUserComponent){ }
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
        console.log(this.userconnected)
        this.socket.emit("userLog",this.userconnected)
      }, (error) => {
        console.log(error)
      })
      this.NotificationService.getAllByUserId(temp.id).subscribe((data) => {
        this.Notifications = data;
        if(data.length!=0){
            this.notif = true;
        }
      
      }, error => {
        console.error(error)
      })
      this.socket.on("NewNotif",(data)=>{
        this.Notifications.push(data)
        this.notif = true;
      })
    }


  }
 

  onLogout() {
    localStorage.clear();
    this.isAuth = false;
    this.router.navigate(['/login'])
  }
}

