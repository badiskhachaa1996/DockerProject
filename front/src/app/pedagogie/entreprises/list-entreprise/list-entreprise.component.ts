import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-entreprise',
  templateUrl: './list-entreprise.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-entreprise.component.scss']
})
export class ListEntrepriseComponent implements OnInit {
  token;
  entreprises: Entreprise[] = [];
  users: User[] = [];
  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Autre" 
  ]
  civiliteList = environment.civilite;

  formUpdateEntreprise: FormGroup;
  showFormUpdateEntreprise: Entreprise;
  IntExtChoice = [{ label: "Interne", value: true }, { label: "Externe", value: false }]
  constructor(private userService: AuthService, private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

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

    //Recuperation de la liste des users
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user) => {
          this.users[user._id] = user;
        })
      }),
      ((error) => { console.error(error); })
    );
    
    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { 
        this.entreprises = response; 
        console.log(response);
      }),
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

    })
  }

  /** Parti traitement pour la mise à jour des données */
  get r_sociale() { return this.formUpdateEntreprise.get('r_sociale'); };
  get fm_juridique() { return this.formUpdateEntreprise.get('fm_juridique'); };
  get activite() { return this.formUpdateEntreprise.get('activite'); };
  get type_ent() { return this.formUpdateEntreprise.get('type_ent'); };
  get crc() { return this.formUpdateEntreprise.get('crc'); };
  get nb_salarie() { return this.formUpdateEntreprise.get('nb_salarie'); };
  get convention() { return this.formUpdateEntreprise.get('convention'); };
  get idcc() { return this.formUpdateEntreprise.get('idcc'); };
  get indicatif_ent() { return this.formUpdateEntreprise.get('indicatif_ent'); };
  get phone_ent() { return this.formUpdateEntreprise.get('phone_ent'); };
  get adresse_ent() { return this.formUpdateEntreprise.get('adresse_ent'); };
  get code_postale_ent() { return this.formUpdateEntreprise.get('code_postale_ent'); };
  get ville_ent() { return this.formUpdateEntreprise.get('ville_ent'); };
  get adresse_ec() { return this.formUpdateEntreprise.get('adresse_ec'); };
  get postal_ec() { return this.formUpdateEntreprise.get('postal_ec'); };
  get ville_ec() { return this.formUpdateEntreprise.get('ville_ec'); };
  get siret() { return this.formUpdateEntreprise.get('siret'); };
  get code_ape_naf() { return this.formUpdateEntreprise.get('code_ape_naf'); };
  get num_tva() { return this.formUpdateEntreprise.get('num_tva'); };
  get telecopie() { return this.formUpdateEntreprise.get('telecopie'); };
  get OPCO() { return this.formUpdateEntreprise.get('OPCO'); };
  get organisme_prevoyance() { return this.formUpdateEntreprise.get('organisme_prevoyance'); };



  //Methode de modification d'une entreprise
  onUpdateEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formUpdateEntreprise.get('r_sociale')?.value;
    let fm_juridique = this.formUpdateEntreprise.get('fm_juridique')?.value;
    let activite = this.formUpdateEntreprise.get('activite')?.value;
    let type_ent = this.formUpdateEntreprise.get('type_ent')?.value;
    let categorie = this.formUpdateEntreprise.get('categorie')?.value;
    let isInterne = this.formUpdateEntreprise.get('isInterne')?.value;
    let crc = this.formUpdateEntreprise.get('crc')?.value;
    let nb_salarie = this.formUpdateEntreprise.get('nb_salarie')?.value;

    let convention = this.formUpdateEntreprise.get('convention')?.value;
    let idcc = this.formUpdateEntreprise.get('idcc')?.value;
    let indicatif_ent = this.formUpdateEntreprise.get('indicatif_ent')?.value;
    let phone_ent = this.formUpdateEntreprise.get('phone_ent')?.value;
    let adresse_ent = this.formUpdateEntreprise.get('adresse_ent')?.value;
    let code_postale_ent = this.formUpdateEntreprise.get('code_postale_ent')?.value
    let ville_ent = this.formUpdateEntreprise.get('ville_ent')?.value;
    let adresse_ec = this.formUpdateEntreprise.get('adresse_ec')?.value;
    let postal_ec = this.formUpdateEntreprise.get('postal_ec')?.value;
    let ville_ec = this.formUpdateEntreprise.get('ville_ec')?.value;
    let siret = this.formUpdateEntreprise.get('siret')?.value; 
    let code_ape_naf = this.formUpdateEntreprise.get('code_ape_naf')?.value;
    let num_tva = this.formUpdateEntreprise.get('num_tva')?.value;
    let telecopie = this.formUpdateEntreprise.get('telecopie')?.value;
    let OPCO = this.formUpdateEntreprise.get('OPCO')?.value;
    let organisme_prevoyance = this.formUpdateEntreprise.get('organisme_prevoyance')?.value;

    let entreprise = new Entreprise(
      this.showFormUpdateEntreprise._id, 
      r_sociale, 
      fm_juridique, 
      activite, 
      type_ent, 
      categorie, 
      isInterne, 
      crc, 
      nb_salarie, 
      convention, 
      idcc, 
      indicatif_ent, 
      phone_ent, 
      adresse_ent, 
      code_postale_ent, 
      ville_ent, 
      adresse_ec, 
      postal_ec, 
      ville_ec, 
      siret, 
      code_ape_naf, 
      num_tva, 
      telecopie, 
      OPCO, 
      organisme_prevoyance, 
      null,
      ); 

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
