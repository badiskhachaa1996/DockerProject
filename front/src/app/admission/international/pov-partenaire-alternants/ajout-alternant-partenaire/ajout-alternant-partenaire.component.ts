import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlternantsPartenaireService } from 'src/app/services/alternants-partenaire.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-ajout-alternant-partenaire',
  templateUrl: './ajout-alternant-partenaire.component.html',
  styleUrls: ['./ajout-alternant-partenaire.component.scss']
})
export class AjoutAlternantPartenaireComponent implements OnInit {

  CODE = this.route.snapshot.paramMap.get('code_commercial');

  ActiveIndex = 0
  formSteps = [
    'Informations personnelles',
    'Adresse',
    'Formation et Ecole/CFA',
    'Contrat',
  ]

  nationList = environment.nationalites;
  paysList = environment.pays;

  civiliteList: any = [
    { label: 'Monsieur', value: "Monsieur" },
    { label: 'Madame', value: "Madame" },
    { label: 'Autre', value: "Autre" },
  ];

  ecoleList = [
  ]
  dicEcole = {}
  campusList = [
    { label: 'Paris - Champs sur Marne', value: 'Paris - Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: "Montpellier" },
  ]
  rentreeList = [
    { label: '2023 - 2024', value: "2023 - 2024" },
    { label: '2024 - 2025', value: "2024 - 2025" },
  ]

  etatList = [
    { label: 'A la recherche', value: "A la recherche" },
    { label: "En attente d'information", value: "En attente d'information" },
    { label: 'Contrat Etabli', value: "Contrat Etabli" },
    { label: 'Contrat signé', value: "Contrat signé" },
    { label: 'Contrat déposé à OPCO', value: "Contrat déposé à OPCO" },
    { label: 'Contrat validé à la facturation', value: "Contrat validé à la facturation" },
  ]

  formationlist = [

  ]

  constructor(private route: ActivatedRoute, private APService: AlternantsPartenaireService,
    private ToastService: MessageService, private router: Router, private FAService: FormulaireAdmissionService) { }

  RegisterForm = new FormGroup({
    date_creation: new FormControl(new Date()),
    prenom: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pays: new FormControl('', Validators.required),
    campus: new FormControl('', Validators.required),
    ecole: new FormControl('', Validators.required),
    formation: new FormControl(''),
    rentree_scolaire: new FormControl('', Validators.required),
    etat_contrat: new FormControl('',),
    code_commercial: new FormControl(this.CODE, Validators.required),
    civilite: new FormControl('', Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
    whatsapp: new FormControl(''),
    indicatif: new FormControl('', Validators.required),
    indicatif_whatsapp: new FormControl(''),
    isPMR: new FormControl(false, Validators.required),
    rue: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    postal: new FormControl('', Validators.required),
    ville: new FormControl('', Validators.required),
    date_contrat: new FormControl('',),
    entreprise: new FormControl('',),
    adresse_entreprise: new FormControl('',),
    telephone_entreprise: new FormControl('',),
    mail_entreprise: new FormControl('', [Validators.email]),
  })

  canNext1() {
    return this.RegisterForm.get('prenom').valid && this.RegisterForm.get('nom').valid &&
      this.RegisterForm.get('civilite').valid && this.RegisterForm.get('date_naissance').valid &&
      this.RegisterForm.get('nationalite').valid && this.RegisterForm.get('email').valid &&
      this.RegisterForm.get('indicatif').valid && this.RegisterForm.get('telephone').valid &&
      this.RegisterForm.get('indicatif_whatsapp').valid && this.RegisterForm.get('whatsapp').valid &&
      this.RegisterForm.get('isPMR').valid
  }

  canNext2() {
    return this.RegisterForm.get('numero').valid && this.RegisterForm.get('rue').valid &&
      this.RegisterForm.get('postal').valid && this.RegisterForm.get('ville').valid &&
      this.RegisterForm.get('pays').valid
  }

  canNext3() {
    return this.RegisterForm.get('ecole').valid && this.RegisterForm.get('campus').valid &&
      this.RegisterForm.get('rentree_scolaire').valid
  }
  token;
  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.ecoleList.push({ label: d.titre, value: d.titre })
        this.dicEcole[d.titre] = d
      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(f => {
        this.formationlist.push({ label: f.nom, value: f.nom })
      })
    })
    this.token = jwt_decode(localStorage.getItem('token'));
  }

  onAddAlternant() {
    this.APService.create({ ...this.RegisterForm.value, custom_id: this.generateID() }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Ajout d'alternant avec succès" })
      this.router.navigate(['/international/partenaire/alternants/', this.CODE])
    })
  }

  nextPage() {
    this.ActiveIndex += 1
  }

  previousPage() {
    this.ActiveIndex -= 1
  }

  generateID() {
    return this.CODE + "A" + this.pad(Math.floor(Math.random() * (999)).toString())
  }

  pad(number: string) {
    while (number.length < 3)
      number = `0${number}`
    return number
  }

  onSelectEcole() {
    this.formationlist = []
    this.dicEcole[this.RegisterForm.value.ecole].formations.forEach(f => {
      this.formationlist.push({ label: f.nom, value: f.nom })
    })
  }

}
