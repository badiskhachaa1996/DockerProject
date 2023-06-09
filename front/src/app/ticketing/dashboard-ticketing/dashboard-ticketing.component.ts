import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard-ticketing',
  templateUrl: './dashboard-ticketing.component.html',
  styleUrls: ['./dashboard-ticketing.component.scss']
})
export class DashboardTicketingComponent implements OnInit {

  constructor() { }

  stats = {
    total: 0,
    assignes: 0,
    non_assignes: 9,
    en_attente: 0,
    en_traitement: 0,
    refuse: 0,
    traite: 0,
    attente_moyenne: "0J0H0M",
    traitement_moyen: "0J0H0M"
  }
  chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black',

        },
        legendCallback: { text: 'this is legend' }
      }, title: {
        display: true,
        text: 'Graph de répartition des tickets selon l\'état de traitement'
      }
    }
  }

  dataChart = {
    labels: ['Assignés',
      'Non Assignés',
      'En Attente',
      'En cours de Traitement',
      'Suspendus',
      'Traités',],
    datasets: [
      {
        data: [5, 10, 15, 5, 10, 15],
        backgroundColor: [
          "#a8dadc",
          '#8ECAE6',
          "#219EBC",
          "#023047",
          "#FFB703",
          "#FB8500",

        ],
        hoverBackgroundColor: [
          "#22C55E",
          "#f9ac09",
          "#FF6384"

        ]
      }
    ]
  };

  serviceSelected: string = null
  sujetSelect: string = null
  agentSelect: string = null
  periodeSelected: string = null

  serviceList = [

  ]
  sujetList = [

  ]
  agentList = [

  ]
  periodeList = [

  ]


  ngOnInit(): void {
  }
  onChangeService(service_id) {

  }

  onChangeFilter() {

  }
}
