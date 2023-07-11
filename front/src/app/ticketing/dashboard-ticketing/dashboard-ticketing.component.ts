import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { UIChart } from 'primeng/chart';
import { Ticket } from 'src/app/models/Ticket';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import { TicketService } from 'src/app/services/ticket.service';
@Component({
  selector: 'app-dashboard-ticketing',
  templateUrl: './dashboard-ticketing.component.html',
  styleUrls: ['./dashboard-ticketing.component.scss']
})
export class DashboardTicketingComponent implements OnInit {

  constructor(private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private UserService: AuthService) { }
  @ViewChild('chart') chart: UIChart;
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
    labels: [
      'En Attente',
      'En cours de Traitement',
      'Suspendus',
      'Traités',],
    datasets: [
      {
        data: [5, 10, 15, 5],
        backgroundColor: [
          "#a8dadc",
          '#8ECAE6',
          "#219EBC",
          "#023047",
        ],
        hoverBackgroundColor: [
          "#22C55E",

        ]
      }
    ]
  };

  serviceSelected: string = null
  sujetSelect: string = null
  agentSelect: string = null
  periodeSelected: Date[] = []

  serviceList = [
    { label: 'Tous les services', value: null }
  ]
  sujetList = [
    { label: 'Tous les sujets', value: null }
  ]
  agentList = [
    { label: 'Tous les agents', value: null }
  ]


  ngOnInit(): void {
    this.TicketService.getAll().subscribe((data: Ticket[]) => {
      this.stats = {
        total: data.length,
        assignes: Math.trunc(data.reduce((total, next) => total + (next?.agent_id != null ? 1 : 0), 0)),
        non_assignes: Math.trunc(data.reduce((total, next) => total + (next?.agent_id == null ? 1 : 0), 0)),
        en_attente: Math.trunc(data.reduce((total, next) => total + (next?.agent_id == null && next.statut != 'Traité' ? 1 : 0), 0)),
        en_traitement: Math.trunc(data.reduce((total, next) => total + (next?.agent_id != null && next.statut != 'Traité' ? 1 : 0), 0)),
        refuse: Math.trunc(data.reduce((total, next) => total + (next?.isReverted == true ? 1 : 0), 0)),
        traite: Math.trunc(data.reduce((total, next) => total + (next.statut == 'Traité' ? 1 : 0), 0)),
        attente_moyenne: this.getMoyenneAttente(data),
        traitement_moyen: this.getMoyenneTraitement(data)
      }
      this.dataChart.datasets[0].data = [(this.stats.en_attente * 100) / data.length, (this.stats.en_traitement * 100) / data.length, (this.stats.refuse * 100) / data.length, (this.stats.traite * 100) / data.length]
      this.chart.reinit();
    })
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceList.push({ label: val.label, value: val._id })
      })
    })
  }

  getMoyenneTraitement(data: Ticket[]) {
    let totalTimeStamp = 0
    data.forEach((val: Ticket) => {
      if (val.statut == "Traité")
        totalTimeStamp += new Date(val.date_fin_traitement).getTime() - new Date(val.date_ajout).getTime()
    })
    totalTimeStamp = totalTimeStamp / data.length
    let day = Math.floor(totalTimeStamp / 86400000)
    totalTimeStamp = totalTimeStamp % 86400000
    let hours = Math.floor(totalTimeStamp / 3600000)
    totalTimeStamp = totalTimeStamp % 3600000
    let minutes = Math.floor(totalTimeStamp / 60000)
    return `${day}J ${hours}H${minutes}m`
  }

  getMoyenneAttente(data: Ticket[]) {
    let totalTimeStamp = 0
    data.forEach((val: Ticket) => {
      if (val.statut != "Traité")
        totalTimeStamp += new Date().getTime() - new Date(val.date_ajout).getTime()
    })
    totalTimeStamp = totalTimeStamp / data.length
    let day = Math.floor(totalTimeStamp / 86400000)
    totalTimeStamp = totalTimeStamp % 86400000
    let hours = Math.floor(totalTimeStamp / 3600000)
    totalTimeStamp = totalTimeStamp % 3600000
    let minutes = Math.floor(totalTimeStamp / 60000)
    return `${day}J ${hours}H${minutes}m`
  }
  onChangeService(service_id) {
    this.SujetService.getAllByServiceID(service_id).subscribe(data => {
      this.sujetList = [{ label: 'Tous les sujets', value: null }]
      this.sujetSelect = null
      //this.serviceSelected = []
      data.forEach(val => {
        this.sujetList.push({ label: val.label, value: val._id })
        //this.serviceSelected.push(val._id)
      })
    })
    this.UserService.getAllByServiceFromList(service_id).subscribe(data => {
      this.agentList = [{ label: 'Tous les agents', value: null }]
      data.forEach(element => {
        this.agentList.push({ label: `${element.lastname} ${element.firstname}`, value: element?._id })
      });
    })
  }

  onChangeFilter() {
    let filter: any = {}
    if (this.serviceSelected && this.sujetSelect == null)
      filter.service_id = this.serviceSelected
    if (this.sujetSelect)
      filter.sujet_id = this.sujetSelect
    if (this.agentSelect)
      filter.agent_id = this.agentSelect
    if (this.periodeSelected.length == 1)
      filter.date_ajout = { $gt: new Date(this.periodeSelected[0]) }
    else if (this.periodeSelected.length == 2)
      filter.date_ajout = { $gt: new Date(this.periodeSelected[0]), $lt: new Date(this.periodeSelected[1]) }
    this.TicketService.getStats(filter).subscribe((data: Ticket[]) => {
      this.stats = {
        total: data.length,
        assignes: Math.trunc(data.reduce((total, next) => total + (next?.agent_id != null ? 1 : 0), 0)),
        non_assignes: Math.trunc(data.reduce((total, next) => total + (next?.agent_id == null ? 1 : 0), 0)),
        en_attente: Math.trunc(data.reduce((total, next) => total + (next?.agent_id == null && next.statut != 'Traité' ? 1 : 0), 0)),
        en_traitement: Math.trunc(data.reduce((total, next) => total + (next?.agent_id != null && next.statut != 'Traité' ? 1 : 0), 0)),
        refuse: Math.trunc(data.reduce((total, next) => total + (next?.isReverted == true ? 1 : 0), 0)),
        traite: Math.trunc(data.reduce((total, next) => total + (next.statut != 'Traité' ? 1 : 0), 0)),
        attente_moyenne: this.getMoyenneAttente(data),
        traitement_moyen: this.getMoyenneTraitement(data)
      }

      this.dataChart.datasets[0].data = [(this.stats.en_attente * 100) / data.length, (this.stats.en_traitement * 100) / data.length, (this.stats.refuse * 100) / data.length, (this.stats.traite * 100) / data.length]
      this.chart.reinit();
    })
  }
}
