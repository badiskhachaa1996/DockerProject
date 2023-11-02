import { Component, OnInit } from '@angular/core';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';

@Component({
  selector: 'app-dashboard-imatch',
  templateUrl: './dashboard-imatch.component.html',
  styleUrls: ['./dashboard-imatch.component.scss']
})
export class DashboardImatchComponent implements OnInit {
  filterAuteurOffre = [{ label: 'Tous les auteurs', value: null }]
  filterAuteurOffreGEN = [{ label: 'Tous les auteurs', value: null }]
  filterAuteurCV = [{ label: 'Tous les auteurs', value: null }]
  filterAuteurCVGEN = [{ label: 'Tous les auteurs', value: null }]
  filterCommercialMatch = [{ label: 'TEST TEST TEST', value: null }]
  annonceAJR = []
  cvAJR = []
  dataTabAJR = []
  dataCVAJR = []
  annonceGEN = []
  cvGEN = []
  dataTabGEN = []
  dataTabCVGEN = []
  matchGEN = []
  annonceHisto;
  cvHisto;
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
  constructor(private AnnonceService: AnnonceService, private CVService: CvService) { }

  ngOnInit(): void {
    this.AnnonceService.getAllToday().then(val => {
      this.annonceAJR = val
      let agent_id = []
      val.forEach(ann => {
        if (ann.user_id && !agent_id.includes(ann.user_id._id)) {
          this.dataTabAJR.push({
            label: `${ann.user_id.firstname} ${ann.user_id.lastname}`,
            nb: val.reduce((total, next) => total + (next?.user_id?._id == ann.user_id._id ? 1 : 0), 0)
          })
          this.filterAuteurOffre.push({ label: `${ann.user_id.firstname} ${ann.user_id.lastname}`, value: `${ann.user_id.firstname} ${ann.user_id.lastname}` })
        }
      })
    })
    this.CVService.getAllToday().then(val => {
      this.cvAJR = val
      let agent_id   = []
      console.log(val)
      val.forEach(ann => {
        if (ann.createur_id && !agent_id.includes(ann.createur_id._id)) {
          this.dataCVAJR.push({
            label: `${ann.createur_id.firstname} ${ann.createur_id.lastname}`,
            nb: val.reduce((total, next) => total + (next?.createur_id?._id == ann.createur_id._id ? 1 : 0), 0)
          })
          console.log(this.dataCVAJR)
          this.filterAuteurCV.push({ label: `${ann.createur_id.firstname} ${ann.createur_id.lastname}`, value: `${ann.createur_id.firstname} ${ann.createur_id.lastname}` })
        }
      })
    })
  }
  AnnonceGENbyDate = []
  getAnnonceGENbyDate() {
    if (this.AnnonceGENbyDate.length == 2 && this.AnnonceGENbyDate[1] != null) {
      let day = new Date(this.AnnonceGENbyDate[0]).getDate().toString()
      let month = (new Date(this.AnnonceGENbyDate[0]).getMonth() + 1).toString()
      let year = new Date(this.AnnonceGENbyDate[0]).getFullYear().toString()
      let date1 = `${year}-${month}-${day} 00:00`
      day = new Date(this.AnnonceGENbyDate[1]).getDate().toString()
      month = (new Date(this.AnnonceGENbyDate[1]).getMonth() + 1).toString()
      year = new Date(this.AnnonceGENbyDate[1]).getFullYear().toString()
      let date2 = `${year}-${month}-${day} 23:59`
      this.filterAuteurOffreGEN = [{ label: 'Tous les auteurs', value: null }]
      this.AnnonceService.getAllByDate(date1, date2).then(val => {
        this.annonceGEN = val
        let agent_id = []
        this.dataTabGEN = []
        val.forEach(ann => {
          if (ann.user_id && !agent_id.includes(ann.user_id._id)) {
            this.dataTabGEN.push({
              label: `${ann.user_id.firstname} ${ann.user_id.lastname}`,
              nb: val.reduce((total, next) => total + (next?.user_id?._id == ann.user_id._id ? 1 : 0), 0)
            })
            agent_id.push(ann.user_id._id)
            this.filterAuteurOffreGEN.push({ label: `${ann.user_id.firstname} ${ann.user_id.lastname}`, value: `${ann.user_id.firstname} ${ann.user_id.lastname}` })
          }
        })
      })
    }
  }
  AnnonceHISTObyDate = []
  getAnnonceHISTObyDate() {
    if (this.AnnonceHISTObyDate.length == 2 && this.AnnonceHISTObyDate[1] != null) {
      let day = new Date(this.AnnonceHISTObyDate[0]).getDate().toString()
      let month = (new Date(this.AnnonceHISTObyDate[0]).getMonth() + 1).toString()
      let year = new Date(this.AnnonceHISTObyDate[0]).getFullYear().toString()
      let date1 = `${year}-${month}-${day} 00:00`
      day = new Date(this.AnnonceHISTObyDate[1]).getDate().toString()
      month = (new Date(this.AnnonceHISTObyDate[1]).getMonth() + 1).toString()
      year = new Date(this.AnnonceHISTObyDate[1]).getFullYear().toString()
      let date2 = `${year}-${month}-${day} 23:59`
      this.AnnonceService.getAllByDate(date1, date2).then(val => {
        let labels = []
        let labelDic = {}
        val.forEach(ann => {
          let day = new Date(ann.date_creation).getDate().toString()
          let month = (new Date(ann.date_creation).getMonth() + 1).toString()
          let year = new Date(ann.date_creation).getFullYear().toString()
          let key = `${day}/${month}/${year}`
          if (!labels.includes(key)) {
            labels.push(key)
            labelDic[key] = [ann]
          } else {
            labelDic[key].push(ann)
          }
        })
        let data = []
        labels.forEach(l => {
          data.push(labelDic[l].length)
        })
        this.annonceHisto = {
          labels,
          datasets: [
            {
              label: 'Nombre des offres',
              backgroundColor: '#42A5F5',
              data
            }
          ]
        };
      })
    }
  }

