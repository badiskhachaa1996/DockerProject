import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nationality-dropdown',
  templateUrl: './nationality-dropdown.component.html',
  styleUrls: ['./nationality-dropdown.component.css']
})
export class NationalityDropdownComponent implements OnInit {
  selectedNationality: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}


