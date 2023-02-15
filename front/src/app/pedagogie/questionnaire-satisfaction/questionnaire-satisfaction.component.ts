import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DiplomeService } from 'src/app/services/diplome.service';
import { QSService } from 'src/app/services/qs.service';

@Component({
  selector: 'app-questionnaire-satisfaction',
  templateUrl: './questionnaire-satisfaction.component.html',
  styleUrls: ['./questionnaire-satisfaction.component.scss']
})
export class QuestionnaireSatisfactionComponent implements OnInit {

  show = true

  dropdownFormation = []

  dropdownAttentes = [
    { label: 'Oui', value: 'Oui' },
    { label: 'Pas tout à fait', value: 'Pas tout à fait' }
  ]

  optionSatisfaction = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]

  accesChoix = [
    { label: 'Oui', value: 'Oui' },
    { label: 'Non', value: 'Non' },
    { label: 'Ne sais pas', value: 'Ne sais pas' }
  ]

  satisfactionsForm: FormGroup = new FormGroup({
    formation: new FormControl('', Validators.required),
    ecole: new FormControl('', Validators.required),
    ecole_propositions: new FormControl(''),
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

  constructor(private QSService: QSService, private MessageService: MessageService, private DiplomeService: DiplomeService) { }

  ngOnInit(): void {
    this.DiplomeService.getAll().subscribe(diplomes => {
      diplomes.forEach(diplome => {
        this.dropdownFormation.push({ label: diplome.titre, value: diplome.titre })
      })
    })
  }

  onAddForm() {
    let r = { ...this.satisfactionsForm.value }
    this.QSService.create(r).subscribe(data => {
      this.show = false
      this.MessageService.add({ severity: 'success', summary: "Envoie avec succès", detail: "Merci pour votre avis!" })
    })
  }

  changeAttente() {
    if (this.satisfactionsForm.value.ecole == 'Pas tout à fait') {
      this.satisfactionsForm.get('ecole_propositions').setValidators([Validators.required])
    } else {
      this.satisfactionsForm.get('ecole_propositions').setValidators([])
    }
  }

}
