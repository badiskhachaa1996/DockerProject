import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items : MenuItem[];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

    this.items = [{
      label: 'Gestions de mes tickets',
      icon: 'pi pi-ticket',
      routerLink : '/ticket/suivi'
    },
    {
      label: 'Gestions des tickets',
      icon: 'pi pi-ticket',
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
