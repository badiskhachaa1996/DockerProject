import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Annonce } from 'src/app/models/Annonce';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Profile } from 'src/app/models/Profile';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { Competence } from 'src/app/models/Competence';
import { Router } from '@angular/router';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { Matching } from 'src/app/models/Matching';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.scss']
})
export class AnnoncesComponent implements OnInit {

  annonces: Annonce[] = [];

  entreprises: Entreprise[] = [];
  entreprisesWithCEO: Entreprise[] = [];
  entreprisesList: any = [{ label: 'Veuillez choisir une entreprise', value: null }];

  tuteurs: Tuteur[] = [];

  form: FormGroup;
  showForm: boolean = false;
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;

  userConnected: User;
  annonceSelected: Annonce;

  entrepriseType = [
    { label: 'Non', value: false },
    { label: 'Oui', value: true },
  ];

  profiles: Profile[] = [];
  profilsList: any = [
    { label: '' },
  ];

  locationOptions = [
    { label: 'Distanciel' },
    { label: 'Présentiel' },
    { label: 'Alterné à définir' }
  ];

  outilsList: any[] = [
    { label: 'Visual studio Code' },
    { label: 'Android studio' },
    { label: 'Wamp Server' },
    { label: 'Xamp Server' },
    { label: 'Mamp Server' },
    { label: "MySQl Workbench" },
    { label: "JMerise" },
    { label: "DIA" },
    { label: "StarUML" },
    { label: "mongoDb Compas" },
    { label: 'Eclipse' },
    { label: 'Git' },
    { label: 'Mercurial' },
    { label: 'IDL' },
    { label: 'Matlab' },
    { label: 'Netcdf' },
    { label: 'IDFS' },
    { label: 'Teamviewer' },
    { label: 'Ocean' },
    { label: 'Jira' },
    { label: 'Trello' },
  ];

  //Initialiser à vide ensuite modifier dans la selection des profil
  competencesList: any[] = [];

  selectedMulti: string[] = [];
  selectedMultiOutils: string[] = [];

  missionTypes: any = [
    { label: 'Stage' },
    { label: 'Alternance' },
    { label: 'Professionnalisation' },
    { label: 'CDD' },
    { label: 'CDI' }
  ];

  canAddOrEdit = false
  isCommercial = false
  isEntreprise = false

  token: any;

  constructor(private skillsService: SkillsService, private tuteurService: TuteurService,
    private entrepriseService: EntrepriseService, private messageService: MessageService,
    private formBuilder: FormBuilder, private userService: AuthService,
    private annonceService: AnnonceService, private router: Router, private CvService: CvService,
    private MatchingService: MatchingService) { }

