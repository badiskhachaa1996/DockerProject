import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClasseService } from 'src/app/services/classe.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { QSService } from 'src/app/services/qs.service';

@Component({
  selector: 'app-questionnaire-satisfaction',
  templateUrl: './questionnaire-satisfaction.component.html',
  styleUrls: ['./questionnaire-satisfaction.component.scss']
})
export class QuestionnaireSatisfactionComponent implements OnInit {

  show = true

  dropdownGroupe = []

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

  satisfactionsForm: UntypedFormGroup = new UntypedFormGroup({
    formation: new UntypedFormControl('', Validators.required),
    ecole: new UntypedFormControl('', Validators.required),
    ecole_propositions: new UntypedFormControl(''),
    ecoleInscrit: new UntypedFormControl('', [Validators.required]),
    campus: new UntypedFormControl('', [Validators.required]),
    age: new UntypedFormControl('', [Validators.required]),
    annee_formation: new UntypedFormControl('', [Validators.required]),
    horaire: new UntypedFormControl('', [Validators.required]),
    charge: new UntypedFormControl('', [Validators.required]),
    satisfait_nb_matiere: new UntypedFormControl('', [Validators.required]),
    satisfait_programme: new UntypedFormControl('', [Validators.required]),
    satisfait_pedagogie_enseignant: new UntypedFormControl('', [Validators.required]),
    support: new UntypedFormControl(true, [Validators.required]),
    satisfait_support: new UntypedFormControl(''),
    satisfait_modes: new UntypedFormControl('', [Validators.required]),
    satisfait_suivi: new UntypedFormControl('', [Validators.required]),
    satisfait_locaux: new UntypedFormControl('', [Validators.required]),
    teams: new UntypedFormControl('', [Validators.required]),
    ims: new UntypedFormControl('', [Validators.required]),
    ll: new UntypedFormControl('', [Validators.required]),
    intuns: new UntypedFormControl('', [Validators.required]),
    propositions: new UntypedFormControl(''),
  })

  constructor(private QSService: QSService, private MessageService: MessageService, private DiplomeService: DiplomeService, private GroupeService: ClasseService) { }

  ngOnInit(): void {
    this.GroupeService.getAll().subscribe(groupes => {
      groupes.forEach(gr => {
        this.dropdownGroupe.push({ label: gr.abbrv, value: gr.abbrv })
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
