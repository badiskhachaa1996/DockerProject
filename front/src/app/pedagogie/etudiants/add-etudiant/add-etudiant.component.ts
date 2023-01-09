import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Classe } from 'src/app/models/Classe';
import { Entreprise } from 'src/app/models/Entreprise';
import { Etudiant } from 'src/app/models/Etudiant';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ClasseService } from 'src/app/services/classe.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { ActivatedRoute, Router } from '@angular/router';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { Ecole } from 'src/app/models/Ecole';

import { Diplome } from 'src/app/models/Diplome';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { EcoleService } from 'src/app/services/ecole.service';


@Component({
  selector: 'app-add-etudiant',
  templateUrl: './add-etudiant.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-etudiant.component.scss']
})
export class AddEtudiantComponent implements OnInit {

  formAddEtudiant: FormGroup;
  showFormAddEtudiant: boolean = false;

  formUpdateEtudiant: FormGroup;
  showFormUpdateEtudiant: boolean = false;

  nationList = environment.nationalites;
  paysList = environment.pays;
  fr = environment.fr;
  maxYear = new Date().getFullYear() - 16;
  minYear = new Date().getFullYear() - 80;
  rangeYear = this.minYear + ":" + this.maxYear;

  users: Etudiant[] = [];
  dropdownUser: any[] = [{ libelle: '', value: '' }];

  classes: Classe[] = [];
  dropdownClasse: any[] = [];
  dropdownFiliere: any[] = [];
  dropdownCampus: any[] = [];

  searchClass: any[] = [{ libelle: 'Toutes les groupes', value: null }];

  civiliteList = [
    { value: 'Monsieur', label: 'Monsieur' },
    { value: 'Madame', label: 'Madame' },
    { value: 'Autre', label: 'Autre' },
  ];
  statutList = [{ value: 'Alternant', label: "Alternant" }, { value: 'Initial', label: "Initial" }];
  display: boolean;
  statutDossier = [
    { value: "Document Manquant", label: "Document Manquant" },
    { value: "Paiement non finalisé", label: "Paiement non finalisé" },
    { value: "Paiement finalisé", label: "Paiement finalisé" },
    { value: "Dossier Complet", label: "Dossier Complet" },
    { value: "Abandon", label: "Abandon" }
  ]

  dropdownAnneeScolaire = [
    { value: "2020-2021", label: "2020-2021" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" }
  ]
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  dropdownRole: any[] = [
    { libelle: "Utilisateur", value: "user" },
    { libelle: "Agent", value: "Agent" }
  ];
  token;
  uploadUser: Etudiant = null;
  imageToShow: any = "../assets/images/avatar.PNG"
  ListDocuments = []
  showUploadFile;
  parcoursList = []
  isMinor = false;
  formationList = []
  defaultClasse: Classe;
  entrepriseList = []

  dropdownEcole = []

  dropdownPaiement = [
    { label: "Aucun", value: "Aucun" },
    { label: "Alternant", value: "Alternant" },
    { label: "Chèques de scolarité", value: "Chèques de scolarité" },
    { label: "Partiel", value: "Partiel" },
    { label: "Total payé", value: "Total payé" },
    { label: "Exonéré", value: "Exonéré" },
  ]

  dropdownSrcEtudiant = [
    { label: "Etudiant International", value: "Etudiant International" },
    { label: "Réinscription", value: "Réinscription" },
    { label: "Nouvelle inscription - Etudiant Local", value: "Nouvelle inscription - Etudiant Local" },
  ]

  etatContract = [
    { label: "En attente d'information", value: "En attente d'information" },
    { label: "Contrat Etabli", value: "Contrat Etabli" },
    { label: "Contrat Signé", value: "Contrat Signé" },
    { label: "Contrat déposé à OPCO", value: "Contrat déposé à OPCO" },
    { label: "Contrat validé à facturation", value: "Contrat validé à facturation" },
  ]



  constructor(private entrepriseService: EntrepriseService, private ActiveRoute: ActivatedRoute, private AuthService: AuthService, private classeService: ClasseService, private formBuilder: FormBuilder, private userService: AuthService,
    private etudiantService: EtudiantService, private messageService: MessageService, private router: Router, private CommercialService: CommercialPartenaireService, private tuteurService: TuteurService,
    private diplomeService: DiplomeService, private campusService: CampusService, private EcoleService: EcoleService) { }



  code = this.ActiveRoute.snapshot.paramMap.get('code');

  ngOnInit(): void {

    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    //Methode de recuperation de toute les listes
    this.onGetAllClasses();
    this.EcoleService.getAll().subscribe(data => {
      data.forEach(e => {
        this.dropdownEcole.push({ value: e._id, label: e.libelle })
      })
    })
    this.diplomeService.getAll().subscribe(data => {

      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
      });

    })


