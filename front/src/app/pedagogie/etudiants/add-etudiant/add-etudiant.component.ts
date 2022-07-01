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

@Component({
  selector: 'app-add-etudiant',
  templateUrl: './add-etudiant.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-etudiant.component.scss']
})
export class AddEtudiantComponent implements OnInit {

  etudiants: Etudiant[] = [];

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
  searchClass: any[] = [{ libelle: 'Toutes les classes', value: null }];

  civiliteList = environment.civilite;
  statutList = environment.profil;
  display: boolean;

  entreprises: Entreprise[] = [];
  dropdownEntreprise: any[] = [{ libelle: '', value: '' }];

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

  isMinor = false;

  constructor(private entrepriseService: EntrepriseService, private ActiveRoute: ActivatedRoute, private AuthService: AuthService, private classeService: ClasseService, private formBuilder: FormBuilder, private userService: AuthService, private etudiantService: EtudiantService, private messageService: MessageService, private router: Router) { }

  code = this.ActiveRoute.snapshot.paramMap.get('code');

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
    //Methode de recuperation de toute les listes
    this.onGetAllClasses();

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach(entreprise => {
          this.dropdownEntreprise.push({ libelle: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
        })
      }),
      ((error) => { console.error(error); })
    );

    //Initialisation du formulaire d'ajout et de modification d'un etudiant
    this.onInitFormAddEtudiant();

  }


  //Methode de recuperation des differentes classes
  onGetAllClasses() {

    this.dropdownUser = [];
    this.dropdownClasse = [];
    this.searchClass = [{ libelle: 'Toutes les classes', value: null }];

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.nom, value: classe._id });
          this.classes[classe._id] = classe;
          this.searchClass.push({ libelle: classe.nom, value: classe._id });
        })
        this.formAddEtudiant.patchValue({ classe_id: response[0] })
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des étudiants
    this.AuthService.WhatTheRole(this.token.id).subscribe(data => {
      if (!this.code && data.type == "Partenaire") {
        this.code = data.data.code_partenaire
      }
      if (this.code) {
        this.etudiantService.getAllByCode(this.code).subscribe(
          ((responseEtu) => {
            this.etudiants = [];
            //Recuperation de la liste des users
            this.userService.getAll().subscribe(
              ((response) => {
                response.forEach(user => {
                  this.dropdownUser.push({ libelle: user.lastname + ' ' + user.firstname, value: user._id });
                  this.users[user._id] = user;
                })
                responseEtu.forEach(etu => {
                  if (this.users[etu.user_id] && this.users[etu.user_id].lastname)
                    etu.lastname = this.users[etu.user_id].lastname
                  if (this.users[etu.user_id] && this.users[etu.user_id].firstname)
                    etu.firstname = this.users[etu.user_id].firstname
                  this.etudiants.push(etu)
                })
              }),
              ((error) => { console.error(error); })
            );
          }),
          ((error) => { console.error(error); })
        );
      } else {
        this.etudiantService.getAll().subscribe(
          ((responseEtu) => {
            this.etudiants = [];
            //Recuperation de la liste des users
            this.userService.getAll().subscribe(
              ((response) => {
                response.forEach(user => {
                  this.dropdownUser.push({ libelle: user.lastname + ' ' + user.firstname, value: user._id });
                  this.users[user._id] = user;
                })
                responseEtu.forEach(etu => {
                  if (this.users[etu.user_id] && this.users[etu.user_id].lastname)
                    etu.lastname = this.users[etu.user_id].lastname
                  if (this.users[etu.user_id] && this.users[etu.user_id].firstname)
                    etu.firstname = this.users[etu.user_id].firstname
                  this.etudiants.push(etu)
                })
              }),
              ((error) => { console.error(error); })
            );
          }),
          ((error) => { console.error(error); })
        );
      }
    });
  }

  //Methode d'initialisation du formulaire d'ajout d'un étudiant
  onInitFormAddEtudiant() {
    this.formAddEtudiant = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      lastname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      indicatif: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]],
      pays_adresse: [this.paysList[0], [Validators.required]],
      ville_adresse: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      rue_adresse: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      numero_adresse: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      postal_adresse: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      classe_id: ['', Validators.required],
      statut: [this.statutList[0], Validators.required],
      nationalite: [this.nationList[0], Validators.required],
      date_naissance: [null, Validators.required],
      isAlternant: [false],

      nom_tuteur: ["", Validators.pattern('[^0-9]+')],
      prenom_tuteur: ["", Validators.pattern('[^0-9]+')],
      adresse_tuteur: [""],
      email_tuteur: ["", Validators.email],
      phone_tuteur: ["", Validators.pattern('[- +()0-9]+')],
      indicatif_tuteur: ["", Validators.pattern('[- +()0-9]+')],
      dernier_diplome: [''],
      sos_email: ['', Validators.email],
      sos_phone: ['', Validators.pattern('[- +()0-9]+')],
      custom_id: [''],
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
      entreprise: ['']


    });
  }

  resetAddEtudiant() {
    this.formAddEtudiant.reset()
    this.formAddEtudiant.patchValue({
      civilite: this.civiliteList[0], statut: this.statutList[0],
      pays_adresse: this.paysList[0],
      nationalite: this.nationList[0], date_naissance: null
    })
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
  get entreprise() { return this.formAddEtudiant.get('entreprise'); };
  generateCode(lastname) {


    let random = Math.random().toString(36).substring(8).toUpperCase();
    random = random.substring(0, 4)


    let nom = lastname.replace(/[^a-z0-9]/gi, '').substr(0, 1).toUpperCase();;
    return nom + random;
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
    let custom_id = (this.formAddEtudiant.get('custom_id')?.value != '') ? this.formAddEtudiant.get('custom_id').value : this.generateCode(lastname);
    let isAlternant = this.formAddEtudiant.get('isAlternant')?.value;

    let nom_tuteur = this.formAddEtudiant.get('nom_tuteur')?.value;
    let prenom_tuteur = this.formAddEtudiant.get('prenom_tuteur')?.value;
    let adresse_tuteur = this.formAddEtudiant.get('adresse_tuteur')?.value;
    let email_tuteur = this.formAddEtudiant.get('email_tuteur')?.value;
    let phone_tuteur = this.formAddEtudiant.get('phone_tuteur')?.value;
    let indicatif_tuteur = this.formAddEtudiant.get('indicatif_tuteur')?.value;
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
    let entreprise = this.formAddEtudiant.get('entreprise')?.value;

    let isHandicaped = this.formAddEtudiant.get("isHandicaped")?.value;
    let suivi_handicaped = this.formAddEtudiant.get("suivi_handicaped")?.value;


    //Pour la création du nouvel étudiant on crée aussi un user
    let newUser = new User(null, firstname, lastname, indicatif, phone, email, null, '', 'user', null, null, civilite, null, null, null, '', pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);

    //creation et envoi de user et étudiant 
    let newEtudiant = new Etudiant(null, '', classe_id, statut, nationalite, date_naissance, null, null, null, null, custom_id,
      numero_INE, numero_NIR, sos_email, sos_phone, nom_rl, prenom_rl, indicatif_rl + " " + phone_rl, email_rl, adresse_rl, dernier_diplome, isAlternant.value, nom_tuteur, prenom_tuteur
      , adresse_tuteur, email_tuteur, phone_tuteur, indicatif_tuteur, isHandicaped, suivi_handicaped, entreprise);
    this.etudiantService.create({ 'newEtudiant': newEtudiant, 'newUser': newUser }).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Etudiant ajouté' });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses();

        this.showFormAddEtudiant = false;
        this.resetAddEtudiant();
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: error.error });
      })
    );
  }

  isMinorFC() {
    var today = new Date();
    var birthDate = new Date(this.formAddEtudiant.value.date_naissance);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.isMinor = !(age < 18);
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

  generateCustomCode() {
    let code = this.generateCode(this.formAddEtudiant.value.lastname)
    this.formAddEtudiant.patchValue({ custom_id: code })
  }

}
