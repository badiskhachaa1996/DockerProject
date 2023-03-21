import { Component, OnInit } from '@angular/core';
import { QSService } from 'src/app/services/qs.service';
import { MessageService } from 'primeng/api';
import { DiplomeService } from 'src/app/services/diplome.service';
import { ClasseService } from 'src/app/services/classe.service';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.scss']
})
export class ResultatComponent implements OnInit {

  resultats = []
  date_auj = new Date()

  moyenne = {}

  diplomeChoisi = ""

  dropdownFormation = []

  dropdownGroupe = []

  dropdownAttentes = [
    { label: 'Oui', value: 'Oui' },
    { label: 'Non', value: 'Non' },
    { label: 'Je ne sais pas', value: 'Je ne sais pas' },
    { label: 'Sans Opinion', value: 'Sans Opinion' },
  ]

  optionSatisfaction = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]

  ecoleDropdown = [
    { label: 'Intuns', value: 'Intuns' },
    { label: 'Estya', value: 'Estya' },
    { label: 'Adg', value: 'Adg' },
    { label: 'Studinfo', value: 'Studinfo' },
    { label: 'Espic', value: 'Espic' },
  ]

  campusDropdown = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Online', value: 'Online' },
  ]

  accesChoix = [
    { label: 'Oui', value: 'Oui' },
    { label: 'Non', value: 'Non' },
    { label: 'Ne sais pas', value: 'Ne sais pas' }
  ]

  choixAnnee = [
    { label: '2021-2023', value: '2021-2023' },
    { label: '2022-2023', value: '2022-2023' },
    { label: '2022-2024', value: '2022-2024' }
  ]

  constructor(private QSService: QSService, private MessageService: MessageService, private DiplomeService: DiplomeService, private GroupeService: ClasseService) { }

  ngOnInit(): void {
    this.DiplomeService.getAll().subscribe(diplomes => {
      this.dropdownFormation = [{ label: "Tous les diplomes", value: null }]
      diplomes.forEach(diplome => {
        this.dropdownFormation.push({ label: diplome.titre, value: diplome.titre })
      })
    })
    this.GroupeService.getAll().subscribe(groupes => {
      this.dropdownGroupe = [{ label: "Tous les groupes", value: null }]
      groupes.forEach(gr => {
        this.dropdownGroupe.push({ label: gr.abbrv, value: gr.abbrv })
      })
    })
    this.QSService.getAll().subscribe(data => {
      this.resultats = data
      this.updateMoyenne(data)
    })
  }

  delete(id) {
    if (confirm('Voulez-vous supprimer cette réponse ?'))
      this.QSService.delete(id).subscribe(data => {
        this.MessageService.add({ severity: 'success', summary: 'Réponse supprimé avec succès' })
        this.QSService.getAll().subscribe(data => {
          this.resultats = data

        })
      }, err => {
        this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors de la suppresion', detail: err.message })
      })
  }

  filtedTable: any[] = []

  updateMoyenne(data) {
    this.moyenne = {
      horaire: Math.trunc(((data.reduce((total, next) => total + next.horaire, 0) / data.length) * 100) / 5),
      charge: Math.trunc(((data.reduce((total, next) => total + next.charge, 0) / data.length) * 100) / 5),
      satisfait_nb_matiere: Math.trunc(((data.reduce((total, next) => total + next.satisfait_nb_matiere, 0) / data.length) * 100) / 5),
      satisfait_programme: Math.trunc(((data.reduce((total, next) => total + next.satisfait_programme, 0) / data.length) * 100) / 5),
      satisfait_pedagogie_enseignant: Math.trunc(((data.reduce((total, next) => total + next.satisfait_pedagogie_enseignant, 0) / data.length) * 100) / 5),
      satisfait_support: Math.trunc(((data.reduce((total, next) => total + next.satisfait_support, 0) / data.length) * 100) / 5),
      satisfait_modes: Math.trunc(((data.reduce((total, next) => total + next.satisfait_modes, 0) / data.length) * 100) / 5),
      satisfait_suivi: Math.trunc(((data.reduce((total, next) => total + next.satisfait_suivi, 0) / data.length) * 100) / 5),
      satisfait_locaux: Math.trunc(((data.reduce((total, next) => total + next.satisfait_locaux, 0) / data.length) * 100) / 5),

      support: Math.trunc((data.reduce((total, next) => total + (next.support ? 1 : 0), 0) / data.length) * 100),
      teams: Math.trunc((data.reduce((total, next) => total + (next.teams == "Oui" ? 1 : 0), 0) / data.length) * 100),
      ims: Math.trunc((data.reduce((total, next) => total + (next.ims == "Oui" ? 1 : 0), 0) / data.length) * 100),
      ll: Math.trunc((data.reduce((total, next) => total + (next.ll == "Oui" ? 1 : 0), 0) / data.length) * 100),
      intuns: Math.trunc((data.reduce((total, next) => total + (next.intuns == "Oui" ? 1 : 0), 0) / data.length) * 100),
    }
  }

  onFilter(event) {
    let data = event.filteredValue
    if (data) {
      this.filtedTable = event.filteredValue;
      this.updateMoyenne(data)
    } else {
      this.updateMoyenne(this.resultats)
    }
  }

  exportToPDF(id) {
    var element = document.getElementById(id);
    var opt = {
      margin: 5,
      filename: 'QUESTIONNAIRE_DE_SATISFACTION_' + `${this.date_auj.getDate()}/${this.date_auj.getMonth() + 1}/${this.date_auj.getFullYear()}` + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      pagebreak: { before: '#lastQ' }
    };
    html2pdf().set(opt).from(element).save().then(() => {
    });
  }
}