    this.campusService.getAllPopulate().subscribe(data => {
      data.forEach(c => {
        let e: any = c.ecole_id
        let n = e.libelle + " - " + c.libelle
        this.dropdownCampus.push({ value: c._id, label: n })
      })
    })

    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dropdownFiliere.push({ value: d._id, label: d.titre })
      })
    })

    this.etudiantService.getAll().subscribe(u => {
      this.users = u
    })

    this.entrepriseService.getAll().subscribe(entreprises => {
      entreprises.forEach(ent => {
        this.entrepriseList.push({ label: ent.r_sociale, value: ent._id })
      })
    })

    //Initialisation du formulaire d'ajout et de modification d'un etudiant
    this.onInitFormAddEtudiant();

  }

  //Methode de recuperation des differentes classes
  onGetAllClasses() {

    this.dropdownUser = [];
    this.dropdownClasse = [];
    this.searchClass = [{ libelle: 'Toutes les groupes', value: null }];

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ label: classe.abbrv, value: classe._id });
          this.classes[classe._id] = classe;
          this.searchClass.push({ libelle: classe.abbrv, value: classe._id });
        })
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode d'initialisation du formulaire d'ajout d'un étudiant
  onInitFormAddEtudiant() {
    this.formAddEtudiant = this.formBuilder.group({
      civilite: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      lastname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      date_naissance: [null, Validators.required],
      pays_origine: [this.paysList[0], Validators.required],
      nationalite: [this.nationList[0].value, Validators.required],
      indicatif: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      email: ['', [Validators.email, Validators.required]],
      email_ims: ['', Validators.email],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      ville_adresse: [''],
      pays_adresse: [''],
      sos_email: ['', Validators.email],
      sos_phone: ['', Validators.pattern('[- +()0-9]+')],
      isHandicaped: [false],

      campus_id: ['', Validators.required],
      filiere: ['', Validators.required],
      classe_id: ['', Validators.required],
      annee_scolaire: [[], Validators.required],
      numero_INE: [''],
      numero_NIR: ['', Validators.pattern('[0-9]+')],

      isAlternant: [false],
      isOnStage: [false],
      etat_contract: [''],
      entreprise: [''],

      etat_paiement: [''],
      source: [''],

      dernier_diplome: [''],
      //this.parcousList
      remarque: [''],
      isMinor: [false],
      nom_rl: ["", Validators.pattern('[^0-9]+')],
      prenom_rl: ["", Validators.pattern('[^0-9]+')],
      indicatif_rl: ["", Validators.pattern('[- +()0-9]+')],
      phone_rl: ["", Validators.pattern('[- +()0-9]+')],
      email_rl: ["", Validators.email],
      adresse_rl: [""],
      suivi_handicaped: [''],
      statut_dossier: [''],
      ecole: ['', Validators.required]
    });
  }

  resetAddEtudiant() {
    this.onInitFormAddEtudiant()
  }

  //pour la partie de traitement des erreurs sur le formulaire
  get firstname() { return this.formAddEtudiant.get('firstname'); };
  get lastname() { return this.formAddEtudiant.get('lastname'); };
  get indicatif() { return this.formAddEtudiant.get('indicatif'); };
  get phone() { return this.formAddEtudiant.get('phone'); };
  get email() { return this.formAddEtudiant.get('email'); };
  get pays_adresse() { return this.formAddEtudiant.get('pays_adresse'); };
  get ville_adresse() { return this.formAddEtudiant.get('ville_adresse'); };
  get rue_adresse() { return this.formAddEtudiant.get('rue_adresse'); };
  get nationalite() { return this.formAddEtudiant.get('nationalite').value; };
  get date_naissance() { return this.formAddEtudiant.get('date_naissance'); };


  generateCode(nationalite, firstname, lastname, date_naissance) {
    let code_pays = nationalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[nationalite] && code[nationalite] != undefined) {
        code_pays = code[nationalite]
      }
    })
    let prenom = firstname.substring(0, 1)
    let nom = lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getUTCFullYear().toString().slice(-2)
    let lengUser = this.users.length
    while (lengUser > 1000)
      lengUser - 1000
    let nb = (lengUser).toString()
    if (lengUser < 10)
      nb = "00" + nb
    if (9 < lengUser && lengUser < 100)
      nb = "0" + nb
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r
  }
  //Methode d'ajout d'un étudiant
  onAddEtudiant() {
    //Recuperation des données du formulaire
    let civilite = this.formAddEtudiant.get('civilite')?.value;
    let firstname = this.formAddEtudiant.get('firstname')?.value;
    let lastname = this.formAddEtudiant.get('lastname')?.value;
    let date_naissance = this.formAddEtudiant.get('date_naissance')?.value;
    let pays_origine = this.formAddEtudiant.get('pays_origine')?.value.value;
    let nationalite = this.formAddEtudiant.get('nationalite')?.value.value
    let indicatif = this.formAddEtudiant.get('indicatif')?.value;
    let phone = this.formAddEtudiant.get('phone')?.value;
    let email = this.formAddEtudiant.get('email')?.value;
    let email_ims = this.formAddEtudiant.get('email_ims')?.value;
    let rue_adresse = this.formAddEtudiant.get('rue_adresse')?.value;
    let numero_adresse = this.formAddEtudiant.get('numero_adresse')?.value;
    let postal_adresse = this.formAddEtudiant.get('postal_adresse')?.value;
    let ville_adresse = this.formAddEtudiant.get('ville_adresse')?.value;
    let pays_adresse = this.formAddEtudiant.get('pays_adresse')?.value.value;
    let sos_email = this.formAddEtudiant.get('sos_email')?.value;
    let sos_phone = this.formAddEtudiant.get('sos_phone')?.value;
    let isHandicaped = this.formAddEtudiant.get("isHandicaped")?.value;

    let campus = this.formAddEtudiant.get("campus_id")?.value;
    let filiere = this.formAddEtudiant.get("filiere")?.value;
    let classe_id = this.formAddEtudiant.get('classe_id')?.value;
    let annee_scolaire = this.formAddEtudiant.get("annee_scolaire")?.value;
    let numero_INE = this.formAddEtudiant.get('numero_INE')?.value;
    let numero_NIR = this.formAddEtudiant.get('numero_NIR')?.value;

    let isAlternant = this.formAddEtudiant.get('isAlternant')?.value;
    let isOnStage = this.formAddEtudiant.get('isOnStage')?.value;
    let etat_contract = this.formAddEtudiant.get('etat_contract')?.value;
    let entreprise = this.formAddEtudiant.get('entreprise')?.value;

    let etat_paiement = this.formAddEtudiant.get('etat_paiement')?.value;
    let source = this.formAddEtudiant.get('source')?.value;

    let dernier_diplome = this.formAddEtudiant.get('dernier_diplome')?.value;
    let parcoursList = this.parcoursList
    let remarque = this.formAddEtudiant.get('remarque').value
    let nom_rl = this.formAddEtudiant.get('nom_rl')?.value;
    let prenom_rl = this.formAddEtudiant.get('prenom_rl')?.value;
    let indicatif_rl = this.formAddEtudiant.get('indicatif_rl')?.value;
    let phone_rl = this.formAddEtudiant.get('phone_rl')?.value;
    let email_rl = this.formAddEtudiant.get('email_rl')?.value;
    let adresse_rl = this.formAddEtudiant.get('adresse_rl')?.value;
    let suivi_handicaped = this.formAddEtudiant.get("suivi_handicaped")?.value;
    let statut_dossier = this.formAddEtudiant.get("statut_dossier")?.value;

    let custom_id = this.generateCode(nationalite, firstname, lastname, date_naissance);
    let valided_by_support = (email_ims != null && email_ims != '' && email_ims.length > 1)
    if (!valided_by_support)
      email_ims = email
    //Pour la création du nouvel étudiant on crée aussi un user
    let newUser = new User(
      null,
      firstname,
      lastname,
      indicatif,
      phone,
      email_ims,
      email,
      null,
      'user',
      null,
      null,
      civilite,
      null,
      null,
      null,
      '',
      pays_adresse,
      ville_adresse,
      rue_adresse,
      numero_adresse,
      postal_adresse,
      nationalite,
      true,
      new Date()
    );

    //creation et envoi de user et étudiant 
    let newEtudiant = new Etudiant(
      null,
      null,
      classe_id,
      null,
      nationalite,
      date_naissance,
      null,
      null,
      null,
      null,
      custom_id,
      numero_INE,
      numero_NIR,
      sos_email,
      sos_phone,
      nom_rl,
      prenom_rl,
      indicatif_rl + " " + phone_rl,
      email_rl,
      adresse_rl,
      dernier_diplome,
      isAlternant,
      isHandicaped,
      suivi_handicaped,
      null,
      parcoursList,
      remarque,
      isOnStage,
      null,
      null, true,
      null,
      campus,
      statut_dossier,
      filiere,
      true,
      valided_by_support,
      annee_scolaire,
      null,
      null,
      pays_origine,
      etat_contract,
      entreprise,
      etat_paiement,
      source,
      new Date(),
      this.formAddEtudiant.value.ecole
    );

    this.etudiantService.create({ 'newEtudiant': newEtudiant, 'newUser': newUser }).subscribe(
      ((response) => {
        console.log(response.data)
        this.messageService.add({ severity: 'success', summary: 'Etudiant ajouté' });
        this.router.navigate(['etudiants']);


      }), error => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Etudiant n\'a pas été ajouté', detail: error.error.error });
      }
    )

  }

  isMinorFC() {
    // console.log("IW AS HERE")
    var today = new Date();
    var birthDate = new Date(this.formAddEtudiant.value.date_naissance);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // console.log(age)
    return age < 18;

  }

  clickFile(rowData) {
    this.uploadUser = rowData
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    if (event && event.length > 0 && this.uploadUser != null) {
      const formData = new FormData();
      formData.append('id', this.uploadUser.user_id)
      formData.append('file', event[0])
      this.AuthService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de la photo de profil avec succès' });
        this.AuthService.reloadImage(this.uploadUser.user_id)
        this.uploadUser = null
      }, (error) => {
        console.error(error)
      })
    }
  }

  loadPP(rowData) {
    this.imageToShow = "../assets/images/avatar.PNG"
    this.AuthService.getProfilePicture(rowData.user_id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        let reader: FileReader = new FileReader();
        reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
        }, false);
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          reader.readAsDataURL(blob);
        }
      }

    })
    this.etudiantService.getFiles(rowData?._id).subscribe(
      (data) => {
        this.ListDocuments = data
      },
      (error) => { console.error(error) }
    );
  }

  downloadFile(id, i) {
    this.messageService.add({ severity: 'success', summary: 'Téléchargement du Fichier', detail: 'Le fichier est entrain d\'être téléchargé' });
    this.etudiantService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), this.ListDocuments[i])
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })

  }

  deleteFile(id, i) {
    if (confirm("Voulez-vous vraiment supprimer le fichier " + this.ListDocuments[i] + " ?")) {
      this.etudiantService.deleteFile(id, this.ListDocuments[i]).subscribe((data) => {
        this.messageService.add({ severity: "success", summary: "Le fichier a bien été supprimé" })
        this.ListDocuments.splice(i, 1)
      }, (error) => {
        this.messageService.add({ severity: "error", summary: "Le fichier n'a pas pu être supprimé", detail: error })
        console.error(error)
      })
    }
  }

  FileUpload(event) {
    if (event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.showUploadFile._id)
      formData.append('file', event.files[0])
      this.etudiantService.uploadFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.loadPP(this.showUploadFile)
        event.target = null;
        this.showUploadFile = null;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  onAddParcours() {
    this.parcoursList.push({ diplome: "", date: new Date() })
  }

  onChangeParcours(i, event, type) {
    console.log(event.target.value)
    if (type == "date") {
      this.parcoursList[i][type] = new Date(event.target.value);
    } else {
      this.parcoursList[i][type] = event.target.value;
    }
  }

  onRemoveParcours(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le parcours ?")) {
      this.parcoursList.splice(i)
    }
  }

}
