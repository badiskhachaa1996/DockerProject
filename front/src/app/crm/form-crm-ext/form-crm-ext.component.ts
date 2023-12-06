import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from "@angular/router";
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-form-crm-ext',
  templateUrl: './form-crm-ext.component.html',
  styleUrls: ['./form-crm-ext.component.scss']
})
export class FormCrmExtComponent implements OnInit {
  hideFormations = false;
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
    { value: 'LinkedIn' },
  ]
  operationDropdown = [
    { value: 'Prospection FRP' },
    { value: 'Prospection ENP' },
    { value: 'Prospection ICBS Malte' },
    { value: 'Prospection ICBS Dubai' },
    { value: 'Prospection Alternant' },
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
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    numero_phone: new FormControl(''),
    dernier_niveau_academique: new FormControl(''),
    whatsapp: new FormControl("Non"),
    formation: new FormControl(''),
    note_choix: new FormControl('')
  })

  prospects = []
  form_origin: string = this.route.snapshot.paramMap.get('ecole'); //eduhorizons estya adg espic studinfo

  onAdd() {
    let numero_whatsapp = ''
    if (this.addForm.invalid) {
      this.ToastService.add({ severity: 'error', summary: 'Votre email est déjà utilisé' });
      this.viewportScroller.scrollToAnchor('EmailForm');
    } else {
      if (this.addForm.value.whatsapp.includes('Oui'))
        numero_whatsapp = this.addForm.value.numero_phone
      this.LCS.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), source: `Site Web ${this.ECOLE.titre}`, numero_whatsapp }).subscribe(data => {
        this.addForm.reset()
        //this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau lead" })
      },
        ((error) => {
          this.ToastService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: error?.error });
          console.error(error);
        }))
    }

  }

  generateID() {
    let prenom = this.addForm.value.prenom.substring(0, 1)
    let nom = this.addForm.value.nom.substring(0, 1)
    let dn = new Date(this.addForm.value.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    return ('SW' + prenom + nom + jour + mois + year + nb).toUpperCase()
  }


  constructor(private LCS: LeadcrmService, private ToastService: MessageService, private viewportScroller: ViewportScroller,
    private route: ActivatedRoute, private router: Router, private FAService: FormulaireAdmissionService) { }
  ECOLE: EcoleAdmission
  RENTREE: RentreeAdmission[]
  FormationList = []
  ngOnInit(): void {
    this.FAService.EAgetByParams(this.form_origin).subscribe(data => {
      console.log(data)
      this.hideFormations = !data;
      if (!data) return;
        //this.router.navigate(['/'])
      this.ECOLE = data
      data.formations.forEach(f => {
        this.FormationList.push({ label: f.nom, value: f.nom })
      })

    })
  }

}
