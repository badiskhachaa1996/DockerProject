import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-alternance',
  templateUrl: './dashboard-alternance.component.html',
  styleUrls: ['./dashboard-alternance.component.scss']
})
export class DashboardAlternanceComponent implements OnInit {

  constructor() { }

  dropDownAnneeList: any[] = [
    { label: '2021-2022' },
    { label: '2022-2023' },
    { label: '2023-2024' },
    { label: '2024-2025' },
    { label: '2025-2026' },
  ];


  ngOnInit(): void {
  }

}
