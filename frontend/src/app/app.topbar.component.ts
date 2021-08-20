import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { interval, Subscription } from 'rxjs';


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
  role: any;
  userconnected: any;
  constructor(public app: AppComponent) {

  }
  ngOnInit() {
    this.connected = true;
    this.profilePicture = '../assets/layout/images/pages/avatar.png';


    //  localStorage.setItem('email',this.keycloak.tokenParsed.email)
    if (this.isAuth) {
      this.userInformations = {};
    }

    //  console.log('email user connected : ' + this.keycloak.tokenParsed.email);
  }




  onLogout() {
   
    localStorage.clear();
  }
  




}

