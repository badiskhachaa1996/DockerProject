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

  users: User[] = [];
  dropdownUser: any[] = [{ libelle: '', value: '' }];

  classes: Classe[] = [];
  dropdownClasse: any[] = [{ libelle: 'Choissisez une classe', value: null }];
  dropdownFiliere: any[] = [];
  dropdownCampus: any[] = [];

  searchClass: any[] = [{ libelle: 'Toutes les groupes', value: null }];

  civiliteList = environment.civilite;
  statutList = environment.profil;
  display: boolean;
  statutDossier = [
    { value: "Document Manquant", label: "Document Manquant" },
    { value: "Paiement non finalisé", label: "Paiement non finalisé" },
    { value: "Dossier Complet", label: "Dossier Complet" },
    { value: "Abandon", label: "Abandon" }
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



  constructor(private entrepriseService: EntrepriseService, private ActiveRoute: ActivatedRoute, private AuthService: AuthService, private classeService: ClasseService, private formBuilder: FormBuilder, private userService: AuthService,
    private etudiantService: EtudiantService, private messageService: MessageService, private router: Router, private CommercialService: CommercialPartenaireService, private tuteurService: TuteurService,
    private diplomeService: DiplomeService, private campusService: CampusService) { }



  code = this.ActiveRoute.snapshot.paramMap.get('code');

  ngOnInit(): void {

    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    //Methode de recuperation de toute les listes
    this.onGetAllClasses();

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
      this.formAddEtudiant.patchValue({ campus_id: this.dropdownCampus[0].value })
    })

    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dropdownFiliere.push({ value: d._id, label: d.titre })
      })
      this.formAddEtudiant.patchValue({ filiere: this.dropdownFiliere[0].value })
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
          this.dropdownClasse.push({ libelle: classe.abbrv, value: classe._id });
          this.classes[classe._id] = classe;
          this.searchClass.push({ libelle: classe.nom, value: classe._id });
        })
        this.formAddEtudiant.patchValue({ classe_id: response[0] })
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode d'initialisation du formulaire d'ajout d'un étudiant
  onInitFormAddEtudiant() {
    this.formAddEtudiant = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      lastname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      indicatif: [''],
      phone: [''],
      email: ['', Validators.email],
      // email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]],
      pays_adresse: [this.paysList[0]],
      ville_adresse: [''],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      classe_id: ['', Validators.required],
      statut: [this.statutList[0], Validators.required],
      nationalite: [this.nationList[0].value, Validators.required],
      date_naissance: [null, Validators.required],
      isAlternant: [false],
      isOnStage: [false],
      ///Form ETUDIANT
      dernier_diplome: [''],
      sos_email: ['', Validators.email],
      sos_phone: ['', Validators.pattern('[- +()0-9]+')],
      numero_INE: [''],
      numero_NIR: ['', Validators.pattern('[0-9]+')],
      isMinor: [false],
      nom_rl: ["", Validators.pattern('[^0-9]+')],
      prenom_rl: ["", Validators.pattern('[^0-9]+')],
      indicatif_rl: ["", Validators.pattern('[- +()0-9]+')],
      phone_rl: ["", Validators.pattern('[- +()0-9]+')],
      email_rl: ["", Validators.email],
      adresse_rl: [""],
      isHandicaped: [false],
      suivi_handicaped: [''],
      
      remarque: [''],
      campus_id: [' '],
      filiere: ['', Validators.required],
      statut_dossier: ['']


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
    let year = dn.getFullYear().toString().substring(2)
    let nb = this.users.length.toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r
  }
  //Methode d'ajout d'un étudiant
  onAddEtudiant() {
    //Recuperation des données du formulaire
    let civilite = this.formAddEtudiant.get('civilite')?.value.value;
    let firstname = this.formAddEtudiant.get('firstname')?.value;
    let lastname = this.formAddEtudiant.get('lastname')?.value;
    let indicatif = this.formAddEtudiant.get('indicatif')?.value;
    let phone = this.formAddEtudiant.get('phone')?.value;
    let email = this.formAddEtudiant.get('email')?.value;
    let pays_adresse = this.formAddEtudiant.get('pays_adresse')?.value;
    let ville_adresse = this.formAddEtudiant.get('ville_adresse')?.value;
    let rue_adresse = this.formAddEtudiant.get('rue_adresse')?.value;
    let numero_adresse = this.formAddEtudiant.get('numero_adresse')?.value;
    let postal_adresse = this.formAddEtudiant.get('postal_adresse')?.value;

    let classe_id = this.formAddEtudiant.get('classe_id')?.value.value;
    let statut = this.formAddEtudiant.get('statut')?.value.value;
    let nationalite = this.formAddEtudiant.get('nationalite')?.value.value
    let date_naissance = this.formAddEtudiant.get('date_naissance')?.value;
    let custom_id = this.generateCode(nationalite, firstname, lastname, date_naissance);
    let isAlternant = this.formAddEtudiant.get('isAlternant')?.value;
    let isOnStage = this.formAddEtudiant.get('isOnStage')?.value;

    let dernier_diplome = this.formAddEtudiant.get('dernier_diplome')?.value;
    let sos_email = this.formAddEtudiant.get('sos_email')?.value;
    let sos_phone = this.formAddEtudiant.get('sos_phone')?.value;
    let numero_INE = this.formAddEtudiant.get('numero_INE')?.value;
    let numero_NIR = this.formAddEtudiant.get('numero_NIR')?.value;
    let nom_rl = this.formAddEtudiant.get('nom_rl')?.value;
    let prenom_rl = this.formAddEtudiant.get('prenom_rl')?.value;
    let indicatif_rl = this.formAddEtudiant.get('indicatif_rl')?.value;
    let phone_rl = this.formAddEtudiant.get('phone_rl')?.value;
    let email_rl = this.formAddEtudiant.get('email_rl')?.value;
    let adresse_rl = this.formAddEtudiant.get('adresse_rl')?.value;

    let isHandicaped = this.formAddEtudiant.get("isHandicaped")?.value;
    let suivi_handicaped = this.formAddEtudiant.get("suivi_handicaped")?.value;

    let campus = this.formAddEtudiant.get("campus_id")?.value;
    let statut_dossier = this.formAddEtudiant.get("statut_dossier")?.value;
    let filiere = this.formAddEtudiant.get("filiere")?.value;



    //Pour la création du nouvel étudiant on crée aussi un user
    let newUser = new User(
      null,
      firstname,
      lastname,
      indicatif,
      phone,
      ' ',
      email,
      '',
      'user',
      null,
      null,
      civilite,
      null,
      null,
      null,
      '',
      pays_adresse.value,
      ville_adresse,
      rue_adresse,
      numero_adresse,
      postal_adresse);

    //creation et envoi de user et étudiant 
    let newEtudiant = new Etudiant(
      null,
      '',
      classe_id,
      statut,
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
      null,
      this.formAddEtudiant.get('remarque').value,
      isOnStage,
      null,
      null,
      null,
      campus,//campus
      statut_dossier,//StatutDossier
      filiere,//filiere
      false);

    this.etudiantService.create({ 'newEtudiant': newEtudiant, 'newUser': newUser }).subscribe(
      ((response) => {
        console.log(response.data)
        this.messageService.add({ severity: 'success', summary: 'Etudiant ajouté' });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses();
  
        this.showFormAddEtudiant = false;
        this.resetAddEtudiant();
    
   
      })
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
