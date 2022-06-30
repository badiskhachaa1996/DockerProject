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
  selector: 'app-list-etudiant',
  templateUrl: './list-etudiant.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-etudiant.component.scss']
})
export class ListEtudiantComponent implements OnInit {

  expandedRows = {};
  
  etudiants: Etudiant[] = [];

  formUpdateEtudiant: FormGroup;
  showFormUpdateEtudiant: boolean = false;

  nationList = environment.nationalites;
  fr = environment.fr;
  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 80
  rangeYear = this.minYear + ":" + this.maxYear

  etudiantToUpdate: Etudiant;
  idEtudiantToUpdate: string;
  idUserOfEtudiantToUpdate: string;
  nationaliteToUpdate: string;
  statutToUpdate: string;
  classeToUpdate: string;

  users: User[] = [];
  dropdownUser: any[] = [{ libelle: '', value: '' }];

  classes: Classe[] = [];
  dropdownClasse: any[] = [{ libelle: 'Choissisez une classe', value: null }];
  searchClass: any[] = [{ libelle: 'Toutes les classes', value: null }];

  civiliteList = environment.civilite;
  statutList = environment.profil;

  //Infos exportations
  formExportEtudiant: FormGroup;
  showFormExportEtudiant: boolean = false;

  idEtudiantToExport: string;
  idUserOfEtudiantToExport: string;
  statutToExport: string;
  classeToExport: string;
  nationaliteToExport: string;
  dateDeNaissanceToExport: Date;

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

