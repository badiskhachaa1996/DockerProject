import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
const io = require("socket.io-client");
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  data: string;
  isAuth = false;
  source = interval(3000);

  items: MenuItem[];
  connected = false;
  role: string;
  userconnected: User = null;

  socket = io(environment.origin.replace('/soc', ''));

  constructor(public app: AppComponent, private messageService: MessageService, private AuthService: AuthService, private router: Router,) { }

  ngOnInit(): void {

    this.connected = true;
    if (localStorage.getItem("token") != null) {
      this.isAuth = true;
      let temp: any = jwt_decode(localStorage.getItem("token"))
      this.AuthService.getById(temp.id).subscribe((data) => {
        this.userconnected = jwt_decode(data.userToken)["userFromDb"];
        if (this.userconnected.role == "Admin") {
          this.items = [{
            label: 'Suivre mes tickets',
            icon: 'pi pi-check-circle',
            routerLink: '/ticket/suivi'
          },
          {
            label: 'Gestions des tickets',
            icon: 'pi pi-ticket',
            routerLink: '/'
          },
          {
            label: 'Gestions des services',
            icon: 'pi pi-sitemap',
            routerLink: '/service'
          },
          {
            label: 'Gestions des agents',
            icon: 'pi pi-users',
            routerLink: '/listUser'
          },
          {
            label: 'Gestions des classes',
            icon: 'pi pi-desktop',
            routerLink: '/classe'
          },
          {
            label: 'Gestions des Années Scolaire',
            icon: 'pi pi-calendar-times',
            routerLink: '/anneeScolaire'
          },
          {
            label: 'Gestions des séances',
            icon: 'pi pi-video',
            routerLink: '/seance'
          },
          {
            label: 'Diplômes',
            icon: 'pi pi-ellipsis-v',
            routerLink: '/diplome'
          },
          {
            label: 'Formateurs',
            icon: 'pi pi-users',
            routerLink: '/formateur'
          }
          ]
        } else {
          this.items = [{
            label: 'Suivre mes tickets',
            icon: 'pi pi-check-circle',
            routerLink: '/ticket/suivi'
          },
          {
            label: 'Gestions des tickets',
            icon: 'pi pi-list',
            routerLink: '/'
          }
          ]
        }

      }, (error) => {
        console.error(error)
      })
    }



  }

}
