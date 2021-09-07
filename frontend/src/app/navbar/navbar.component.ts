import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

    this.items = [{
      label: 'Suivre mes tickets',
      icon: 'pi pi-check-circle',
      routerLink: '/ticket/suivi'
    },
    {
      label: 'Gestions des tickets',
      icon: 'pi pi-list',
      routerLink: '/'
    },
    {
      label: 'Gestions des agents',
      icon: 'pi pi-users',
      routerLink: '/listUser'
    }
    ]


  }

}
