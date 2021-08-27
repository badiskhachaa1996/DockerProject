import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sujet',
  templateUrl: './sujet.component.html',
  styleUrls: ['./sujet.component.css']
})
export class SujetComponent implements OnInit {
  allSujets = []; 
  constructor() { }

  ngOnInit(): void {
  }

}
