import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
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

  satisfactionsForm: UntypedFormGroup = new UntypedFormGroup({
    assez_informations: new UntypedFormControl('', Validators.required),
    contenu: new UntypedFormControl('', Validators.required),
    locaux: new UntypedFormControl('', [Validators.required]),
    equipments: new UntypedFormControl('', [Validators.required]),
    outils: new UntypedFormControl('', [Validators.required]),
    accueil: new UntypedFormControl('', [Validators.required]),
    orga: new UntypedFormControl('', [Validators.required]),
    horaires: new UntypedFormControl('', [Validators.required]),
    rythme: new UntypedFormControl('', [Validators.required]),
    methodes: new UntypedFormControl('', [Validators.required]),
    contenu_peda: new UntypedFormControl('', [Validators.required]),
    disponibilite: new UntypedFormControl('', [Validators.required]),
    date_creation: new UntypedFormControl(new Date())
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
