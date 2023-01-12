import { Component, OnInit } from '@angular/core';
import { QSService } from 'src/app/services/qs.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.scss']
})
export class ResultatComponent implements OnInit {

  resultats = []

  moyenne = {}

  dropdownFormation = []

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

  constructor(private QSService: QSService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.QSService.getAll().subscribe(data => {
      this.resultats = data
      this.moyenne = {
        horaire: data.reduce((total, next) => total + next.horaire, 0) / data.length,
        charge: data.reduce((total, next) => total + next.charge, 0) / data.length,
        satisfait_nb_matiere: data.reduce((total, next) => total + next.satisfait_nb_matiere, 0) / data.length,
        satisfait_programme: data.reduce((total, next) => total + next.satisfait_programme, 0) / data.length,
        satisfait_pedagogie_enseignant: data.reduce((total, next) => total + next.satisfait_pedagogie_enseignant, 0) / data.length,
        satisfait_support: data.reduce((total, next) => total + next.satisfait_support, 0) / data.length,
        satisfait_modes: data.reduce((total, next) => total + next.satisfait_modes, 0) / data.length,
        satisfait_suivi: data.reduce((total, next) => total + next.satisfait_suivi, 0) / data.length,
        satisfait_locaux: data.reduce((total, next) => total + next.satisfait_locaux, 0) / data.length,

        support: data.reduce((total, next) => {
          console.log(next.support, total, next.support.toString())
          if (next.support.toString() == "true") //TODO
            total + 1
        }, 0) / data.length,
        teams: data.reduce((total, next) => {
          if (next.teams == 'Oui')
            total + 1
        }, 0) / data.length,
        ims: data.reduce((total, next) => {
          if (next.ims == 'Oui')
            total + 1
        }, 0) / data.length,
        ll: data.reduce((total, next) => {
          if (next.ll == 'Oui')
            total + 1
        }, 0) / data.length,
        intuns: data.reduce((total, next) => {
          if (next.intuns == 'Oui')
            total + 1
        }, 0) / data.length,
      }
      console.log(this.moyenne)
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

}
