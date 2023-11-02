import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-imatch',
  templateUrl: './dashboard-imatch.component.html',
  styleUrls: ['./dashboard-imatch.component.scss']
})
export class DashboardImatchComponent implements OnInit {
  filterAuteurOffre = [{ label: 'TEST TEST TEST', value: null }]
  filterCommercialMatch = [{ label: 'TEST TEST TEST', value: null }]
  annonceAJR = []
  annonceGEN = []
  matchGEN = []
  annonceHisto = {
    labels: ['01/12', '02/12', '03/12', '04/12', '05/12', '06/12', '07/12'],
    datasets: [
      {
        label: 'Nombre des offres',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  cvHisto = {
    labels: ['01/12', '02/12', '03/12', '04/12', '05/12', '06/12', '07/12'],
    datasets: [
      {
        label: 'Nombre des CV',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  matchHisto = {
    labels: ['01/12', '02/12', '03/12', '04/12', '05/12', '06/12', '07/12'],
    datasets: [
      {
        label: 'Entreprise',
        backgroundColor: '#42A5F5',
        data: [50, 85, 80, 81, 25, 88, 40]
      },
      {
        label: 'Candidat',
        backgroundColor: '#6052ff',
        data: [14, 41, 32, 20, 44, 43, 1]
      },
      {
        label: 'Commercial',
        backgroundColor: '#3220f7',
        data: [65, 59, 99, 11, 56, 55, 68]
      },
    ]
  };
  basicOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'black'
        }
      }
    }
  };
  optionsMatching = {
    plugins: {
      title: {
        display: true,
        text: 'Nombre des matchings',
        fontSize: 32,
        color: 'black'
      },
      legend: {
        labels: {
          color: 'black'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      y: {
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'rgba(255,255,255,0.2)'
        }
      }
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

  onFilter(tab) {
    console.log(tab)
  }

}
