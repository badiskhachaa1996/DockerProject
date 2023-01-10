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
    })
  }

  delete(id) {
    if (confirm('Voulez-vous supprimer cette réponse ?'))
      this.QSService.delete(id).subscribe(data => {
        this.MessageService.add({ severity: 'success', summary: 'Réponse supprimé avec succès' })
      }, err => {
        this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors de la suppresion', detail: err.message })
      })
  }

}