  ngOnInit(): void {
    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));
    this.canAddOrEdit = this.token.role == "Admin"

    this.userService.getPopulate(this.token.id).subscribe(user => {
      if (!this.canAddOrEdit)
        this.canAddOrEdit = (user.role == "Commercial" || user.type == "Commercial")
      this.isEntreprise = (this.canAddOrEdit || user.type == "CEO Entreprise")
    })


    // recuperation de la liste des classes
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      is_interne: [true],
      entreprise_id: [''],
      entreprise_name: [''],
      entreprise_ville: [''],
      entreprise_mail: [''],
      entreprise_phone_indicatif: [''],
      entreprise_phone: [''],
      missionName: [''],
      profil: [this.profilsList[0]],
      competences: [''],
      outils: [''],
      workplaceType: [this.locationOptions[1]],
      missionDesc: [''],
      missionType: [this.missionTypes[0]],
      debut: [''],
      source: [''],
    });

    //Initialisation du formulaire de modification d'une annonce
    this.formUpdate = this.formBuilder.group({
      // is_interne:                          [true, Validators.required],
      entreprise_id: [''],
      entreprise_name: [''],
      entreprise_ville: [''],
      entreprise_mail: [''],
      entreprise_phone_indicatif: [''],
      entreprise_phone: [''],
      missionName: [''],
      profil: [this.profilsList[0]],
      competences: [''],
      outils: [''],
      workplaceType: [this.locationOptions[1]],
      missionDesc: [''],
      missionType: [this.missionTypes[0]],
      debut: [''],
      source: [''],
    });

  }

  // recuperation de toute les classes necessaire au fonctionnement du module
  onGetAllClasses(): void {
    //Recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe(
      ((response) => {
        this.userConnected = response;
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des annonces
    this.annonceService.getAnnonces()
      .then((response: Annonce[]) => {
        this.annonces = response;
      })
      .catch((error) => console.log(error));

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach((entreprise) => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
          this.entreprisesWithCEO[entreprise.directeur_id] = entreprise;
        });
      }),
      ((error) => console.log(error))
    );

    //Récupération de la liste des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        this.profiles = response;

        response.forEach((profile: Profile) => {
          this.profilsList.push({ label: profile.libelle, value: profile._id });
        })
      })
      .catch((error) => { console.log(error); });
  }

  //Methode qui servira à modifier le contenu de la liste de competences en fonction du profil
  chargeCompetence(event) {
    // vidage de la table des compétences
    this.competencesList = [];

    const label = event.value.label;
    const id = event.value.value;

    // recuperation de la liste des compétences du profile
    this.skillsService.getCompetenceByProfil(id)
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id });
        })
      })
      .catch((error) => { console.log(error); })

  }


  //Méthode d'ajout d'une mission
  onAddAnnonce(): void {
    const annonce = new Annonce();

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if (this.userConnected.type == 'CEO Entreprise') {
      annonce.entreprise_id = this.entreprisesWithCEO[this.userConnected._id]._id;
      annonce.is_interne = true;
    }
    else if (this.userConnected.type == 'Tuteur') {
      annonce.entreprise_id = this.tuteurs[this.userConnected._id].entreprise_id;
      annonce.is_interne = true;
    }
    else {
      annonce.entreprise_id = this.form.get('entreprise_id')?.value.value;
      annonce.is_interne = this.form.get('is_interne')?.value;
    }


    annonce.user_id = this.token.id;
    annonce.missionType = this.form.get('missionType')?.value.label;
    annonce.debut = this.form.get('debut')?.value;
    annonce.missionName = this.form.get('missionName')?.value;
    annonce.missionDesc = this.form.get('missionDesc')?.value;

    annonce.entreprise_name = this.form.get('entreprise_name')?.value;
    annonce.entreprise_ville = this.form.get('entreprise_ville')?.value;
    annonce.entreprise_mail = this.form.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif = this.form.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone = this.form.get('entreprise_phone')?.value;

    annonce.profil = this.form.get('profil')?.value.value;
    annonce.competences = [];
    annonce.outils = [];
    annonce.workplaceType = this.form.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.form.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    this.form.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source = this.form.get('source')?.value;
    annonce.isClosed = false;

    //Envoi de l'annonce en BD
    this.annonceService.postAnnonce(annonce)
      .then((response) => {
        this.messageService.add({ severity: "success", summary: "L'annonce a été ajouté" })
        this.form.reset();
        this.showForm = false;

        //Recuperation de la liste des classes
        this.onGetAllClasses();
      })
      .catch((error) => { console.log(error); });

  }

  //Méthode de modification d'une annonce
  onUpdateAnnonce(): void {
    const annonce = new Annonce();

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if (this.userConnected.type == 'CEO Entreprise' || this.userConnected.type == 'Tuteur') {
      annonce.entreprise_id = this.annonceSelected.entreprise_id;
    }
    else {
      annonce.entreprise_id = this.formUpdate.get('entreprise_id')?.value.value;
    }

    annonce.is_interne = this.annonceSelected.is_interne;
    annonce._id = this.annonceSelected._id;
    annonce.user_id = this.token.id;
    annonce.missionType = this.formUpdate.get('missionType')?.value.label;
    annonce.debut = this.formUpdate.get('debut')?.value;
    annonce.missionName = this.formUpdate.get('missionName')?.value;
    annonce.missionDesc = this.formUpdate.get('missionDesc')?.value;

    annonce.entreprise_name = this.formUpdate.get('entreprise_name')?.value;
    annonce.entreprise_ville = this.formUpdate.get('entreprise_ville')?.value;
    annonce.entreprise_mail = this.formUpdate.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif = this.formUpdate.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone = this.formUpdate.get('entreprise_phone')?.value;

    annonce.profil = this.formUpdate.get('profil')?.value.value;
    annonce.competences = [];
    annonce.outils = [];
    annonce.workplaceType = this.formUpdate.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.formUpdate.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    this.formUpdate.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source = this.formUpdate.get('source')?.value;
    annonce.isClosed = false;

    //Envoi de l'annonce en BD
    this.annonceService.putAnnonce(annonce)
      .then((response) => {
        this.messageService.add({ severity: "success", summary: "L'annonce a été modifier" })
        this.formUpdate.reset();
        this.showFormUpdate = false;

        //Recuperation de la liste des classes
        this.onGetAllClasses();
      })
      .catch((error) => { console.log(error); });
  }

  // methode de remplissage du formulaire de modification
  onFillForm() {
    this.formUpdate.patchValue({
      is_interne: this.annonceSelected.is_interne,
      // entreprise_id:                this.annonceSelected.entreprise_id,
      entreprise_name: this.annonceSelected.entreprise_name,
      entreprise_ville: this.annonceSelected.entreprise_ville,
      entreprise_mail: this.annonceSelected.entreprise_mail,
      entreprise_phone_indicatif: this.annonceSelected.entreprise_phone_indicatif,
      entreprise_phone: this.annonceSelected.entreprise_phone,
      missionName: this.annonceSelected.missionName,
      // profil:                    { label: this.annonceSelected.profil },
      // competences:               this.annonceSelected.competences,
      workplaceType: { label: this.annonceSelected.workplaceType },
      missionDesc: this.annonceSelected.missionDesc,
      missionType: { label: this.annonceSelected.missionType },
      debut: this.annonceSelected.debut,
      source: this.annonceSelected.source,
    });
  }

  InitMatching(annonce: Annonce) {
    this.router.navigate(['matching', annonce._id])
  }

  InitPostulate(annonce: Annonce) {
    this.CvService.getCvbyUserId(this.token.id).subscribe(cv => {
      if (cv) {
        let matching = {
          offre_id: annonce._id,
          matcher_id: this.token.id,
          cv_id: cv._id,
          type_matching: "MA",
          date_creation: new Date()
        }
        this.MatchingService.create(matching).subscribe(match => {
          this.messageService.add({ summary: "Matching enregistré", severity: "success" })
        })
      } else {
        this.messageService.add({ summary: "Non eligible au matching", severity: "error", detail: "Merci de créer votre cv pour pouvoir être eligible au matching" })
      }
    })
  }


}
