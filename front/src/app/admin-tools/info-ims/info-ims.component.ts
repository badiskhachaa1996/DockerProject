import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-ims',
  templateUrl: './info-ims.component.html',
  styleUrls: ['./info-ims.component.scss']
})
export class InfoImsComponent implements OnInit {

  avancements: any[] = [
    {
      module: 'Ticketing',
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
    {
      module: 'Administration',
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
    {
      module: 'Admission',
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
    {
      module: 'Alternance',
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
    {
      module: 'Partenaires',
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
    {
      module: 'Commerciale',
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
    {
      module: 'Support',
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
    {
      module: 'Booking',
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
    {
      module: 'SkillsNet',
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
    {
      module: 'RH',
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
