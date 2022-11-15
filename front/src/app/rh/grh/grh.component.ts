import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-grh',
  templateUrl: './grh.component.html',
  styleUrls: ['./grh.component.scss']
})
export class GrhComponent implements OnInit {

  tieredItems: MenuItem[];

  constructor() { }

  ngOnInit(): void {

    //Elements du menu
    this.tieredItems = [
      {
        label: 'Présences',
        icon: 'pi pi-fw pi-align-left',
      },
      {
        label: 'Précsences sur une plage de date',
        icon: 'pi pi-fw pi-shopping-cart',
      },
      {
        label: 'Shipments',
        icon: 'pi pi-fw pi-envelope',
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
      },
      { separator: true },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-sign-out'
      }
    ];
  }

}