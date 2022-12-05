import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-ims',
  templateUrl: './info-ims.component.html',
  styleUrls: ['./info-ims.component.scss']
})
export class InfoImsComponent implements OnInit {

  avancements: any[] = [
    {
      module: 'Pédagogie',
      global: 92,
      todo: "Rétouches ...",
      details: [
        {
          tache: 'Tache 1',
          percent: 60
        },
        {
          tache: 'Tache 2',
          percent: 40
        },
      ]
    },

  ];

  constructor() { }

  ngOnInit(): void {
  }

}
