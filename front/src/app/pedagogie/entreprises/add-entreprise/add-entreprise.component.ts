import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';

@Component({
  selector: 'app-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.scss']
})
export class AddEntrepriseComponent implements OnInit {

  display: boolean;

  formAddEntreprise: FormGroup;

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ];

  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Autre" 
  ]

  constructor(private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {


    //Initialisation du formulaire d'ajout d'une entreprise
    this.onInitFormAddEntreprise();
  }

  //methode d'initialisation du formulaire d'ajout d'une entreprise
  onInitFormAddEntreprise() {
    this.formAddEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      fm_juridique: [''],
      vip: [''],
      type_ent: [''],
      isInterne: [false],
      siret: [''],
      code_ape_naf: [''],
      num_tva: [''],
      nom_contact: [''],
      prenom_contact: [''],
      fc_contact: [''],
      email_contact: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      phone_contact: [''],
      nom_contact_2nd: [''],
      prenom_contact_2nd: [''],
      fc_contact_2nd: [''],
      email_contact_2nd: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      phone_contact_2nd: [''],
      pays_adresse: [''],
      ville_adresse: [''],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      email: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      phone: [''],
      website: [''],
      financeur: [''],
      nda: [''],
      type_soc: [''],
      indicatif_1er: [''],
      indicatif_2nd: [''],
      indicatif_ent: [''],
      categorie: [[]]
    })
  }

  //Methode d'ajout d'une entreprise
  onAddEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formAddEntreprise.get('r_sociale')?.value;
    let fm_juridique = this.formAddEntreprise.get('fm_juridique')?.value;
    let vip = this.formAddEntreprise.get('vip')?.value;
    let type_ent = this.formAddEntreprise.get('type_ent')?.value;
    let isInterne = this.formAddEntreprise.get('isInterne')?.value.value;
    let siret = this.formAddEntreprise.get('siret')?.value;
    let code_ape_naf = this.formAddEntreprise.get('code_ape_naf')?.value;
    let num_tva = this.formAddEntreprise.get('num_tva')?.value;
    let nom_contact = this.formAddEntreprise.get('nom_contact')?.value;
    let prenom_contact = this.formAddEntreprise.get('prenom_contact')?.value;
    let fc_contact = this.formAddEntreprise.get('fc_contact')?.value;
    let email_contact = this.formAddEntreprise.get('email_contact')?.value;
    let phone_contact = this.formAddEntreprise.get('indicatif_1er')?.value + this.formAddEntreprise.get('phone_contact')?.value;
    let nom_contact_2nd = this.formAddEntreprise.get('nom_contact_2nd')?.value;
    let prenom_contact_2nd = this.formAddEntreprise.get('prenom_contact_2nd')?.value;
    let fc_contact_2nd = this.formAddEntreprise.get('fc_contact_2nd')?.value;
    let email_contact_2nd = this.formAddEntreprise.get('email_contact_2nd')?.value;
    let phone_contact_2nd = this.formAddEntreprise.get('indicatif_2nd')?.value + this.formAddEntreprise.get('phone_contact_2nd')?.value;
    let pays_adresse = this.formAddEntreprise.get('pays_adresse')?.value;
    let ville_adresse = this.formAddEntreprise.get('ville_adresse')?.value;
    let rue_adresse = this.formAddEntreprise.get('rue_adresse')?.value;
    let numero_adresse = this.formAddEntreprise.get('numero_adresse')?.value;
    let postal_adresse = this.formAddEntreprise.get('postal_adresse')?.value;
    let email = this.formAddEntreprise.get('email')?.value;
    let phone = this.formAddEntreprise.get('indicatif_ent')?.value + this.formAddEntreprise.get('phone')?.value;
    let website = this.formAddEntreprise.get('website')?.value;
    let financeur = this.formAddEntreprise.get('financeur')?.value;
    let nda = this.formAddEntreprise.get('nda')?.value
    let categorie = this.formAddEntreprise.get('categorie')?.value;
    let type_soc = this.formAddEntreprise.get('type_soc')?.value;

    let entreprise = new Entreprise(null, r_sociale, fm_juridique, vip, type_ent, isInterne, siret, code_ape_naf, num_tva, nom_contact, prenom_contact, fc_contact, email_contact, phone_contact, nom_contact_2nd, prenom_contact_2nd, fc_contact_2nd, email_contact_2nd, phone_contact_2nd, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse, email, phone, website, financeur, nda, type_soc, categorie);
    this.entrepriseService.create(entreprise).subscribe(
      ((response) => {

        this.messageService.add({ severity: 'success', summary: 'Ajout de l\entreprise' });
        this.formAddEntreprise.reset();
      }),
      ((error) => { console.error(error); })
    );
  }

}
