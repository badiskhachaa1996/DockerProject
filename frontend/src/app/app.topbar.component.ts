import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { interval, Subscription } from 'rxjs';
import jwt_decode from "jwt-decode";
import { User } from './models/User';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  constructor(public app: AppComponent, private AuthService: AuthService, private router: Router,private messageService:MessageService) { }

  ngOnInit() {
    this.connected = true;
    this.profilePicture = '../assets/layout/images/pages/avatar.png';
    if (localStorage.getItem("token") != null) {
      this.isAuth = true;
<<<<<<< HEAD
      let temp: any = jwt_decode(localStorage.getItem("token"))
      this.AuthService.getById(temp.id).subscribe((data) => {
=======
      let temp: User = jwt_decode(localStorage.getItem("token"))
      this.AuthService.getById(temp._id).subscribe((data) => {
>>>>>>> 5f4c5691f853c590f4664188c65c0c8b967ac685
        this.userconnected = jwt_decode(data.userToken)["userFromDb"];
      }, (error) => {
        console.log(error)
      })
    } 
  }
  onLogout() {
    localStorage.clear();
    this.isAuth = false;
    this.router.navigate(['/login'])
  }
}

