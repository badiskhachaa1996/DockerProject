import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-entreprise',
  templateUrl: './list-entreprise.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-entreprise.component.scss']
})
export class ListEntrepriseComponent implements OnInit {
  token;
  entreprises: Entreprise[] = [];
  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Autre" 
  ]
  civiliteList = environment.civilite;

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
      ((response) => { this.entreprises = response; }),
      ((error) => { console.error(error); })
    );

    this.onInitFormUpdateEntreprise();
  }



  //Methode d'initialisation du formulaire de mise à jour d'une entreprise
  onInitFormUpdateEntreprise() {
    this.formUpdateEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      fm_juridique: [''],
      activite: [''],
      type_ent: [''],
      categorie: [[]],
      isInterne: [false],
      crc: [''], 
      nb_salarie: ['', [Validators.pattern('[0-9]+')]],
      convention: [''],
      idcc: ['', [Validators.pattern('[0-9]+')]], 
      indicatif_ent: [''],
      phone_ent: [''],
      adresse_ent: [''],
      code_postale_ent: [''],
      ville_ent: [''],
      adresse_ec: [''],
      postal_ec: [''],
      ville_ec: [''],  
      siret: [''],
      code_ape_naf: [''],
      num_tva: [''],
      telecopie: [''],
      OPCO: [''],
      organisme_prevoyance: [''],

      civilite_rep: [this.civiliteList[0]],
      nom_rep: [''],
      prenom_rep: [''],
      email_rep: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      indicatif_rep: [''],
      phone_rep: [''],
      indicatif_rep_wt: [''],
      phone_rep_wt: [''],
      isTuteur: [false],

      civilite_tuteur: [this.civiliteList[0]],
      nom_tuteur: [''],
      prenom_tuteur: [''],
      email_tuteur: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      indicatif_tuteur: [''],
      phone_tuteur: [''],
      indicatif_tuteur_wt: [''],
      phone_tuteur_wt: [''],
      date_naissance_tuteur: [''],
      fonction_tuteur: [''],
      anciennete_tuteur: [''],
      niveau_etude_tuteur: [''],


    })
  }

  initFormUpdateEntreprise(entreprise: Entreprise) {
    this.showFormUpdateEntreprise = entreprise
    this.formUpdateEntreprise.patchValue({
      r_sociale: entreprise.r_sociale,
      fm_juridique: entreprise.fm_juridique,
      activite: entreprise.activite,
      type_ent: entreprise.type_ent,
      categorie: entreprise.categorie,
      isInterne: entreprise.isInterne,
      crc: entreprise.crc,
      nb_salarie: entreprise.nb_salarie,
      convention: entreprise.convention,
      idcc: entreprise.idcc,
      indicatif_ent: entreprise.indicatif_ent,
      phone_ent: entreprise.phone_ent,
      adresse_ent: entreprise.adresse_ent,
      code_postale_ent: entreprise.code_postale_ent,
      ville_ent: entreprise.ville_ent,
      adresse_ec: entreprise.adresse_ec,
      postal_ec: entreprise.postal_ec,
      ville_ec: entreprise.ville_ec,
      siret: entreprise.siret,
      code_ape_naf: entreprise.code_ape_naf,
      num_tva: entreprise.num_tva,
      telecopie: entreprise.telecopie,
      OPCO: entreprise.OPCO,
      organisme_prevoyance: entreprise.organisme_prevoyance,
      civilite_rep: entreprise.civilite_rep,
      nom_rep: entreprise.nom_rep,
      prenom_rep: entreprise.prenom_rep,
      email_rep: entreprise.email_rep,
      indicatif_rep: entreprise.indicatif_rep,
      phone_rep: entreprise.phone_rep,
      indicatif_rep_wt: entreprise.indicatif_rep_wt,
      phone_rep_wt: entreprise.phone_rep_wt,
      isTuteur: entreprise.isTuteur,
      civilite_tuteur: entreprise.civilite_tuteur,
      nom_tuteur: entreprise.nom_tuteur,
      prenom_tuteur: entreprise.prenom_tuteur,
      email_tuteur: entreprise.email_tuteur,
      indicatif_tuteur: entreprise.indicatif_tuteur,
      phone_tuteur: entreprise.phone_tuteur,
      indicatif_tuteur_wt: entreprise.indicatif_tuteur_wt,
      phone_tuteur_wt: entreprise.phone_tuteur_wt,
      date_naissance_tuteur: entreprise.date_naissance_tuteur,
      fonction_tuteur: entreprise.fonction_tuteur,
      anciennete_tuteur: entreprise.anciennete_tuteur,
      niveau_etude_tuteur: entreprise.niveau_etude_tuteur,

    })
  }

  /** Parti traitement pour la mise à jour des données */
  get r_sociale_m() { return this.formUpdateEntreprise.get('r_sociale'); };
  get fm_juridique_m() { return this.formUpdateEntreprise.get('fm_juridique'); };
  get activite_m() { return this.formUpdateEntreprise.get('activite'); };
  get type_ent_m() { return this.formUpdateEntreprise.get('type_ent'); };
  get crc_m() { return this.formUpdateEntreprise.get('crc'); };
  get nb_salarie_m() { return this.formUpdateEntreprise.get('nb_salarie'); };
  get convention_m() { return this.formUpdateEntreprise.get('convention'); };
  get idcc_m() { return this.formUpdateEntreprise.get('idcc'); };
  get indicatif_ent_m() { return this.formUpdateEntreprise.get('indicatif_ent'); };
  get phone_ent_m() { return this.formUpdateEntreprise.get('phone_ent'); };
  get adresse_ent_m() { return this.formUpdateEntreprise.get('adresse_ent'); };
  get code_postale_ent_m() { return this.formUpdateEntreprise.get('code_postale_ent'); };
  get ville_ent_m() { return this.formUpdateEntreprise.get('ville_ent'); };
  get adresse_ec_m() { return this.formUpdateEntreprise.get('adresse_ec'); };
  get postal_ec_m() { return this.formUpdateEntreprise.get('postal_ec'); };
  get ville_ec_m() { return this.formUpdateEntreprise.get('ville_ec'); };
  get siret_m() { return this.formUpdateEntreprise.get('siret'); };
  get code_ape_naf_m() { return this.formUpdateEntreprise.get('code_ape_naf'); };
  get num_tva_m() { return this.formUpdateEntreprise.get('num_tva'); };
  get telecopie_m() { return this.formUpdateEntreprise.get('telecopie'); };
  get OPCO_m() { return this.formUpdateEntreprise.get('OPCO'); };
  get organisme_prevoyance_m() { return this.formUpdateEntreprise.get('organisme_prevoyance'); };
  get nom_rep_m() { return this.formUpdateEntreprise.get('nom_rep'); };
  get prenom_rep_m() { return this.formUpdateEntreprise.get('prenom_rep'); };
  get email_rep_m() { return this.formUpdateEntreprise.get('email_rep'); };
  get indicatif_rep_m () { return this.formUpdateEntreprise.get('indicatif_rep'); };
  get phone_rep_m() { return this.formUpdateEntreprise.get('phone_rep'); };
  get indicatif_rep_wt_m() { return this.formUpdateEntreprise.get('indicatif_rep_wt'); };
  get phone_rep_wt_m() { return this.formUpdateEntreprise.get('phone_rep_wt'); };
  get nom_tuteur_m() { return this.formUpdateEntreprise.get('nom_tuteur'); };
  get prenom_tuteur_m() { return this.formUpdateEntreprise.get('prenom_tuteur'); };
  get emaim_tuteur_m() { return this.formUpdateEntreprise.get('email_tuteur'); };
  get indicatif_tuteur_m() { return this.formUpdateEntreprise.get('indicatif_tuteur'); }
  get phone_tuteur_m() { return this.formUpdateEntreprise.get('phone_tuteur'); };
  get indicatif_tuteur_wt_m() { return this.formUpdateEntreprise.get('indicatif_tuteur_wt'); }
  get phone_tuteur_wt_m() { return this.formUpdateEntreprise.get('phone_tuteur_wt'); };
  get fonction_tuteur_m() { return this.formUpdateEntreprise.get('fonction_tuteur'); };
  get anciennete_tuteur_m() { return this.formUpdateEntreprise.get('anciennete_tuteur');}
  get niveau_etude_tuteur_m() { return this.formUpdateEntreprise.get('niveau_etude_tuteur'); };



  //Methode de modification d'une entreprise
  onUpdateEntreprise() {
    //recuperation des données du formulaire
    let r_sociale_m = this.formUpdateEntreprise.get('r_sociale')?.value;
    let fm_juridique_m = this.formUpdateEntreprise.get('fm_juridique')?.value;
    let activite_m = this.formUpdateEntreprise.get('activite')?.value;
    let type_ent_m = this.formUpdateEntreprise.get('type_ent')?.value;
    let categorie_m = this.formUpdateEntreprise.get('categorie')?.value;
    let isInterne_m = this.formUpdateEntreprise.get('isInterne')?.value;
    let crc_m = this.formUpdateEntreprise.get('crc')?.value.value;
    let nb_salarie_m = this.formUpdateEntreprise.get('nb_salarie')?.value;
    let convention_m = this.formUpdateEntreprise.get('convention')?.value;
    let idcc_m = this.formUpdateEntreprise.get('idcc')?.value;
    let indicatif_ent_m = this.formUpdateEntreprise.get('indicatif_ent')?.value;
    let phone_ent_m = this.formUpdateEntreprise.get('phone_ent')?.value;
    let adresse_ent_m = this.formUpdateEntreprise.get('adresse_ent')?.value;
    let code_postale_ent_m = this.formUpdateEntreprise.get('code_postale_ent')?.value
    let ville_ent_m = this.formUpdateEntreprise.get('ville_ent')?.value;
    let adresse_ec_m = this.formUpdateEntreprise.get('adresse_ec')?.value;
    let postal_ec_m = this.formUpdateEntreprise.get('postal_ec')?.value;
    let ville_ec_m = this.formUpdateEntreprise.get('ville_ec')?.value;
    let siret_m = this.formUpdateEntreprise.get('siret')?.value; 
    let code_ape_naf_m = this.formUpdateEntreprise.get('code_ape_naf')?.value;
    let num_tva_m = this.formUpdateEntreprise.get('num_tva')?.value;
    let telecopie_m = this.formUpdateEntreprise.get('telecopie')?.value;
    let OPCO_m = this.formUpdateEntreprise.get('OPCO')?.value;
    let organisme_prevoyance_m = this.formUpdateEntreprise.get('organisme_prevoyance')?.value;

    let civilite_rep_m = this.formUpdateEntreprise.get('civilite_rep')?.value;
    let nom_rep_m = this.formUpdateEntreprise.get('nom_rep')?.value;
    let prenom_rep_m = this.formUpdateEntreprise.get('prenom_rep')?.value;
    let email_rep_m = this.formUpdateEntreprise.get('email_rep')?.value;
    let indicatif_rep_m = this.formUpdateEntreprise.get('indicatif_rep').value;
    let phone_rep_m = this.formUpdateEntreprise.get('phone_rep').value;
    let indicatif_rep_wt_m = this.formUpdateEntreprise.get('indicatif_rep_wt').value;
    let phone_rep_wt_m = this.formUpdateEntreprise.get('phone_rep_wt').value;
    let isTuteur_m = this.formUpdateEntreprise.get('isTuteur').value;

    let civilite_tuteur_m = this.formUpdateEntreprise.get('civilite_tuteur')?.value;
    let nom_tuteur_m = this.formUpdateEntreprise.get('nom_tuteur')?.value;
    let prenom_tuteur_m = this.formUpdateEntreprise.get('prenom_tuteur')?.value;
    let email_tuteur_m = this.formUpdateEntreprise.get('email_tuteur')?.value;
    let indicatif_tuteur_m = this.formUpdateEntreprise.get('indicatif_tuteur_wt')?.value;
    let phone_tuteur_m = this.formUpdateEntreprise.get('phone_tuteur')?.value;
    let indicatif_tuteur_wt_m = this.formUpdateEntreprise.get('indicatif_tuteur_wt')?.value;
    let phone_tuteur_wt_m = this.formUpdateEntreprise.get('phone_tuteur_wt')?.value;
    let date_naissance_tuteur_m = this.formUpdateEntreprise.get('date_naissance_tuteur')?.value
    let fonction_tuteur_m = this.formUpdateEntreprise.get('fonction_tuteur')?.value;
    let anciennete_tuteur_m = this.formUpdateEntreprise.get('anciennete_tuteur')?.value;
    let niveau_etude_tuteur_m = this.formUpdateEntreprise.get('niveau_etude_tuteur')?.value;

    let entreprise = new Entreprise(this.showFormUpdateEntreprise._id,);     // TODO

    this.entrepriseService.update(entreprise).subscribe(
      ((response) => {

        this.messageService.add({ severity: 'success', summary: 'Entreprise modifiée' });

        //Recuperation de la liste des entreprises
        this.entrepriseService.getAll().subscribe(
          ((entreprisesFromDb) => { this.entreprises = entreprisesFromDb; }),
          ((error) => { console.error(error); })
        );
        this.showFormUpdateEntreprise = null;

      }),
      ((error) => { console.error(error); })
    );

  }

  onRedirect()
  {
    this.router.navigate(['ajout-entreprise']);
  }

}