    /* Specialement pour la partie dexport des données */
    this.dropdownEntreprise = [{ libelle: 'Choissisez une entreprise', value: '' }];
    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach(entreprise => {
          this.dropdownEntreprise.push({ libelle: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
        })
      }),
      ((error) => { console.log(error); })
    );

    //Initialisation du formulaire d'ajout et de modification d'un etudiant
    this.onInitFormUpdateEtudiant();

  }


  //Methode de recuperation des differentes classes
  onGetAllClasses() {

    this.dropdownUser = [];
    this.dropdownClasse = [{ libelle: 'Choissisez une classe', value: null }];
    this.searchClass = [{ libelle: 'Toutes les classes', value: null }];

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.nom, value: classe._id });
          this.classes[classe._id] = classe;
          this.searchClass.push({ libelle: classe.nom, value: classe._id });
        })
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des étudiants
    this.AuthService.WhatTheRole(this.token.id).subscribe(data => {
      if (!this.code && data.type == "Partenaire") {
        this.code = data.data.code_partenaire
      }
      if (this.code) {
        console.log(this.code)
        this.etudiantService.getAllByCode(this.code).subscribe(
          ((responseEtu) => {
            console.log(responseEtu)
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
    })



  }

  //Pour la partie traitement des erreurs sur le formulaire de modification
  get nationalite2() { return this.formUpdateEtudiant.get('nationalite').value; }
  get date_naissance2() { return this.formUpdateEtudiant.get('date_naissance'); }


  generateCode(lastname) {
    let random = Math.random().toString(36).substring(8).toUpperCase();
    random = random.substring(0, 4)

    let nom = lastname.replace(/[^a-z0-9]/gi, '').substr(0, 1).toUpperCase();;
    return nom + random;
  }


  isMinorFC() {
    var today = new Date();
    var birthDate = new Date(this.formUpdateEtudiant.value.date_naissance);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.isMinor = !(age < 18);
  }


  //Methode d'initialisation du formulaire de modification d'un étudiant
  onInitFormUpdateEtudiant() {
    this.formUpdateEtudiant = this.formBuilder.group({
      classe_id: ['', Validators.required],
      statut: ['', Validators.required],
      nationalite: ['', Validators.required],
      date_naissance: ['', Validators.required],
      isAlternant: [false],
      entreprise: [],
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
      suivi_handicaped: ['']
    });
  }


  //Methode de modification d'un étudiant
  onUpdateEtudiant() {
    //Recuperation des données du formulaire
    let classe_id = this.formUpdateEtudiant.get('classe_id')?.value.value;
    let statut = this.formUpdateEtudiant.get('statut')?.value.value;
    let date_naissance = this.formUpdateEtudiant.get('date_naissance')?.value;
    console.log(date_naissance)
    let nationalite = this.formUpdateEtudiant.get('nationalite')?.value.value;

    let custom_id = this.formUpdateEtudiant.get('custom_id')?.value
    let isAlternant = this.formUpdateEtudiant.get('isAlternant')?.value;

    let nom_tuteur = this.formUpdateEtudiant.get('nom_tuteur')?.value;
    let prenom_tuteur = this.formUpdateEtudiant.get('prenom_tuteur')?.value;
    let adresse_tuteur = this.formUpdateEtudiant.get('adresse_tuteur')?.value;
    let email_tuteur = this.formUpdateEtudiant.get('email_tuteur')?.value;
    let phone_tuteur = this.formUpdateEtudiant.get('phone_tuteur')?.value;
    let indicatif_tuteur = this.formUpdateEtudiant.get('indicatif_tuteur')?.value;
    let dernier_diplome = this.formUpdateEtudiant.get('dernier_diplome')?.value;
    let sos_email = this.formUpdateEtudiant.get('sos_email')?.value;
    let sos_phone = this.formUpdateEtudiant.get('sos_phone')?.value;
    let numero_INE = this.formUpdateEtudiant.get('numero_INE')?.value;
    let numero_NIR = this.formUpdateEtudiant.get('numero_NIR')?.value;
    let nom_rl = this.formUpdateEtudiant.get('nom_rl')?.value;
    let prenom_rl = this.formUpdateEtudiant.get('prenom_rl')?.value;
    let phone_rl = this.formUpdateEtudiant.get('phone_rl')?.value;
    let email_rl = this.formUpdateEtudiant.get('email_rl')?.value;
    let adresse_rl = this.formUpdateEtudiant.get('adresse_rl')?.value;
    let entreprise = this.formUpdateEtudiant.get('entreprise')?.value;

    let isHandicaped = this.formUpdateEtudiant.get("isHandicaped")?.value;
    let suivi_handicaped = this.formUpdateEtudiant.get("suivi_handicaped")?.value;

    let etudiant = new Etudiant(this.idEtudiantToUpdate, this.idUserOfEtudiantToUpdate, classe_id, statut, nationalite, date_naissance,
      null,null,null,null,custom_id,numero_INE,numero_NIR,sos_email,sos_phone,nom_rl,prenom_rl,phone_rl,email_rl,adresse_rl,dernier_diplome,
      isAlternant,entreprise,nom_tuteur,prenom_tuteur,adresse_tuteur,email_tuteur,phone_tuteur,indicatif_tuteur,isHandicaped,suivi_handicaped);

    this.etudiantService.update(etudiant).subscribe(
      ((responde) => {

        this.messageService.add({ severity: 'success', summary: 'Etudiant modifié' });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses();

        this.showFormUpdateEtudiant = false;
        //this.resetForms();
      }),
      ((error) => { console.log(error); })
    );
  }


  //Methôde de recuperation de l'etudiant à modifier
  onGetbyId() {
    //Recuperation de l'etudiant à modifier
    this.etudiantService.getById(this.idEtudiantToUpdate).subscribe(
      ((response) => {
        this.etudiantToUpdate = response;
        let date = new Date(this.etudiantToUpdate.date_naissance)
        this.formUpdateEtudiant.patchValue({
          statut: { libelle: this.statutToUpdate, value: this.etudiantToUpdate.statut }, classe_id: { libelle: this.classeToUpdate, value: this.etudiantToUpdate.classe_id }, nationalite: { value: this.nationaliteToUpdate, viewValue: this.nationaliteToUpdate }, date_naissance: new Date(date.getUTCFullYear(), (date.getMonth() + 1),date.getDate()),
          isAlternant: this.etudiantToUpdate.isAlternant, nom_tuteur: this.etudiantToUpdate.nom_tuteur, prenom_tuteur: this.etudiantToUpdate.prenom_tuteur, adresse_tuteur: this.etudiantToUpdate.adresse_tuteur,
          email_tuteur: this.etudiantToUpdate.email_tuteur, phone_tuteur: this.etudiantToUpdate.phone_tuteur, indicatif_tuteur: this.etudiantToUpdate.indicatif_tuteur,
          dernier_diplome: this.etudiantToUpdate.dernier_diplome, sos_email: this.etudiantToUpdate.sos_email, sos_phone: this.etudiantToUpdate.sos_phone, custom_id: this.etudiantToUpdate.custom_id,
          numero_INE: this.etudiantToUpdate.numero_INE, numero_NIR: this.etudiantToUpdate.numero_NIR, nom_rl: this.etudiantToUpdate.nom_rl, prenom_rl: this.etudiantToUpdate.prenom_rl, phone_rl: this.etudiantToUpdate.phone_rl, email_rl: this.etudiantToUpdate.email_rl,
          adresse_rl: this.etudiantToUpdate.adresse_rl, isHandicaped: this.etudiantToUpdate.isHandicaped, suivi_handicaped: this.etudiantToUpdate.suivi_handicaped,
          entreprise: this.etudiantToUpdate.entreprise,
        });
      }),
      ((error) => { console.log(error); })
    );
  }

  clickFile(rowData) {
    this.uploadUser = rowData
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    console.log("FileUploadPC")
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
    let code = this.generateCode(this.formUpdateEtudiant.value.lastname)
    this.formUpdateEtudiant.patchValue({ custom_id: code })
  }

}
