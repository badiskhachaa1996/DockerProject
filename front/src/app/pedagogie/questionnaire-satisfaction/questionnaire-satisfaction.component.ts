import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { QSService } from 'src/app/services/qs.service';

@Component({
  selector: 'app-questionnaire-satisfaction',
  templateUrl: './questionnaire-satisfaction.component.html',
  styleUrls: ['./questionnaire-satisfaction.component.scss']
})
export class QuestionnaireSatisfactionComponent implements OnInit {

  show = false

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

  satisfactionsForm: FormGroup = new FormGroup({
    formation: new FormControl('', Validators.required),
    ecole: new FormControl('', Validators.required),
    ecoleInscrit: new FormControl('', [Validators.required]),
    campus: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    annee_formation: new FormControl('', [Validators.required]),
    horaire: new FormControl('', [Validators.required]),
    charge: new FormControl('', [Validators.required]),
    satisfait_nb_matiere: new FormControl('', [Validators.required]),
    satisfait_programme: new FormControl('', [Validators.required]),
    satisfait_pedagogie_enseignant: new FormControl('', [Validators.required]),
    support: new FormControl(true, [Validators.required]),
    satisfait_support: new FormControl(''),
    satisfait_modes: new FormControl('', [Validators.required]),
    satisfait_suivi: new FormControl('', [Validators.required]),
    satisfait_locaux: new FormControl('', [Validators.required]),
    teams: new FormControl('', [Validators.required]),
    ims: new FormControl('', [Validators.required]),
    ll: new FormControl('', [Validators.required]),
    intuns: new FormControl('', [Validators.required]),
    propositions: new FormControl(''),
  })

  constructor(private QSService: QSService, private MessageService: MessageService) { }

  ngOnInit(): void {
  }

  onAddForm() {
    let r = { ...this.satisfactionsForm.value }
    this.QSService.create(r).subscribe(data => {
      this.show=false
      this.MessageService.add({ severity: 'success', summary: "Envoie avec succès", detail: "Merci pour votre avis!" })
    })
  }

}
