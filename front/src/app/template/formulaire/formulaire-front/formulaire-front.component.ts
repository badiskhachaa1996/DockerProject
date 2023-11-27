import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { FormulaireServiceService } from '../formulaire-service.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-formulaire-front',
  templateUrl: './formulaire-front.component.html',
  styleUrls: ['./formulaire-front.component.scss']
})
export class FormulaireFrontComponent implements OnInit {
  //Configuration du choix du numéro de téléphone
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

  //Configuration des champs basique
  dropdownContent1 = [
    { label: "Ce_qui_sera_affiché", value: "Ce_qui_sera_récupéré" },
    { label: "Ce_qui_sera_affiché_2", value: "Ce_qui_sera_récupéré_2" },
    { label: "Ce_qui_sera_affiché_3", value: "Ce_qui_sera_récupéré_3" },
    { label: "Ce_qui_sera_affiché_4", value: "Ce_qui_sera_récupéré_4" },
  ]

  multiSelect1 = [
    { label: "Ce_qui_sera_affiché", value: "Ce_qui_sera_récupéré" },
    { label: "Ce_qui_sera_affiché_2", value: "Ce_qui_sera_récupéré_2" },
    { label: "Ce_qui_sera_affiché_3", value: "Ce_qui_sera_récupéré_3" },
    { label: "Ce_qui_sera_affiché_4", value: "Ce_qui_sera_récupéré_4" },
  ]

  selectButton1 = [
    { label: "Ce_qui_sera_affiché", value: "Ce_qui_sera_récupéré" },
    { label: "Ce_qui_sera_affiché_2", value: "Ce_qui_sera_récupéré_2" },
    { label: "Ce_qui_sera_affiché_3", value: "Ce_qui_sera_récupéré_3" },
    { label: "Ce_qui_sera_affiché_4", value: "Ce_qui_sera_récupéré_4" },
  ]

  //Configuration des champs conditionnels
  selectButton2 = [
    { label: "42", value: "42" },
    { label: "Le Travail", value: "Le Travail" },
    { label: "La Famille", value: "La Famille" },
    { label: "La Santé", value: "La Santé" },
  ]

  selectButton3 = []
  dropdownContent2 = []
  dropdownContent3 = []

  formulaire = new UntypedFormGroup({
    texte: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    telephone: new FormControl(''),
    dropdown: new FormControl(''),
    multiSelect: new FormControl([]),
    multiSelectMax3: new FormControl([]),
    selectButton: new FormControl(''),
    textArea: new FormControl(''),
    sens_vie: new FormControl(''),
    ecole: new FormControl(''),
    formation: new FormControl(''),
    argumentation: new FormControl(''),
    onBlur: new FormControl(''),
    onInput: new FormControl(''),
    formation2: new FormControl('')
  })

  onSaveFormulaire() {
    this.TemplateService.create({ ...this.formulaire.value, formation: this.formulaire.value.formation._id, formation2: this.formulaire.value.formation2._id }).subscribe(newData => {
      this.ToastService.add({ severity: 'success', summary: "Les donnés ont été envoyés avec succès" })
      this.formulaire.reset()
    }, error => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: "Une erreur est arrivé", detail: error?.error })
    })
  }

  constructor(private TemplateService: FormulaireServiceService, private ToastService: MessageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    /*
      .forEach devrait être remplacer par .subscribe(resultat=>{resultat.forEach(...)}) quand on réalise une vrai requête
      On va boucler sur la liste des écoles pour récupérer chaque école et les insérer dans une liste pour être affiché
      On mets l'id de l'objet dans value pour qu'il puisse associer plus tard à cette objet
    */
    this.TemplateService.exempleGETEcole().forEach(ecole => {
      this.selectButton3.push({ label: ecole.name, value: ecole._id })
    })
    this.TemplateService.exempleGETEcole().forEach(ecole => {
      if (ecole._id == this.params) {
        this.ECOLE = ecole
        this.dropdownContent3 = this.TemplateService.exempleGETFormationByEcoleID(this.params)
      }

    })
  }

  onSelectEcole(ecole_id) {
    /*
      .then devrait être remplacer par .subscribe(resultat=>{this.dropdownContent2 = resultat}) quand on réalise une vrai requête
      On va boucler sur la liste des formations pour récupérer chaque formation et les insérer dans la liste pour être affiché une fois l'ecole selectionné
      On mets l'id de l'objet dans value pour qu'il puisse associer plus tard à cette objet
      Je vais aussi ne pas faire le label value et rajouter optionLabel dans le <p-dropdown> pour récupérer tout l'objet au lieu de juste l'id
    */
    this.dropdownContent2 = []
    this.dropdownContent2 = this.TemplateService.exempleGETFormationByEcoleID(ecole_id)
  }

  onSelectFormation(data: { _id: string, name: string, details: string, ecole_id: string }) {
    this.ToastService.add({ severity: 'success', summary: `Vous avez choisi : ${data.name}`, detail: data.details })
  }

  onInput(value: string) {
    this.ToastService.add({ severity: 'info', summary: `Vous avez rajouter ou supprimer une lettre: ${value[value.length - 1]}`, detail: value })
  }

  onBlur(value) {
    this.ToastService.add({ severity: 'info', summary: `Vous avez écrit`, detail: value })
  }

  params = this.route.snapshot.paramMap.get('ecole');

  ECOLE;

  idx = 1

}
