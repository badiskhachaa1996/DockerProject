import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entreprise } from 'src/app/models/Entreprise';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { TuteurService } from 'src/app/services/tuteur.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Annonce } from 'src/app/models/Annonce';

@Component({
  selector: 'app-new-entreprises',
  templateUrl: './new-entreprises.component.html',
  styleUrls: ['./new-entreprises.component.scss']
})
export class NewEntreprisesComponent implements OnInit {

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

  categorieFilter = [
    { label: 'Toutes les catégories', value: null },
    { label: 'Sous-traitant', value: 'Sous-traitant' },
    { label: "Alternant", value: 'Alternant' },
    { label: "Prestataire", value: 'Prestataire' },
    { label: "Autre", value: 'Autre' }
  ]
  civiliteList = environment.civilite;
  secteurs = [
    { label: 'Industrie manufacturière', value: 'Industrie manufacturière' },
    { label: "Technologie de l'information et de la communication", value: "Technologie de l'information et de la communication" },
    { label: "Finance et services bancaires", value: "Finance et services bancaires" },
    { label: "Commerce de détail", value: "Commerce de détail" },
    { label: "Énergie", value: "Énergie" },
    { label: "Santé et pharmaceutique", value: "Santé et pharmaceutique" },
    { label: "Transport et logistique", value: "Transport et logistique" },
    { label: "Tourisme et hôtellerie", value: "Tourisme et hôtellerie" },
    { label: "Construction et immobilier", value: "Construction et immobilier" },
    { label: "Éducation", value: "Éducation" },
    { label: "Industrie automobile", value: "Industrie automobile" },
    { label: "Aérospatiale et défense", value: "Aérospatiale et défense" },
    { label: "Médias et divertissement", value: "Médias et divertissement" },
    { label: "Environnement et développement durable", value: "Environnement et développement durable" },
    { label: "Chimie", value: "Chimie" },
    { label: "Artisanat et design", value: "Artisanat et design" },
    { label: "Télécommunications", value: "Télécommunications" },
    { label: "Services professionnels", value: "Services professionnels" },
    { label: "Services publics", value: "Services publics" }

  ]

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ];

  formSteps: any[] = [
    { label: "Entreprise", icon: "pi pi-sitemap", i: 0 },
    { label: "Representant", icon: "pi pi-user", i: 1 },
  ];
  entrepriseOfferList = []
  ActiveIndex = 0;

  formUpdateEntreprise: FormGroup;
  showFormUpdateEntreprise: Entreprise;
  representantToUpdate: User;
  IntExtChoice = [{ label: "Interne", value: true }, { label: "Externe", value: false }];

  // formulaire qui permet de saisir l'adresse mail d'un représentant et de lui envoyer une creation link
  formEmail: FormGroup;
  showFormEmail: boolean = false;
  dicEntLastConnection = {}
  dicEntRepresentant = {}
  dicEntOffer = {}
  constructor(private userService: AuthService, private entrepriseService: EntrepriseService,
    private formBuilder: FormBuilder, private messageService: MessageService, private router: Router,
    private TuteurService: TuteurService, private AnnonceService: AnnonceService) { }

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
    /*this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user: User) => {
          this.users[user._id] = user;

          // recuperation de la liste des commerciaux
          if (user.type == 'Commercial') {
            this.commercials.push({ label: `${user.firstname} ${user.lastname}`, value: user._id });
          }

        })
      }),
      ((error) => { console.error(error); })
    );*/

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        this.entreprises = response;
        if (this.token.role == 'Watcher') {
          this.entreprises = this.entreprises.slice(0, 5);
        }
        response.forEach(ent => {
          let ids = []
          this.TuteurService.getAllByEntrepriseId(ent._id).subscribe(tuteurs => {
            let d = new Date(tuteurs[0]?.user_id?.last_connection).getTime()
            tuteurs.forEach(t => {
              if (t.user_id) {
                ids.push(t?.user_id?._id)
                if (new Date(t?.user_id?.last_connection).getTime() > d)
                  d = new Date(t?.user_id?.last_connection).getTime()
              }
            })
            if (!isNaN(d))
              this.dicEntLastConnection[ent._id] = new Date(d);
            this.dicEntRepresentant[ent._id] = tuteurs
          })


          if (ent.directeur_id && !ids.includes(ent.directeur_id))
            this.userService.getPopulate(ent.directeur_id).subscribe(directeur => {
              if (directeur) {
                directeur.role = "Admin"
                if (this.dicEntRepresentant[ent._id])
                  this.dicEntRepresentant[ent._id].push({ user_id: directeur })
                else
                  this.dicEntRepresentant[ent._id] = [{ user_id: directeur }]
              }

            })
        })
        this.AnnonceService.getAnnonces().then(annonces => {
          annonces.forEach((ann: Annonce) => {
            if (ann.entreprise_id)
              if (this.dicEntOffer[ann.entreprise_id._id])
                this.dicEntOffer[ann.entreprise_id._id].push(ann)
              else
                this.dicEntOffer[ann.entreprise_id._id] = [ann]
          })
        })
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
      error: (error) => { console.error(error) },
      complete: () => { console.log('Utilisateur connecté récupéré') }
    });
  }



  //Methode d'initialisation du formulaire de mise à jour d'une entreprise
  onInitFormUpdateEntreprise() {
    this.formUpdateEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      // fm_juridique: [''],
      activite: [''],
      secteur_activite: ['', Validators.required],
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
      commercial: [''],

      civilite_rep: [this.civiliteList[0]],
      nom_rep: [''],
      prenom_rep: [''],
      email_rep: [''],
      indicatif_rep: [''],
      phone_rep: [''],
    })
  }

  initFormUpdateEntreprise(entreprise: Entreprise) {

    this.showFormUpdateEntreprise = entreprise;
    this.formUpdateEntreprise.patchValue({
      ...entreprise,

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

    let civilite_rep = this.formUpdateEntreprise.get('civilite_rep')?.value;
    let nom_rep = this.formUpdateEntreprise.get('nom_rep')?.value;
    let prenom_rep = this.formUpdateEntreprise.get('prenom_rep')?.value;
    let email_rep = this.formUpdateEntreprise.get('email_rep')?.value;
    let indicatif_rep = this.formUpdateEntreprise.get('indicatif_rep').value;
    let phone_rep = this.formUpdateEntreprise.get('phone_rep').value;

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

    this.entrepriseService.updateEntrepriseRepresentant({ 'entrepriseToUpdate': { _id: this.showFormUpdateEntreprise._id, ...this.formUpdateEntreprise.value }, 'representantToUpdate': representant }).subscribe(
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

  onRedirect() {
    this.router.navigate(['/skillsnet/ajout-entreprise']);
  }

  // méthode de redirection vers le formulaire de création d'entreprise
  onGenerateForm(): void {
    if (confirm("Vous allez un générer un formulaire qui permettra d'envoyer un mail vers un représentant d'entreprise, afin d'enregistrer son entreprise sur IMS, votre id sera lié à cette entreprise si la création aboutit!")) {
      this.showFormEmail = true;
    }
  }

  // méthode d'envoi du mail de création de l'entreprise à l'entreprise
  onSendCreationLink(): void {
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

  deleteEntreprise(entreprise: Entreprise) {
    if (confirm('Voulez-vous supprimer ' + entreprise?.r_sociale + " et tous les comptes tuteurs attachés ?"))
      this.entrepriseService.delete(entreprise._id).subscribe(r => {
        this.entreprises.splice(this.entreprises.indexOf(entreprise), 1)
        this.messageService.add({ severity: 'success', summary: 'Suppression de l\'entreprise avec succès' })
      })
  }
  InitMatching(entreprise: Entreprise) {
    this.router.navigate(['skillsnet/annonce/entreprise', entreprise._id])
  }

  activeIndex1 = 1

  handleClose(e) {

  }

  addRep: Entreprise = null
  roleListRepresentant = [
    { label: 'Tuteur', value: 'Tuteur' },
    { label: 'Administrateur', value: 'Administrateur' },
    { label: 'Commercial', value: 'Commercial' }
  ]
  formAddRep = new FormGroup({
    entreprise_id: new FormControl('', Validators.required),
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    role: new FormControl('Tuteur', Validators.required),
    email_perso: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  })
  addRepresentant(entreprise: Entreprise) {
    this.addRep = entreprise
    this.formAddRep.patchValue({ entreprise_id: entreprise._id })
  }

  onAddRep() {
    this.TuteurService.create({ newUser: { ...this.formAddRep.value, role: 'user' }, newTuteur: { ...this.formAddRep.value } }).subscribe(t => {
      t.tuteur.user_id = t.user
      if (this.dicEntRepresentant[this.addRep._id])
        this.dicEntRepresentant[this.addRep._id].push(t.tuteur)
      else
        this.dicEntRepresentant[this.addRep._id] = [t.tuteur]
      this.addRep = null
      this.formAddRep.reset()

    })
  }
  sorted = 1
  sortByLastConnexion() {

    this.entreprises.sort((a, b) => {
      let val1 = 0
      let val2 = 0
      if (this.dicEntLastConnection[a._id])
        val1 = new Date(this.dicEntLastConnection[a._id])?.getTime()
      if (this.dicEntLastConnection[b._id])
        val2 = new Date(this.dicEntLastConnection[b._id])?.getTime()
      if (val1 > val2)
        return this.sorted
      else
        return this.sorted * -1
    })
    this.sorted = this.sorted * -1
  }


}

