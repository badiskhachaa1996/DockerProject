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
  annoncesFiltered: Annonce[] = [];

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
      //outils: [''],
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
      //outils: [''],
      workplaceType: [this.locationOptions[1]],
      missionDesc: [''],
      missionType: [this.missionTypes[0]],
      debut: [''],
      source: [''],
    });

  }
  dicPicture = {}
  dicOffreNB = {}
  // recuperation de toute les classes necessaire au fonctionnement du module
  onGetAllClasses(): void {
    //Recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe(
      ((response) => {
        this.userConnected = response;
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des annonces
    this.annonceService.getAnnonces()
      .then((response: Annonce[]) => {
        this.annonces = response;
        this.annoncesFiltered = response
        let agent_id = []
        response.forEach(annonce => {
          this.MatchingService.getAllByOffreID(annonce._id).subscribe(matchs => {
            let t = []
            matchs.forEach(m => { if (m.type_matching != 'Entreprise') t.push(m) })
            this.dicOffreNB[annonce._id] = t.length
          })
          if (annonce && annonce.user_id) {
            let temp = { label: `${annonce.user_id.firstname} ${annonce.user_id.lastname}`, value: annonce.user_id._id }
            if (!agent_id.includes(annonce.user_id._id)) {
              this.userFilter.push(temp)
              agent_id.push(annonce.user_id._id)
            }

          }

        })

      })
      .catch((error) => console.error(error));

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach((entreprise) => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entrepriseFilter.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
          this.entreprisesWithCEO[entreprise.directeur_id] = entreprise;
        });
      }),
      ((error) => console.error(error))
    );

    this.entrepriseService.getAllLogo().subscribe(data => {
      this.dicPicture = data.files // {id:{ file: string, extension: string }}
      data.ids.forEach(id => {
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.dicPicture[id].url = reader.result;
        }
      })
    })

    //Récupération de la liste des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        this.profiles = response;

        response.forEach((profile: Profile) => {
          this.profilsList.push({ label: profile.libelle, value: profile._id });
          this.profilFilter.push({ label: profile.libelle, value: profile._id });
        })
      })
      .catch((error) => { console.error(error); });
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
        if (this.annonceSelected) {
          let competences = []
          this.annonceSelected.competences.forEach(element => {
            let buffer: any = element
            competences.push({ label: buffer.libelle, value: buffer._id })
          });
          this.formUpdate.patchValue({ competences: competences })
        }
      })
      .catch((error) => { console.error(error); })

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
    //annonce.outils = [];
    annonce.workplaceType = this.form.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.form.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    /*this.form.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });*/

    annonce.source = this.form.get('source')?.value;
    annonce.isClosed = false;
    annonce.custom_id = this.onGenerateID(this.form.get('profil')?.value.label, this.form.get('missionType').value)

    //Envoi de l'annonce en BD
    this.annonceService.postAnnonce(annonce)
      .then((response) => {
        this.messageService.add({ severity: "success", summary: "L'annonce a été ajouté" })
        this.form.reset();
        this.showForm = false;

        //Recuperation de la liste des classes
        this.onGetAllClasses();
      })
      .catch((error) => { console.error(error); });

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
    //annonce.outils = [];
    annonce.workplaceType = this.formUpdate.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.formUpdate.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    /*this.formUpdate.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });*/

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
      .catch((error) => { console.error(error); });
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
    let profile: any = this.annonceSelected.profil
    this.formUpdate.patchValue({ profil: { label: profile.libelle, value: profile._id } })
    this.chargeCompetence({ value: { label: profile.libelle, value: profile._id } })
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

  onGenerateID(profilLabel, contrat) {
    let label = profilLabel.replace(/[^A-Z]+/g, "");
    if (label == '')
      label = "UNK"
    let cont = "OC"
    if (contrat == "Alternance")
      cont = "OA"
    else if (contrat == "Stage")
      cont = "OS"
    let random = Math.random().toString(36).substring(5).toUpperCase();
    return label + cont + random
  }

  statutFilter = [
    { label: "Choisissez un statut", value: null },
    { label: "Active (offre d'emploi est actuellement ouverte aux candidatures)", value: "Active" },
    { label: 'Clôturée', value: "Clôturée" },
  ]
  typeMissionFilter = [
    { label: "Choisissez un type de mission", value: null },
    { label: 'Stage', value: 'Stage' },
    { label: 'Alternance', value: 'Alternance' },
    { label: 'Professionnalisation', value: 'Professionnalisation' },
    { label: 'CDD', value: 'CDD' },
    { label: 'CDI', value: 'CDI' }
  ]
  profilFilter = [
    //{ label: "Choisissez un profil", value: null },
  ]
  entrepriseFilter = [
    { label: "Choisissez une entreprise", value: null },
  ]
  locations = [
    //{ label: "Choisissez une ville", value: null },
    { label: "100% Télétravail", value: "100% Télétravail" },
    { label: "Aix-Marseille", value: "Aix-Marseille" },
    { label: "Amiens", value: "Amiens" },
    { label: "Angers", value: "Angers" },
    { label: "Annecy", value: "Annecy" },
    { label: "Auxerre", value: "Auxerre" },
    { label: "Avignon", value: "Avignon" },
    { label: "Bayonne", value: "Bayonne" },
    { label: "Bergerac", value: "Bergerac" },
    { label: "Besançon", value: "Besançon" },
    { label: "Biarritz", value: "Biarritz" },
    { label: "Bordeaux", value: "Bordeaux" },
    { label: "Boulogne-sur-mer", value: "Boulogne-sur-mer" },
    { label: "Brest", value: "Brest" },
    { label: "Caen", value: "Caen" },
    { label: "Calais", value: "Calais" },
    { label: "Cannes", value: "Cannes" },
    { label: "Chambéry", value: "Chambéry" },
    { label: "Clermont-Ferrand", value: "Clermont-Ferrand" },
    { label: "Dijon", value: "Dijon" },
    { label: "France", value: "France" },
    { label: "Grenoble", value: "Grenoble" },
    { label: "La Réunion", value: "La Réunion" },
    { label: "La Roche sur Yon", value: "La Roche sur Yon" },
    { label: "La Rochelle", value: "La Rochelle" },
    { label: "Le Havre", value: "Le Havre" },
    { label: "Le Mans", value: "Le Mans" },
    { label: "Lille", value: "Lille" },
    { label: "Limoges", value: "Limoges" },
    { label: "Lyon", value: "Lyon" },
    { label: "Mâcon", value: "Mâcon" },
    { label: "Metz", value: "Metz" },
    { label: "Montauban", value: "Montauban" },
    { label: "Montpellier", value: "Montpellier" },
    { label: "Mulhouse", value: "Mulhouse" },
    { label: "Nancy", value: "Nancy" },
    { label: "Nantes", value: "Nantes" },
    { label: "Nice", value: "Nice" },
    { label: "Nîmes", value: "Nîmes" },
    { label: "Niort", value: "Niort" },
    { label: "Orléans", value: "Orléans" },
    { label: "Oyonnax", value: "Oyonnax" },
    { label: "Paris/Ile de France", value: "Paris/Ile de France" },
    { label: "Pau", value: "Pau" },
    { label: "Perpignan", value: "Perpignan" },
    { label: "Poitiers", value: "Poitiers" },
    { label: "Reims", value: "Reims" },
    { label: "Rennes", value: "Rennes" },
    { label: "Rodez", value: "Rodez" },
    { label: "Rouen", value: "Rouen" },
    { label: "Saint-Etienne", value: "Saint-Etienne" },
    { label: "Saint-Tropez", value: "Saint-Tropez" },
    { label: "Strasbourg", value: "Strasbourg" },
    { label: "Toulon", value: "Toulon" },
    { label: "Toulouse", value: "Toulouse" },
    { label: "Troyes", value: "Troyes" },
    { label: "Valence", value: "Valence" },
    { label: "Guadeloupe", value: "Guadeloupe" },
  ]

  userFilter = [
    { label: "Choisissez la personne qui a crée l'offre", value: null }
  ]

  filter_value = {
    statut: "",
    typeMission: "",
    profil: [],
    entreprise: '',
    locations: [],
    user: '',
    date: '',
    search: ''
  }

  updateFilter() {
    this.annoncesFiltered = []
    console.log(this.filter_value)
    this.annonces.forEach(val => {
      let r = true
      if (this.filter_value.statut && this.filter_value.statut != val.statut)
        r = false
      else if (this.filter_value.typeMission && this.filter_value.typeMission != val.missionType)
        r = false
      else if (this.filter_value.profil.length != 0 && (!val.profil || !this.filter_value.profil.includes(val.profil._id)))
        r = false
      else if (this.filter_value.entreprise && this.filter_value.entreprise != val.entreprise_id._id)
        r = false
      else if (this.filter_value.locations.length != 0 && (!val.entreprise_ville || !this.filter_value.locations.includes(val.entreprise_ville)))
        r = false
      else if (this.filter_value.user && this.filter_value.user != val.user_id._id)
        r = false
      else if (this.filter_value.date && new Date(this.filter_value.date).getTime() > new Date(val.debut).getTime())
        r = false, console.log("date")
      else if (this.filter_value.search) {
        if (!val.custom_id.includes(this.filter_value.search) &&
          !val.entreprise_name.includes(this.filter_value.search) &&
          !val.missionDesc.includes(this.filter_value.search) &&
          !val.missionName.includes(this.filter_value.search) &&
          !val.entreprise_mail.includes(this.filter_value.search))
          r = false
      }

      if (r)
        this.annoncesFiltered.push(val)
    })

  }

  clearFilter() {
    this.filter_value = {
      statut: "",
      typeMission: "",
      profil: [],
      entreprise: '',
      locations: [],
      user: '',
      date: '',
      search: ''
    }
    this.annoncesFiltered = this.annonces
  }


}
