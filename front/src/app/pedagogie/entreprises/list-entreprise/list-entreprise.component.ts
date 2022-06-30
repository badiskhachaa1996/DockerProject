import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';

@Component({
  selector: 'app-list-entreprise',
  templateUrl: './list-entreprise.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-entreprise.component.scss']
})
export class ListEntrepriseComponent implements OnInit {
  token;
  entreprises: Entreprise[] = [];
  formUpdateEntreprise: FormGroup;
  showFormUpdateEntreprise: Entreprise;
  IntExtChoice = [{ label: "Interne", value: true }, { label: "Externe", value: false }]
  constructor(private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else if (this.token["role"].includes("user")) {
      this.router.navigate(["/ticket/suivi"])
    }
    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { this.entreprises = response; console.log(this.entreprises) }),
      ((error) => { console.log(error); })
    );

    this.onInitFormUpdateEntreprise();
  }



  //Methode d'initialisation du formulaire de mise à jour d'une entreprise
  onInitFormUpdateEntreprise() {
    this.formUpdateEntreprise = this.formBuilder.group({
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
      email_contact: [''],
      phone_contact: [''],
      nom_contact_2nd: [''],
      prenom_contact_2nd: [''],
      fc_contact_2nd: [''],
      email_contact_2nd: [''],
      phone_contact_2nd: [''],
      pays_adresse: [''],
      ville_adresse: [''],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      email: [''],
      phone: [''],
      website: [''],
      financeur: [''],
      nda: [''],
      type_soc: [''],
    });
  }

  initFormUpdateEntreprise(entreprise: Entreprise) {
    this.showFormUpdateEntreprise = entreprise
    this.formUpdateEntreprise.patchValue({
      r_sociale: entreprise.r_sociale,
      fm_juridique: entreprise.fm_juridique,
      vip: entreprise.vip,
      type_ent: entreprise.type_ent,
      siret: entreprise.siret,
      isInterne: entreprise.isInterne,
      code_ape_naf: entreprise.code_ape_naf,
      num_tva: entreprise.num_tva,
      nom_contact: entreprise.nom_contact,
      prenom_contact: entreprise.prenom_contact,
      fc_contact: entreprise.fc_contact,
      email_contact: entreprise.email_contact,
      phone_contact: entreprise.phone_contact,
      nom_contact_2nd: entreprise.nom_contact_2nd,
      prenom_contact_2nd: entreprise.prenom_contact_2nd,
      fc_contact_2nd: entreprise.fc_contact_2nd,
      email_contact_2nd: entreprise.email_contact_2nd,
      phone_contact_2nd: entreprise.phone_contact_2nd,
      pays_adresse: entreprise.pays_adresse,
      ville_adresse: entreprise.ville_adresse,
      rue_adresse: entreprise.rue_adresse,
      numero_adresse: entreprise.numero_adresse,
      postal_adresse: entreprise.postal_adresse,
      email: entreprise.email,
      phone: entreprise.phone,
      website: entreprise.website,
      financeur: entreprise.financeur,
      nda: entreprise.nda,
      type_soc: entreprise.type_soc,
    })
  }

  /** Parti traitement pour la mise à jour des données */
  get r_sociale_m() { return this.formUpdateEntreprise.get('r_sociale'); };
  get fm_juridique_m() { return this.formUpdateEntreprise.get('fm_juridique'); };
  get type_ent_m() { return this.formUpdateEntreprise.get('type_ent'); };
  get siret_m() { return this.formUpdateEntreprise.get('siret'); };
  get nom_contact_m() { return this.formUpdateEntreprise.get('nom_contact'); };
  get prenom_contact_m() { return this.formUpdateEntreprise.get('prenom_contact'); };
  get nom_contact_2nd_m() { return this.formUpdateEntreprise.get('nom_contact_2nd'); };
  get prenom_contact_2nd_m() { return this.formUpdateEntreprise.get('prenom_contact_2nd'); };
  get pays_adresse_m() { return this.formUpdateEntreprise.get('pays_adresse'); };
  get ville_adresse_m() { return this.formUpdateEntreprise.get('ville_adresse'); };
  get rue_adresse_m() { return this.formUpdateEntreprise.get('rue_adresse'); };
  get financeur_m() { return this.formUpdateEntreprise.get('financeur'); };

  //Methode de modification d'une entreprise
  onUpdateEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formUpdateEntreprise.get('r_sociale')?.value;
    let fm_juridique = this.formUpdateEntreprise.get('fm_juridique')?.value;
    let vip = this.formUpdateEntreprise.get('vip')?.value;
    let type_ent = this.formUpdateEntreprise.get('type_ent')?.value;
    let isInterne = this.formUpdateEntreprise.get('isInterne')?.value;
    let siret = this.formUpdateEntreprise.get('siret')?.value;
    let code_ape_naf = this.formUpdateEntreprise.get('code_ape_naf')?.value;
    let num_tva = this.formUpdateEntreprise.get('num_tva')?.value;
    let nom_contact = this.formUpdateEntreprise.get('nom_contact')?.value;
    let prenom_contact = this.formUpdateEntreprise.get('prenom_contact')?.value;
    let fc_contact = this.formUpdateEntreprise.get('fc_contact')?.value;
    let email_contact = this.formUpdateEntreprise.get('email_contact')?.value;
    let phone_contact = this.formUpdateEntreprise.get('phone_contact')?.value;
    let nom_contact_2nd = this.formUpdateEntreprise.get('nom_contact_2nd')?.value;
    let prenom_contact_2nd = this.formUpdateEntreprise.get('prenom_contact_2nd')?.value;
    let fc_contact_2nd = this.formUpdateEntreprise.get('fc_contact_2nd')?.value;
    let email_contact_2nd = this.formUpdateEntreprise.get('email_contact_2nd')?.value;
    let phone_contact_2nd = this.formUpdateEntreprise.get('phone_contact_2nd')?.value;
    let pays_adresse = this.formUpdateEntreprise.get('pays_adresse')?.value;
    let ville_adresse = this.formUpdateEntreprise.get('ville_adresse')?.value;
    let rue_adresse = this.formUpdateEntreprise.get('rue_adresse')?.value;
    let numero_adresse = this.formUpdateEntreprise.get('numero_adresse')?.value;
    let postal_adresse = this.formUpdateEntreprise.get('postal_adresse')?.value;
    let email = this.formUpdateEntreprise.get('email')?.value;
    let phone = this.formUpdateEntreprise.get('phone')?.value;
    let website = this.formUpdateEntreprise.get('website')?.value;
    let financeur = this.formUpdateEntreprise.get('financeur')?.value;
    let nda = this.formUpdateEntreprise.get('nda')?.value;
    let type_soc = this.formUpdateEntreprise.get('type_soc')?.value;

    let entreprise = new Entreprise(this.showFormUpdateEntreprise._id, r_sociale, fm_juridique, vip, type_ent, isInterne, siret, code_ape_naf, num_tva, nom_contact, prenom_contact, fc_contact, email_contact, phone_contact, nom_contact_2nd, prenom_contact_2nd, fc_contact_2nd, email_contact_2nd, phone_contact_2nd, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse, email, phone, website, financeur, nda, type_soc);

    this.entrepriseService.update(entreprise).subscribe(
      ((response) => {

        this.messageService.add({ severity: 'success', summary: 'Entreprise modifiée' });

        //Recuperation de la liste des entreprises
        this.entrepriseService.getAll().subscribe(
          ((entreprisesFromDb) => { this.entreprises = entreprisesFromDb; }),
          ((error) => { console.log(error); })
        );
        this.showFormUpdateEntreprise = null;

      }),
      ((error) => { console.log(error); })
    );

  }

}
