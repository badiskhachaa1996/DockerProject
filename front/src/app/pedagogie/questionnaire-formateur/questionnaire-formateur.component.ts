import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  satisfactionsForm: FormGroup = new FormGroup({
    matiere: new FormControl('', Validators.required),
    annee_formation: new FormControl('', Validators.required),
    contrat_travail: new FormControl('', Validators.required),
    eleve: new FormControl('', Validators.required),
    enseignant: new FormControl('', Validators.required),
    pedagogie: new FormControl('', Validators.required),
    direction: new FormControl('', Validators.required),
    mesure_accueil: new FormControl('', Validators.required),
    explication_mesure: new FormControl(''),
    tutorat: new FormControl(false, Validators.required),
    gere: new FormControl('', Validators.required),
    salle_visio: new FormControl('', Validators.required),
    disposition: new FormControl('', Validators.required),
    satisfait_locaux: new FormControl('', Validators.required),
    satisfait_site: new FormControl('', Validators.required),
    satisfait_rythme: new FormControl('', Validators.required),
    propositions: new FormControl('', Validators.required),
    satisfait_global: new FormControl('', Validators.required),
    user_id: new FormControl('', Validators.required)
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
