import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {EcoleAdmission} from "../../models/EcoleAdmission";
import {RentreeAdmission} from "../../models/RentreeAdmission";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactUsService} from "../../services/contact-us.service";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
    { value: 'LinkdIn' },
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
  form_origin: string | null = this.route.snapshot.paramMap.get('ecole'); //eduhorizons estya adg espic studinfo

  onAdd() {
    let numero_whatsapp = ''
    if (this.addForm.invalid) {
      this.viewportScroller.scrollToAnchor('EmailForm');
    } else {
      if (this.addForm.value.whatsapp.includes('Oui'))
        numero_whatsapp = this.addForm.value.numero_phone
      this.CUService.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), source: `Site Web `, numero_whatsapp }).subscribe(data => {
          this.addForm.reset()
          //this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau lead" })
        },
        ((error) => {
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


  constructor(private CUService: ContactUsService, private viewportScroller: ViewportScroller,
              private route: ActivatedRoute, private router: Router) { }

  ECOLE!: EcoleAdmission
  RENTREE!: RentreeAdmission[]
  FormationList: { Label: string; value: string }[] = [
    { Label: 'Test1', value: 'Value1' },
    { Label: 'Test2', value: 'Value2' },
  ];
  ngOnInit(): void {
    /*
    console.log(this.form_origin);
    if (this.form_origin) {
    this.CUService.EAgetByParams(this.form_origin).subscribe(data => {
      console.log(data)
      if (!data)
        this.router.navigate(['/'])
      this.ECOLE = data
      data.formations?.forEach(f => {
        if (f.nom)
          this.FormationList.push({Label: f.nom, value: f.nom})
      })
    })
  }
     */
  }

}
