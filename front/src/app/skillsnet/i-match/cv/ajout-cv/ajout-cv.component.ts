import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { AuthService } from 'src/app/services/auth.service';
import { EcoleService } from 'src/app/services/ecole.service';
import * as html2pdf from 'html2pdf.js';
import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { Table } from 'primeng/table';
import { Competence } from 'src/app/models/Competence';
import { from } from 'rxjs';
import { ClasseService } from 'src/app/services/classe.service';
import { Campus } from 'src/app/models/Campus';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Annonce } from 'src/app/models/Annonce';
import { Matching } from 'src/app/models/Matching';
import { sub } from 'date-fns';
import { Profile } from 'src/app/models/Profile';



@Component({
  selector: 'app-ajout-cv',
  templateUrl: './ajout-cv.component.html',
  styleUrls: ['./ajout-cv.component.scss', '../../../../../assets/css/bootstrap.min.css']
})
export class AjoutCvComponent implements OnInit {
  @Input() CV_USER_ID
  @Output() PRINTING = new EventEmitter<any>();
  cv: CV
  ID = this.route.snapshot.paramMap.get('id');
  // partie dedié aux CV
  cvLists: CV[] = [];
  showFormAddCV: boolean = true;
  formAddCV: FormGroup;
  showFormUpdateCV: boolean = false;
  typeContratList = [
    { label: 'Temps plein', value: 'Temps plein' },
    { label: 'Temps partiel', value: 'Temps partiel' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Saisonnière', value: 'Saisonnière' },
    { label: 'Contrat', value: 'Contrat' },
    { label: 'Alternance', value: 'Alternance' },
    { label: 'Stage', value: 'Stage' }
  ]
  languesList: any[] = [
    { label: 'Français' },
    { label: 'Anglais' },
    { label: 'Espagnol' },
    { label: 'Allemand' },
    { label: 'Arabe' },
    { label: 'Italien' },
  ]

  competencesList: any[] = [];

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

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
  ];

  selectedMultiCpt: any[] = [];
  selectedMultiOutils: string[] = [];
  selectedMultilang: { label: string }[] = [];
  locations: any[] = [
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
  ];
  loading: boolean = true;

  users: User[] = [];
  dropdownUserExterne: any[] = [];
  dropdownUserInterne: any[] = [];

  uploadedFiles: any;

  token: any;

  user: User;

  ecoles = []
  groupes = []
  commercials = []

  dicPicture = {}

  ecoleImage = 'espic'

  pdfPreviewSchools = [
    {
      label: "Espic", value: 'espic'
    },
    {
      label: "Studinfo", value: 'studinfo'
    },
    {
      label: "ADG Education", value: 'adg'
    },
    {
      label: "MedaSup", value: 'medasup'
    },
    {
      label: "BTECH", value: 'btech'
    },

  ]

  pdfPreviewChosenSchool = "btech"

  etudes = [
    { label: 'Baccalauréat', value: 'Baccalauréat' },
    { label: 'BTS (Brevet de Technicien Supérieur)', value: 'BTS (Brevet de Technicien Supérieur)' },
    { label: 'Bachelor', value: 'Bachelor' },
    { label: 'Master 1er année', value: 'Master 1er année' },
    { label: 'Master 2ème année', value: 'Master 2ème année' },
  ]


  userName = 'Nom et Prénom'

