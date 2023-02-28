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
  userConnected: User;
  token: any;
  entreprises: Entreprise[] = [];
  users: User[] = [];
  commercials: any = [{ label: 'Choisir le commercial référent', value: null }];
  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Prestataire",
    "Autre"
  ]
  civiliteList = environment.civilite;

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ];

  formSteps: any[] = [
    { label: "Entreprise", icon: "pi pi-sitemap", i: 0 },
    { label: "Representant", icon: "pi pi-user", i: 1 },
  ];

  ActiveIndex = 0;

  formUpdateEntreprise: FormGroup;
  showFormUpdateEntreprise: Entreprise;
  representantToUpdate: User;
  IntExtChoice = [{ label: "Interne", value: true }, { label: "Externe", value: false }];

  // formulaire qui permet de saisir l'adresse mail d'un représentant et de lui envoyer une creation link
  formEmail: FormGroup;
  showFormEmail: boolean = false;

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
        response.forEach((user: User) => {
          this.users[user._id] = user;
          
          // recuperation de la liste des commerciaux
          if(user.type == 'Commercial')
          {
            this.commercials.push({ label: `${user.firstname} ${user.lastname}`, value: user._id });
          }

        })
      }),
      ((error) => { console.error(error); })
    );
    
    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { 
        this.entreprises = response;
      }),
      ((error) => { console.error(error); })
    );

    this.onInitFormUpdateEntreprise();

    // initialisation du formulaire d'envoi de mail aux entreprise
    this.formEmail = this.formBuilder.group({
      adresse_mail: ['', [Validators.required, Validators.email]],
    });

    // recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.log(error) },
      complete: () => { console.log('Utilisateur connecté récupéré')}
    });
  }



  //Methode d'initialisation du formulaire de mise à jour d'une entreprise
  onInitFormUpdateEntreprise() {
    this.formUpdateEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      // fm_juridique: [''],
      activite: [''],
      // type_ent: [''],
      categorie: [[]],
      isInterne: [false],
      crc: [''], 
      nb_salarie: ['', Validators.pattern('[0-9]+')],
      convention: [''],
      idcc: ['', Validators.pattern('[0-9]+')], 
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
      // num_tva: [''],
      // telecopie: [''],
      OPCO: [''],
      // organisme_prevoyance: [''],
      commercial: ['', Validators.required],

      civilite_rep: [this.civiliteList[0]],
      nom_rep: [''],
      prenom_rep: [''],
      email_rep: ['', [Validators.email, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')]],
      indicatif_rep: [''],
      phone_rep: [''],
    })
  }

  initFormUpdateEntreprise(entreprise: Entreprise) {
  
    this.showFormUpdateEntreprise = entreprise;
    this.formUpdateEntreprise.patchValue({
      r_sociale: entreprise.r_sociale,
      // fm_juridique: entreprise.fm_juridique,
      activite: entreprise.activite,
      // type_ent: entreprise.type_ent,
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
      // num_tva: entreprise.num_tva,
      // telecopie: entreprise.telecopie,
      OPCO: entreprise.OPCO,
      // organisme_prevoyance: entreprise.organisme_prevoyance,

      civilite_rep: this.representantToUpdate?.civilite,
      nom_rep: this.representantToUpdate?.lastname,
      prenom_rep: this.representantToUpdate?.firstname,
      email_rep: this.representantToUpdate?.email_perso,
      indicatif_rep: this.representantToUpdate?.indicatif,
      phone_rep: this.representantToUpdate?.phone,

    })
  }

  /** Parti traitement pour la mise à jour des données */
  get r_sociale() { return this.formUpdateEntreprise.get('r_sociale'); };
  // get fm_juridique() { return this.formUpdateEntreprise.get('fm_juridique'); };
  get activite() { return this.formUpdateEntreprise.get('activite'); };
  // get type_ent() { return this.formUpdateEntreprise.get('type_ent'); };
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
  // get num_tva() { return this.formUpdateEntreprise.get('num_tva'); };
  // get telecopie() { return this.formUpdateEntreprise.get('telecopie'); };
  get OPCO() { return this.formUpdateEntreprise.get('OPCO'); };
  // get organisme_prevoyance() { return this.formUpdateEntreprise.get('organisme_prevoyance'); };



  //Methode de modification d'une entreprise
  onUpdateEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formUpdateEntreprise.get('r_sociale')?.value;
    // let fm_juridique = this.formUpdateEntreprise.get('fm_juridique')?.value;
    let activite = this.formUpdateEntreprise.get('activite')?.value;
    // let type_ent = this.formUpdateEntreprise.get('type_ent')?.value;
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
    // let num_tva = this.formUpdateEntreprise.get('num_tva')?.value;
    // let telecopie = this.formUpdateEntreprise.get('telecopie')?.value;
    let OPCO = this.formUpdateEntreprise.get('OPCO')?.value;
    // let organisme_prevoyance = this.formUpdateEntreprise.get('organisme_prevoyance')?.value;
    let commercial_id = this.formUpdateEntreprise.get('commercial')?.value;

    let civilite_rep = this.formUpdateEntreprise.get('civilite_rep')?.value;
    let nom_rep = this.formUpdateEntreprise.get('nom_rep')?.value;
    let prenom_rep = this.formUpdateEntreprise.get('prenom_rep')?.value;
    let email_rep = this.formUpdateEntreprise.get('email_rep')?.value;
    let indicatif_rep = this.formUpdateEntreprise.get('indicatif_rep').value;
    let phone_rep = this.formUpdateEntreprise.get('phone_rep').value;


    let entreprise = new Entreprise(
      this.showFormUpdateEntreprise._id, 
      r_sociale, 
      null, 
      activite, 
      null, 
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
      null, 
      null, 
      OPCO, 
      null, 
      this.showFormUpdateEntreprise.directeur_id,
      commercial_id,
      ); 
      
      let representant = new User(
        this.representantToUpdate._id,
        prenom_rep,
        nom_rep, 
        indicatif_rep,
        phone_rep,
        email_rep,
        email_rep, 
        null,
        'User',
        false,
        null,
        civilite_rep.value,
        null,
        null,
        'Représentant',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      );

    this.entrepriseService.updateEntrepriseRepresentant({'entrepriseToUpdate': entreprise, 'representantToUpdate': representant}).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Entreprise modifiée' });
        //Recuperation de la liste des entreprises
        this.entrepriseService.getAll().subscribe(
          ((entreprisesFromDb) => { this.entreprises = entreprisesFromDb; }),
          ((error) => { console.error(error); })
        );
        this.showFormUpdateEntreprise = null;
        this.formUpdateEntreprise.reset();
        this.ActiveIndex = 0;
      }),
      ((error) => { console.error(error); })
    );

  }

  nextPage() {
    this.ActiveIndex++
  }

  previousPage() {
    this.ActiveIndex--
  }

  onRedirect()
  {
    this.router.navigate(['ajout-entreprise']);
  }

  // méthode de redirection vers le formulaire de création d'entreprise
  onGenerateForm(): void
  {
    if(confirm("Vous allez un générer un formulaire qui permettra d'envoyer un mail vers un représentant d'entreprise, afin d'enregistrer son entreprise sur IMS, votre id sera lié à cette entreprise si la création aboutit!"))
    {
      this.showFormEmail = true;
    }
  }

  // méthode d'envoi du mail de création de l'entreprise à l'entreprise
  onSendCreationLink(): void
  {
    // recuperation du libelle depuis le formulaire
    const formValue = this.formEmail.value;

    this.entrepriseService.sendCreationLink(this.token.id, formValue.adresse_mail)
    .then((response) => { 
      this.messageService.add({ severity: 'success', summary: 'Lien de création', detail: response.successMsg }); 
      
      this.formEmail.reset();
      this.showFormEmail = false;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Lien de création', detail: error.errorMsg }); });
  }

}
