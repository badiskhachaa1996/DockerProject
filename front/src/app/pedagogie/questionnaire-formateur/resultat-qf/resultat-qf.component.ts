import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { QSService } from 'src/app/services/qs.service';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-resultat-qf',
  templateUrl: './resultat-qf.component.html',
  styleUrls: ['./resultat-qf.component.scss']
})
export class ResultatQfComponent implements OnInit {

  constructor(private QSService: QSService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.QSService.getAllQF().subscribe(data => {
      this.resultats = data
      this.updateMoyenne(data)
    })
  }

  resultats = []
  date_auj = new Date()

  moyenne = {}

  delete(id) {
    if (confirm('Voulez-vous supprimer cette réponse ?'))
      this.QSService.deleteQF(id).subscribe(data => {
        this.MessageService.add({ severity: 'success', summary: 'Réponse supprimé avec succès' })
        this.QSService.getAllQF().subscribe(data => {
          this.resultats = data

        })
      }, err => {
        this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors de la suppresion', detail: err.message })
      })
  }
  filtedTable: any[] = []
  onFilter(event) {
    let data = event.filteredValue
    if (data) {
      this.filtedTable = event.filteredValue;
      this.updateMoyenne(data)
    } else {
      this.updateMoyenne(this.resultats)
    }
  }

  updateMoyenne(data) {
    this.moyenne = {
      eleve: Math.trunc(((data.reduce((total, next) => total + next.eleve, 0) / data.length) * 100) / 5),
      pedagogie: Math.trunc(((data.reduce((total, next) => total + next.pedagogie, 0) / data.length) * 100) / 5),
      direction: Math.trunc(((data.reduce((total, next) => total + next.direction, 0) / data.length) * 100) / 5),
      mesure_accueil: Math.trunc(((data.reduce((total, next) => total + next.mesure_accueil, 0) / data.length) * 100) / 5),
      salle_visio: Math.trunc(((data.reduce((total, next) => total + next.salle_visio, 0) / data.length) * 100) / 5),
      disposition: Math.trunc(((data.reduce((total, next) => total + next.disposition, 0) / data.length) * 100) / 5),
      satisfait_locaux: Math.trunc(((data.reduce((total, next) => total + next.satisfait_locaux, 0) / data.length) * 100) / 5),
      satisfait_site: Math.trunc(((data.reduce((total, next) => total + next.satisfait_site, 0) / data.length) * 100) / 5),
      satisfait_global: Math.trunc(((data.reduce((total, next) => total + next.satisfait_global, 0) / data.length) * 100) / 5),
      satisfait_rythme: Math.trunc(((data.reduce((total, next) => total + next.satisfait_rythme, 0) / data.length) * 100) / 5),
      tutorat: Math.trunc((data.reduce((total, next) => total + (next.tutorat == "Oui" ? 1 : 0), 0) / data.length) * 100),
    }
  }

  exportToPDF(id) {
    var element = document.getElementById(id);
    var opt = {
      margin: 5,
      filename: 'QUESTIONNAIRE_DE_SATISFACTION_FORMATEUR_' + `${this.date_auj.getDate()}/${this.date_auj.getMonth() + 1}/${this.date_auj.getFullYear()}` + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      pagebreak: { before: '#lastQ' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
    });
  }
}
