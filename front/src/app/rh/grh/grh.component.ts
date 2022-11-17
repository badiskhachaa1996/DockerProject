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
        label: 'Démandes de congés',
        icon: 'pi pi-fw pi-file',
      },
    ];
  }

}