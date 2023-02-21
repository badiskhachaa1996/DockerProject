import { Component, OnInit } from '@angular/core';
import { Evenements } from 'src/app/models/Evenements';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.component.html',
  styleUrls: ['./evenements.component.scss']
})
export class EvenementsComponent implements OnInit {
  events: Evenements[] = []
  typeList = [
    { label: "POP", value: "POP" },
    { label: "Ateliers", value: "Ateliers" },
    { label: "Event", value: "Event" },
    { label: "Autre", value: "Autre" },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
