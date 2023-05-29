import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ajout-leadcrm',
  templateUrl: './ajout-leadcrm.component.html',
  styleUrls: ['./ajout-leadcrm.component.scss']
})
export class AjoutLeadcrmComponent implements OnInit {
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
  ]
  operationDropdown = [
    { value: 'Prospection FRP' },
    { value: 'Prospection ENP' },
    { value: 'Prospection ICBS Malte' },
    { value: 'Prospection ICBS Dubai' },
  ]
  civiliteDropdown = [
    { value: 'Monsieur' },
    { value: 'Madame' },
    { value: 'Autre' },
  ]
  nationaliteDropdown = environment.nationalites
  paysDropdown = environment.pays
  nivDropdown = [
    { label: 'Pré-bac', value: 'Pré-bac' },
    { label: 'Bac +1', value: 'Bac +1' },
    { label: 'Bac +2', value: 'Bac +2' },
    { label: 'Bac +3', value: 'Bac +3' },
    { label: 'Bac +4', value: 'Bac +4' },
    { label: 'Bac +5', value: 'Bac +5' },
  ];
  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];
  niveauFR =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
      { label: "Aucun de ces choix", value: "Aucun de ces choix" },
    ]
  niveauEN =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "Avancé", value: "Avancé" },
      { label: "Intermédiaire", value: "Intermédiaire" },
      { label: "Basique", value: "Basique" },
      { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
    ]
  addForm: FormGroup = new FormGroup({
    source: new FormControl(''),
    operation: new FormControl(''),
    civilite: new FormControl(''),
    nom: new FormControl(''),
    prenom: new FormControl(''),
    pays_residence: new FormControl(''),
    email: new FormControl(''),
    indicatif_phone: new FormControl(''),
    numero_phone: new FormControl(''),
    date_naissance: new FormControl(''),
    nationalite: new FormControl(''),
    indicatif_whatsapp: new FormControl(''),
    numero_whatsapp: new FormControl(''),
    indicatif_telegram: new FormControl(''),
    numero_telegram: new FormControl(''),
    dernier_niveau_academique: new FormControl(''),
    statut: new FormControl(''),
    niveau_fr: new FormControl(''),
    niveau_en: new FormControl(''),
  })



  onAdd() {
    this.LCS.create({ ...this.addForm.value }).subscribe(data => {
      this.addForm.reset()
      this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau lead" })
    })
  }

  constructor(private LCS: LeadcrmService, private ToastService: MessageService) { }

  ngOnInit(): void {
  }

}
