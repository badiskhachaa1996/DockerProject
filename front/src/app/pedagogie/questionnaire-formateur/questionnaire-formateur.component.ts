import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { QSService } from 'src/app/services/qs.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-questionnaire-formateur',
  templateUrl: './questionnaire-formateur.component.html',
  styleUrls: ['./questionnaire-formateur.component.scss']
})
export class QuestionnaireFormateurComponent implements OnInit {
  token;
  optionSatisfaction = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]

  dropdownGere = [
    { label: "Beaucoup plus difficiles à gérer", value: "Beaucoup plus difficiles à gérer" },
    { label: "Un peu plus difficiles à gérer", value: "Un peu plus difficiles à gérer" },
    { label: "Aussi difficiles à gérer (ni plus ni moins)", value: "Aussi difficiles à gérer (ni plus ni moins)" },
    { label: "Moins difficiles à gérer", value: "Moins difficiles à gérer" },
    { label: "Beaucoup moins difficiles à gérer", value: "Beaucoup moins difficiles à gérer" },
  ]

  satisfactionsForm: UntypedFormGroup = new UntypedFormGroup({
    matiere: new UntypedFormControl('', Validators.required),
    annee_formation: new UntypedFormControl('', Validators.required),
    contrat_travail: new UntypedFormControl('', Validators.required),
    eleve: new UntypedFormControl('', Validators.required),
    enseignant: new UntypedFormControl('', Validators.required),
    pedagogie: new UntypedFormControl('', Validators.required),
    direction: new UntypedFormControl('', Validators.required),
    mesure_accueil: new UntypedFormControl('', Validators.required),
    explication_mesure: new UntypedFormControl(''),
    tutorat: new UntypedFormControl(false, Validators.required),
    gere: new UntypedFormControl('', Validators.required),
    salle_visio: new UntypedFormControl('', Validators.required),
    disposition: new UntypedFormControl('', Validators.required),
    satisfait_locaux: new UntypedFormControl('', Validators.required),
    satisfait_site: new UntypedFormControl('', Validators.required),
    satisfait_rythme: new UntypedFormControl('', Validators.required),
    propositions: new UntypedFormControl('', Validators.required),
    satisfait_global: new UntypedFormControl('', Validators.required),
    user_id: new UntypedFormControl('', Validators.required)
  })
  show = true

  constructor(private QFService: QSService, private MessageService: MessageService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.satisfactionsForm.patchValue({ user_id: this.token.id })
  }


  onAddForm() {
    let r = { ...this.satisfactionsForm.value }
    this.QFService.createQF(r).subscribe(data => {
      this.show = false
      this.MessageService.add({ severity: 'success', summary: "Envoie avec succès", detail: "Merci pour votre avis!" })
    })
  }

}
