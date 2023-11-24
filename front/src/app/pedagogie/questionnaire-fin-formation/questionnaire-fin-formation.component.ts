import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QSService } from 'src/app/services/qs.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-questionnaire-fin-formation',
  templateUrl: './questionnaire-fin-formation.component.html',
  styleUrls: ['./questionnaire-fin-formation.component.scss']
})
export class QuestionnaireFinFormationComponent implements OnInit {
  show = true
  optionSatisfaction = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]

  satisfactionsForm: FormGroup = new FormGroup({
    assez_informations: new FormControl('', Validators.required),
    contenu: new FormControl('', Validators.required),
    locaux: new FormControl('', [Validators.required]),
    equipments: new FormControl('', [Validators.required]),
    outils: new FormControl('', [Validators.required]),
    accueil: new FormControl('', [Validators.required]),
    orga: new FormControl('', [Validators.required]),
    horaires: new FormControl('', [Validators.required]),
    rythme: new FormControl('', [Validators.required]),
    methodes: new FormControl('', [Validators.required]),
    contenu_peda: new FormControl('', [Validators.required]),
    disponibilite: new FormControl('', [Validators.required]),
    date_creation: new FormControl(new Date())
  })

  dropdownAttentes = [
    { label: 'Oui', value: 'Oui' },
    { label: 'Oui, après analyse de toutes les informations', value: 'Oui, après analyse de toutes les informations' },
    { label: 'Oui, avec un travail complémentaire sur site', value: 'Oui, avec un travail complémentaire sur site' },
    { label: 'Pas facilement', value: 'Pas facilement' },
    { label: 'Pas du tout', value: 'Pas du tout' },
  ]

  constructor(private QFFService: QSService, private MessageService: MessageService) { }

  ngOnInit(): void {
  }

  onAddForm() {
    let r = { ...this.satisfactionsForm.value }
    this.QFFService.createQFF(r).subscribe(data => {
      this.show = false
      this.MessageService.add({ severity: 'success', summary: "Envoie avec succès", detail: "Merci pour votre avis!" })
    })
  }

}