  CVGENbyDate = []
  getCVGENbyDate() {
    if (this.CVGENbyDate.length == 2 && this.CVGENbyDate[1] != null) {
      let day = new Date(this.CVGENbyDate[0]).getDate().toString()
      let month = (new Date(this.CVGENbyDate[0]).getMonth() + 1).toString()
      let year = new Date(this.CVGENbyDate[0]).getFullYear().toString()
      let date1 = `${year}-${month}-${day} 00:00`
      day = new Date(this.CVGENbyDate[1]).getDate().toString()
      month = (new Date(this.CVGENbyDate[1]).getMonth() + 1).toString()
      year = new Date(this.CVGENbyDate[1]).getFullYear().toString()
      let date2 = `${year}-${month}-${day} 23:59`
      this.filterAuteurCVGEN = [{ label: 'Tous les auteurs', value: null }]
      this.CVService.getAllByDate(date1, date2).then(val => {
        this.cvGEN = val
        let agent_id = []
        this.dataTabCVGEN = []
        val.forEach(ann => {
          if (ann.user_id && !agent_id.includes(ann.user_id._id)) {
            this.dataTabCVGEN.push({
              label: `${ann.user_id.firstname} ${ann.user_id.lastname}`,
              nb: val.reduce((total, next) => total + (next?.user_id?._id == ann.user_id._id ? 1 : 0), 0)
            })
            agent_id.push(ann.user_id._id)
            this.filterAuteurCVGEN.push({ label: `${ann.user_id.firstname} ${ann.user_id.lastname}`, value: `${ann.user_id.firstname} ${ann.user_id.lastname}` })
          }
        })
        console.log(this.dataTabCVGEN)
      })
    }
  }
  AnnonceCVbyDate = []
  getAnnonceCVbyDate() {
    if (this.AnnonceCVbyDate.length == 2 && this.AnnonceCVbyDate[1] != null) {
      let day = new Date(this.AnnonceCVbyDate[0]).getDate().toString()
      let month = (new Date(this.AnnonceCVbyDate[0]).getMonth() + 1).toString()
      let year = new Date(this.AnnonceCVbyDate[0]).getFullYear().toString()
      let date1 = `${year}-${month}-${day} 00:00`
      day = new Date(this.AnnonceCVbyDate[1]).getDate().toString()
      month = (new Date(this.AnnonceCVbyDate[1]).getMonth() + 1).toString()
      year = new Date(this.AnnonceCVbyDate[1]).getFullYear().toString()
      let date2 = `${year}-${month}-${day} 23:59`
      this.CVService.getAllByDate(date1, date2).then(val => {
        let labels = []
        let labelDic = {}
        val.forEach(ann => {
          let day = new Date(ann.date_creation).getDate().toString()
          let month = (new Date(ann.date_creation).getMonth() + 1).toString()
          let year = new Date(ann.date_creation).getFullYear().toString()
          let key = `${day}/${month}/${year}`
          if (!labels.includes(key)) {
            labels.push(key)
            labelDic[key] = [ann]
          } else {
            labelDic[key].push(ann)
          }
        })
        let data = []
        labels.forEach(l => {
          data.push(labelDic[l].length)
        })
        this.cvHisto = {
          labels,
          datasets: [
            {
              label: 'Nombre des CV',
              backgroundColor: '#42A5F5',
              data
            }
          ]
        };
      })
    }
  }
  onFilter(tab) {
    console.log(tab)
  }

}