  @ViewChild('filter') filter: ElementRef;
  isEtudiant = false
  profilsList = []
  profilSelected: Profile
  constructor(private skillsService: SkillsService, private formBuilder: FormBuilder,
    private messageService: MessageService, private cvService: CvService,
    private userService: AuthService, private router: Router, private EcoleService: EcoleService,
    private ClasseService: ClasseService, private EtudiantService: EtudiantService,
    private MatchingService: MatchingService, private AnnonceService: AnnonceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    //Récupération de la liste des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        response.forEach((profile: Profile) => {
          this.profilsList.push({ label: profile.libelle, value: profile });
        })
      })
      .catch((error) => { console.error(error); });
    //Initialisation du formulaire d'ajout de CV
    this.formAddCV = this.formBuilder.group({
      user_id: ['', Validators.required],
      competences: [],
      //outils: [''],
      langues: [],
      //video_lien: [],
      mobilite_lieu: [''],
      centre_interets: [''],
      a_propos: [''],
      disponibilite: [''],
      user_create_type: ['Externe'],
      winner_id: [null],
      isPublic: [true],
      niveau_etude: [''],
      profil: ['']
    });
    this.reader.addEventListener("load", () => {
      this.imgPDP = this.reader.result;
    }, false);
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));
    if (this.CV_USER_ID)
      this.ID = this.CV_USER_ID
    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

    this.userService.getAllCommercialV2().subscribe(users => {
      users.forEach(user => {
        this.commercials.push({ label: `${user.firstname} ${user.lastname}`, value: user._id })
      })
    })
    this.userService.getPopulate(this.token.id).subscribe(user => {
      this.isEtudiant = (user.type == 'Initial' || user.type == 'Alternant' || user.type == 'Prospect' || user.type == 'Externe' || user.type == 'Externe-InProgress' || (user.type == null && user.role == "user"))
      if (this.isEtudiant) {
        this.formAddCV.patchValue({ user_id: this.token.id })
      }
    })
    if (this.ID) {
      this.onGetUserById(this.ID)
      this.cvService.getCvbyUserId(this.ID).subscribe(c => {
        if (c) {
          if (c.profil && c.profil._id) {
            this.profilSelected = c.profil
            this.filterCompetencesList()
          }

          this.onLoadFile(this.ID)
          this.formAddCV.patchValue({ ...c, user_id: c.user_id._id, winner_id: c?.winner_id, disponibilite: new Date(c.disponibilite), user_create_type: 'Externe', profil: c.profil })
          this.pdfPreviewChosenSchool = c.ecole
          this.selectedMultiCpt = []
          c.competences.forEach(val => {
            this.selectedMultiCpt.push({ label: val.libelle, value: val._id, profile: val.profile_id })
          })
          if (c.competences.length == 0)
            this.selectedMultiCpt = ['']
          this.selectedMultilang = []
          c.langues.forEach(val => {
            this.selectedMultilang.push({ label: val })
          })
          this.experiences_pro = c.experiences_pro
          this.education = c.education
          this.experiences_associatif = c.experiences_associatif
          this.informatique = c.informatique
          setTimeout(() => {
            if (c?.user_id?.type?.startsWith('Externe'))
              this.formAddCV.patchValue({ user_create_type: 'Externe' })
            else
              this.formAddCV.patchValue({ user_create_type: 'Interne' })
          }, 1000);
        }
        else
          this.messageService.add({ severity: 'error', summary: 'Pas de CV trouvé à votre nom' })
      })
    }



    this.EcoleService.getAll().subscribe(ecoles => {
      ecoles.forEach(ecole => {
        this.ecoles.push({ label: ecole.libelle, value: ecole._id })
      })
    })

    this.cvService.getAllPicture().subscribe(data => {
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

  }

  onSelectEcole(ecole) {
    this.ClasseService.getAllByEcoleID(ecole).subscribe(classes => {
      this.groupes = []
      classes.forEach(classe => {
        if (classe.abbrv)
          this.groupes.push({ label: classe.abbrv, value: classe._id })
      })
    })
  }

  onSelectGroupe(classe) {
    this.EtudiantService.getAllByClasseId(classe).subscribe(etudiants => {
      this.dropdownUserInterne = []
      etudiants.forEach(etu => {
        let buffer: any = etu.user_id
        let user_temp: User = buffer
        let username = `${user_temp.firstname} ${user_temp.lastname} | ${user_temp.type}`;
        this.dropdownUserInterne.push({ label: username, value: user_temp._id })
      })
    })
  }

  onGetUserById(id) {
    if (id) {
      this.userService.getPopulate(id).subscribe(user => {
        this.user = user
        this.userName = `${user.firstname} ${user.lastname}`
      })
      this.userService.getProfilePicture(id).subscribe((data) => {
        if (data.error) {
          this.imgPDP = null
        } else {
          const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.documentType })
          if (blob) {
            this.imgPDP = null
            this.reader.readAsDataURL(blob);
          }
        }
      })
    }
  }

  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation de la liste des users et remplissage de la dropdown
    this.userService.getAllForCV()
      .then((response: User[]) => {
        this.users = response;

        // remplissage de la dropdown des users pour ajouter le CV
        response.forEach((user: User) => {
          if (user.firstname && user.lastname && user.type) {
            let username = `${user.firstname} ${user.lastname}`;
            if (user.type == 'Externe' || user.type == 'Externe-InProgress')
              this.dropdownUserExterne.push({ label: username, value: user._id });
            else
              this.dropdownUserInterne.push({ label: username, value: user._id });
          }
        })
      })
      .catch(error => console.error(error));

    // recuperation de la liste des compétences
    this.skillsService.getCompetences()
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id, profile: competence.profile_id });
        })
        this.defaultCompetencesList = this.competencesList
        if (this.profilSelected)
          this.filterCompetencesList()
      })
      .catch((error) => { console.error(error); })

  }


  //Traitement des formArray
  pdfSrc: any = ""
  // upload du cv brute
  onUpload(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfSrc = reader.result as string;
      }
      let formData = new FormData();
      let id = this.ID
      if (!id)
        id = this.formAddCV.value.user_id
      formData.append('id', id);
      formData.append('file', this.uploadedFiles);
      this.cvService.postCVBrute(formData)
        .then(() => {
          this.messageService.add({ severity: 'Ajout du CV PDF avec succès' })
        })
        .catch((error) => {
          console.error(error)
        });
      reader.readAsDataURL(event.target.files[0])
    }
  }

  onLoadFile(cv_id) {
    this.cvService.downloadCV(cv_id).then(r => {
      const byteArray = new Uint8Array(atob(r.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: r.extension });
      /*var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);*/
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
      };
      fileReader.readAsArrayBuffer(blob);

    })
  }

  // methode d'ajout du cv
  onAddCV(): void {
    // recuperation des données du formulaire
    const formValue = this.formAddCV.value;
    //création du cv
    let cv = new CV();

    cv.user_id = formValue.user_id;
    cv.experiences_pro = this.experiences_pro
    cv.education = this.education
    cv.experiences_associatif = this.experiences_associatif
    cv.informatique = this.informatique
    cv.createur_id = this.token.id
    cv.disponibilite = new Date(this.formAddCV.value.disponibilite)
    cv.a_propos = this.formAddCV.value.a_propos
    cv.winner_id = this.formAddCV.value.winner_id
    cv.centre_interets = this.formAddCV.value.centre_interets
    cv.mobilite_lieu = this.formAddCV.value.mobilite_lieu
    cv.niveau_etude = this.formAddCV.value.niveau_etude
    cv.competences = [];

    formValue.competences?.forEach(cpt => {
      cv.competences.push(cpt.value);
    });
    formValue.locations?.forEach(loc => {
      cv.mobilite_lieu.push(loc.value);
    })


    /*cv.outils = [];
    formValue.outils?.forEach((outil) => {
      cv.outils.push(outil.label);
    });*/

    cv.langues = [];
    formValue.langues?.forEach(langue => {
      cv.langues.push(langue.label);
    });
    cv.profil = this.formAddCV.value.profil._id

    //cv.video_lien = formValue.video_lien;
    cv.ecole = this.pdfPreviewChosenSchool
    // si un cv brute à été ajouté
    if (this.uploadedFiles) {
      cv.filename = this.uploadedFiles.name;
      let formData = new FormData();
      formData.append('id', cv.user_id);
      formData.append('file', this.uploadedFiles);
      cv.source = 'Interne'
      //ajout du cv
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })

          // envoi du fichier brute
          this.cvService.postCVBrute(formData)
            .then(() => {

            })
            .catch((error) => {
              if (!this.isEtudiant)
                this.formAddCV.reset();
              this.showFormAddCV = false;
              this.onGetAllClasses();
            });
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.error(error);
        });

    } else {
      //ajout du cv

      cv.source = 'Interne'
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })
          if (!this.isEtudiant)
            this.formAddCV.reset();
          this.showFormAddCV = false;
          this.onGetAllClasses();
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.error(error);
        });
    }
  }



  // methode pour vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  //Partie Mis à jour du CV

  showUpdateCV: CV
  formUpdateCV: FormGroup
  canEditWinner = false
  InitUpdateCV(cv) {
    this.formUpdateCV = this.formBuilder.group({
      competences: [],
      //outils: ['', Validators.required],
      langues: [],
      video_lien: [],
      mobilite_lieu: [''],
      mobilite_autre: [''],
      centre_interets: [''],
      a_propos: [''],
      disponibilite: [''],
      winner_id: [''],
    });
    this.showUpdateCV = cv
    if (this.token.role != "Agent" && this.token.role != "user")
      this.canEditWinner = true
    let cv_competences = [];
    cv.competences?.forEach(cpt => {
      this.competencesList.forEach(c => {
        if (c.value == cpt)
          cv_competences.push(c);
      })
    });

    /*let cv_outils = [];
    cv.outils?.forEach((outil) => {
      cv_outils.push({ label: outil });
    });*/

    let cv_langues = [];
    cv.langues?.forEach(langue => {
      cv_langues.push({ label: langue });
    });
    //this.selectedMultiOutils = cv_outils
    this.selectedMultilang = cv_langues
    this.selectedMultiCpt = cv_competences
    if (cv_competences.length == 0)
      this.selectedMultiCpt = ['']
    this.formUpdateCV.patchValue({
      competences: cv_competences,
      //outils: cv_outils,
      langues: cv_langues,
      //video_lien: cv.video_lien
    })
  }

  onUpdateCV() {
    let cv = this.showUpdateCV
    const formValue = this.formUpdateCV.value;

    cv.competences = [];
    formValue.competences?.forEach(cpt => {
      cv.competences.push(cpt.value);
    });

    /*cv.outils = [];
    formValue.outils?.forEach((outil) => {
      cv.outils.push(outil.label);
    });*/

    cv.langues = [];
    formValue.langues?.forEach(langue => {
      cv.langues.push(langue.label);
    });
    //cv.video_lien = formValue.video_lien
    cv.source = 'Interne'
    if (this.profilSelected)
      cv.profil = this.profilSelected
    this.cvService.putCv(cv).then(data => {
      this.cvLists.splice(this.cvLists.indexOf(this.showUpdateCV), 1, cv)
      this.messageService.add({ severity: 'success', summary: "Mis à jour du CV avec succès" })
      this.formUpdateCV.reset();
      this.showUpdateCV = null;
    })
  }

  //Partie Exportation en PDF

  showPDF: CV
  InitExportPDF(cv) {
    this.showPDF = cv
  }

  experiences_pro = []

  addExpPro() {
    this.experiences_pro.push({ intitule_experience: '', type: '', details: '', structure: '', date_debut: '', date_fin: '' })
  }

  deleteExpPro(idx) {
    this.experiences_pro.splice(idx, 1)
  }

  education = []

  addEdu() {
    this.education.push({ intitule_experience: '', type: '', details: '', structure: '', date_debut: '', date_fin: '' })
  }

  deleteEdu(idx) {
    this.education.splice(idx, 1)
  }

  experiences_associatif = []

  addExpAss() {
    this.experiences_associatif.push({ intitule_experience: '', type: '', details: '', structure: '', date_debut: '', date_fin: '' })
  }

  deleteExpAss(idx) {
    this.experiences_associatif.splice(idx, 1)
  }

  informatique = []

  addInf() {
    this.informatique.push({ intitule_experience: '', type: '', details: '', structure: '', date_debut: '', date_fin: '' })
  }

  deleteInf(idx) {
    this.informatique.splice(idx, 1)
  }

  links = []

  addLink() {
    this.links.push({ label: '', lien: "" })
  }

  deleteLink(idx) {
    this.links.splice(idx, 1)
  }

  documents = []

  addDoc() {
    this.documents.push({ label: '', lien: "" })
  }

  deleteDoc(idx) {
    this.documents.splice(idx, 1)
  }

  matchingsFromCV: Matching[] = []
  selectedUser: User

  seeAnnonce(cv: CV) {
    let buffer: any = cv.user_id
    this.selectedUser = buffer
    this.MatchingService.getAllByCVUSERID(buffer._id).subscribe(data => {
      this.matchingsFromCV = data
    })
  }

  selectedCVs = []
  showFormAssignOffer = false
  annoncesList = []

  initAssign() {
    this.AnnonceService.getAnnonces().then((annonces: Annonce[]) => {
      annonces.forEach(annonce => {
        if (annonce)
          this.annoncesList.push({ label: '#' + annonce.custom_id + " " + annonce.missionName + ' de ' + annonce?.entreprise_name + " à " + annonce.source, value: annonce._id, annonce })
      })
    })
  }

  AssignForm = new FormGroup({
    offer: new FormControl()
  })

  onAssignOffer() {
    let type_matching = "Commercial"
    if (this.token.type == "CEO Entreprise" || this.token.type == "Entreprise" || this.token.type == "Tuteur")
      type_matching = "Entreprise"
    else if (this.token.type == "Initial" || this.token.type == "Alternant" || this.token.type == null)
      type_matching = "Candidat"
    this.selectedCVs.forEach((cv: any) => {
      this.MatchingService.create(new Matching(null, this.AssignForm.value.offer, this.token.id, cv._id, "En cours", type_matching, new Date(), null, null, null, true)).subscribe(match => {
        this.messageService.add({ severity: 'success', summary: "Création du Matching avec " + cv.user_id?.lastname + " " + cv.user_id?.firstname })
      }, error => {
        this.messageService.add({ severity: 'error', summary: "Error sur le Matching avec " + cv.user_id?.lastname + " " + cv.user_id?.firstname, detail: error.toString() })
      })
    })
    this.AssignForm.reset()
    this.selectedCVs = []
    this.showFormAssignOffer = false
  }
  visibleSidebar = false
  annonceSelected;
  seeOffre(offer_id) {
    this.visibleSidebar = true;
    this.annonceSelected = offer_id;
  }

  selectedPicture: CV

  updatePicture(cv: CV) {
    document.getElementById('selectedFile').click();
    this.selectedPicture = cv
  }

  onSelectUser(val) {
    this.onGetUserById(val)
    this.cvService.getCvbyUserId(val).subscribe(c => {
      this.cv = c
    })
  }

  FileUploadPC(event: any) {
    if (event && event.target.files.length > 0 && this.selectedPicture) {
      const formData = new FormData();
      //let file: File = event.target.files[0]
      formData.append('id', this.selectedPicture._id)
      formData.append('file', event.target.files[0])
      this.cvService.uploadPicture(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Logo', detail: 'Mise à jour de l\'image avec succès' });
        /*this.SMService.BgetAllLogo().subscribe(data => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            if (this.dicLogo[this.logoBrand._id])
              this.dicLogo[this.logoBrand._id].url = reader.result;
            else {
              this.dicLogo[this.logoBrand._id] = {}
              this.dicLogo[this.logoBrand._id].url = reader.result;
            }
          }
        })*/
      }, (error) => {
        console.error(error)
      })
    }
  }

  onPrint() {
    /*var element = document.getElementById('page-certif');
    var opt = {
      margin: 0,
      filename: 'CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    //html2pdf().set(opt).from(element).save();
    html2pdf().from(element).toPdf().get('pdf').then(function (pdf) {
      window.open(pdf.output('bloburl'), '_blank');
    });*/
    this.PRINTING.emit(true)
    setTimeout(() => {
      window.print()
    }, 5)

  }
  imgPDP;
  reader: FileReader = new FileReader();
  FileUploadPDP(event) {
    console.log(this.formAddCV.value.user_id, event)
    if (event.target.files.length > 0 && this.formAddCV.value.user_id) {
      const formData = new FormData();
      formData.append('id', this.formAddCV.value.user_id)
      formData.append('file', event.target.files[0])

      this.userService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imgPDP = null
        this.reader.readAsDataURL(event.target.files[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
        //this.UserService.reloadImage(this.token.id)
      }, (error) => {
        console.error(error)
      })
    }
  }
  displayAddSkill = false

  refreshSkills() {
    this.competencesList = []
    this.skillsService.getCompetences()
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id, profile: competence.profile_id });
        })
        this.defaultCompetencesList = this.competencesList
        if (this.profilSelected)
          this.filterCompetencesList()
      })
      .catch((error) => { console.error(error); })
  }
  defaultCompetencesList: { label: string, value: string, profile: Profile }[] = []
  filterCompetencesList() {
    this.competencesList = []
    console.log(this.defaultCompetencesList, this.profilSelected)
    this.defaultCompetencesList.forEach(c => {
      if (c.profile._id == this.profilSelected._id) {
        this.competencesList.push(c)
      }
    })
  }
  // labelByValue(array, val) {
  //   for i)
  // }
}
