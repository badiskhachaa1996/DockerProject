import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { AuthService } from 'src/app/services/auth.service';
import { EcoleService } from 'src/app/services/ecole.service';
import * as html2pdf from 'html2pdf.js';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { Router } from '@angular/router';
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



@Component({
  selector: 'app-ajout-cv',
  templateUrl: './ajout-cv.component.html',
  styleUrls: ['./ajout-cv.component.scss', '../../../../../assets/css/bootstrap.min.css']
})
export class AjoutCvComponent implements OnInit {
  cv: CV
  // partie dedié aux CV
  cvLists: CV[] = [];
  showFormAddCV: boolean = true;
  formAddCV: FormGroup;
  showFormUpdateCV: boolean = false;
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

  selectedMultiCpt: string[] = [];
  selectedMultiOutils: string[] = [];
  selectedMultilang: string[] = [];
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

  @ViewChild('filter') filter: ElementRef;


  constructor(private skillsService: SkillsService, private formBuilder: FormBuilder,
    private messageService: MessageService, private cvService: CvService,
    private userService: AuthService, private router: Router, private EcoleService: EcoleService,
    private ClasseService: ClasseService, private EtudiantService: EtudiantService,
    private MatchingService: MatchingService, private AnnonceService: AnnonceService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

    this.userService.getAllCommercialV2().subscribe(users => {
      users.forEach(user => {
        this.commercials.push({ label: `${user.firstname} ${user.lastname}`, value: user._id })
      })
    })

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
      winner_id: [''],
    });

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
        return this.user = user
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
            let username = `${user.firstname} ${user.lastname} | ${user.type}`;
            if (user.type == 'Externe' || user.type == 'Externe-InProgress')
              this.dropdownUserExterne.push({ label: username, value: user._id });
            else
              this.dropdownUserInterne.push({ label: username, value: user._id });
          }
        })
      })
      .catch(error => console.log(error));

    // recuperation de la liste des compétences
    this.skillsService.getCompetences()
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id, profile: competence.profile_id });
        })
      })
      .catch((error) => { console.log(error); })

  }


  //Traitement des formArray

  // upload du cv brute
  onUpload(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
    }
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


    //cv.video_lien = formValue.video_lien;

    // si un cv brute à été ajouté
    if (this.uploadedFiles) {
      cv.filename = this.uploadedFiles.name;
      let formData = new FormData();
      formData.append('id', cv.user_id);
      formData.append('file', this.uploadedFiles);

      //ajout du cv
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })

          // envoi du fichier brute
          this.cvService.postCVBrute(formData)
            .then(() => {

            })
            .catch((error) => {
              this.formAddCV.reset();
              this.showFormAddCV = false;
              this.onGetAllClasses();
            });
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.log(error);
        });

    } else {
      //ajout du cv
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })
          this.formAddCV.reset();
          this.showFormAddCV = false;
          this.onGetAllClasses();
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.log(error);
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
    this.selectedCVs.forEach((cv: any) => {
      this.MatchingService.create(new Matching(null, this.AssignForm.value.offer, this.token.id, cv._id, "En Cours", "Etudiant", new Date())).subscribe(match => {
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
      console.log(c)
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
    window.print()
  }
}