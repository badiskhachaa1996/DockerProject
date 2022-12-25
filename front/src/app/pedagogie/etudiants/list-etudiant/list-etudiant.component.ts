
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { PresenceService } from 'src/app/services/presence.service';
import { Presence } from 'src/app/models/Presence';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';
import { Diplome } from 'src/app/models/Diplome';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { Service } from 'src/app/models/Service';
import { MissionService } from 'src/app/services/skillsnet/mission.service';
import { Campus } from 'src/app/models/Campus';
import { info } from 'console';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-list-etudiant',
  templateUrl: './list-etudiant.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-etudiant.component.scss']
})
export class ListEtudiantComponent implements OnInit {

  expandedRows = {};

  etudiants: Etudiant[] = [];

  /* partie dedié aux filtres */
  filtedTable: any[] = []

  onFilter(event, dt) {
    this.filtedTable = event.filteredValue;
  }

  filterByType: boolean;
  showNumbersByType = false;
  etudiantsByType: Etudiant[] = [];

  filterByAS: string = undefined;
  showNumbersByAS: boolean = false;
  etudiantsByAS: Etudiant[] = [];

  filterByGroupe: Classe = undefined;
  showFilterByGroupe: boolean = false;
  etudiantsByGroupe: Etudiant[] = [];

  filterByCampus: Campus = undefined;
  showFilterByCampus: boolean = false;
  etudiantsByCampus: Etudiant[] = [];
  campusList: any = [];
  /* end */

  formUpdateEtudiant: FormGroup;

  typeEtudiant = [
    { label: "Tout types d'étudiants", value: null },
    { label: "Alternant", value: true },
    { label: "Initial", value: false }
  ]

  filterCampus = [
    { label: 'Tous les campus', value: null }
  ]

  formUpdateDossier: FormGroup;
  showFormUpdateEtudiant: boolean = false;

  nationList = environment.nationalites;
  fr = environment.fr;
  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 80
  rangeYear = this.minYear + ":" + this.maxYear

  etudiantToUpdate: Etudiant;

  users: User[] = [];
  dropdownUser: any[] = [{ libelle: '', value: '' }];

  dropdownClasse: any[] = [{ libelle: 'Choisissez une classe', value: null }];
  searchClass: any[] = [];
  dropdownTuteurByEntreprise: any[] = [{ libelle: 'Choisissez un tuteur', value: null }];
  tuteur: Tuteur[] = []
  entrepriseID: Tuteur[] = [];

  civiliteList = environment.civilite;
  statutList = environment.profil;
  paysList = environment.pays;

  //Infos exportations
  formExportEtudiant: FormGroup;
  showFormExportEtudiant: boolean = false;

  idEtudiantToExport: string;
  idUserOfEtudiantToExport: string;
  statutToExport: string;
  classeToExport: string;
  nationaliteToExport: string;
  dateDeNaissanceToExport: Date;

  dropdownFiliere: any[] = [];
  dropdownCampus: any[] = [];
  statutDossier = [
    { value: "Document Manquant", label: "Document Manquant" },
    { value: "Paiement non finalisé", label: "Paiement non finalisé" },
    { value: "Paiement finalisé", label: "Paiement finalisé" },
    { value: "Dossier Complet", label: "Dossier Complet" },
    { value: "Abandon", label: "Abandon" }
  ]

  filterAnneeScolaire = [
    { value: null, label: "Toutes les années" },
    { value: "2020-2021", label: "2020-2021" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
  ]
  dropdownAnneeScolaire = [
    { value: "2020-2021", label: "2020-2021" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" }
  ]

  entreprises: Entreprise[] = [];
  dropdownEntreprise: any[] = [{ libelle: 'Choisissez une entreprise', value: '' }];


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
  isCommercial: boolean = false;
  isAdministration: boolean = false;


  prospects = {}

  absences: Presence[] = []

  showPayement: Prospect
  contrats: ContratAlternance[] = [];

  payementList = []
  onAddPayement() {
    if (this.payementList == null) {
      this.payementList = []
    }
    this.payementList.push({ type: "", montant: 0, date: "" })
  }

  changeMontant(i, event, type) {
    if (type == "montant") {
      this.payementList[i][type] = parseInt(event.target.value);
    } else {
      this.payementList[i][type] = event.target.value;
    }
  }

  deletePayement(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le paiement ?")) {
      this.payementList.splice(i, 1)
    }
  }

  addNewPayment() {
    this.etudiantService.addNewPayment(this.showPayement._id, { payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Le paiement a été ajouté" })
      this.prospects[this.showPayement.user_id] = data
      this.showPayement = null
      this.payementList = null
      //this.refreshProspect()
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur" })
    })
  }

  showPayementFC(etu: Etudiant) {
    let bypass: any = etu.user_id
    this.etudiantService.getPopulateByUserid(bypass._id).subscribe(p => {
      this.showPayement = p
    })
    this.payementList = etu.payment_reinscrit
    this.formUpdateDossier.patchValue({ statut_dossier: etu.statut_dossier })
    /*if (this.prospects[etu.user_id]) {
      this.showPayement = this.prospects[etu.user_id]
      this.payementList = this.showPayement.payement
    } else {
      this.ProspectService.createProspectWhileEtudiant(etu.user_id).subscribe(data => {
        this.showPayement = data
        this.payementList = data.payement
      })
    }*/
  }

  
  constructor(private confirmationService: ConfirmationService, private entrepriseService: EntrepriseService, private ActiveRoute: ActivatedRoute, private AuthService: AuthService, private classeService: ClasseService,
    private formBuilder: FormBuilder, private userService: AuthService, private etudiantService: EtudiantService, private messageService: MessageService,
    private router: Router, private presenceService: PresenceService, private CommercialService: CommercialPartenaireService, private ProspectService: AdmissionService,
    private tuteurService: TuteurService, private diplomeService: DiplomeService, private campusService: CampusService, private missionService: MissionService) { }
  code = this.ActiveRoute.snapshot.paramMap.get('code');

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }

    //Methode de recuperation de toute les listes
    this.onGetAllClasses();
    this.onGetRole()
    /* Specialement pour la partie dexport des données */
    this.dropdownEntreprise = [{ libelle: 'Choisissez une entreprise', value: '' }];
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

    this.ProspectService.getAllEtudiant().subscribe(data => {
      data.forEach(p => {
        this.prospects[p.user_id] = p
      })
    })

    this.campusService.getAllPopulate().subscribe(data => {
      data.forEach(c => {
        let e: any = c.ecole_id
        let n = e.libelle + " - " + c.libelle
        this.dropdownCampus.push({ value: c._id, label: n })
        this.filterCampus.push({ value: c._id, label: c.libelle })

        this.campusList[c._id] = c;
      })
      this.formUpdateEtudiant.patchValue({ campus_id: this.dropdownCampus[0].value })
    })

    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dropdownFiliere.push({ value: d._id, label: d.titre })
      })
      this.formUpdateEtudiant.patchValue({ filiere: this.dropdownFiliere[0].value })
    })

    //Initialisation du formulaire d'ajout et de modification d'un etudiant
    this.onInitFormUpdateEtudiant();

    this.tuteurService.getAll().subscribe(data => {
      data.forEach(tuteur => {
        if (tuteur.user_id)
          this.dropdownTuteurByEntreprise.push({ libelle: tuteur.user_id.lastname + " " + tuteur.user_id.firstname, value: tuteur._id })
      })
    });

  }


  entrepriseIDLoad(entreprise_id) {
    //Liste des tuteurs par entreprise_id
    let entrepriseId = entreprise_id
    this.tuteurService.getAllByEntrepriseId(entrepriseId.value).subscribe(
      (response) => {
        response.forEach((tuteur) => {
          if (tuteur.user_id)
            this.dropdownTuteurByEntreprise.push({ libelle: tuteur.user_id.lastname + " " + tuteur.user_id.firstname, value: tuteur._id })
        })
      }); this.dropdownTuteurByEntreprise = [];
  }

  confirmRighFile(file, etudiant) {
    this.confirmationService.confirm({
      message: 'Voulez vous que ce document soit visible sur le profil de l\'étudiant?',
      header: 'Visibilité',
      icon: 'pi pi-eye',
      accept: () => {
        this.etudiantService.setFileRight(etudiant._id, file, true).subscribe((dataright) => {

        })
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });

      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:

            this.etudiantService.setFileRight(etudiant._id, file, false).subscribe((dataright) => {

            })
            break;
          case ConfirmEventType.CANCEL:

            this.etudiantService.setFileRight(etudiant._id, file, false).subscribe((dataright) => {

            })
            break;
        }
      }
    });

  }
  test(data) {
    console.log(data)
  }

  //Methode de recuperation des differentes classes
  onGetAllClasses() {

    this.dropdownUser = [];
    this.dropdownClasse = [{ libelle: 'Choisissez une classe', value: null }];
    this.searchClass = [];

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.abbrv, value: classe._id });
          this.searchClass.push({ label: classe.abbrv, value: classe._id });
        })
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des étudiants
    this.CommercialService.getByUserId(this.token.id).subscribe(data => {
      if (!this.code && data && data.code_commercial_partenaire) {
        this.code = data.code_commercial_partenaire
      }
      if (this.code) {
        this.etudiantService.getAllByCode(this.code).subscribe(
          ((responseEtu) => {
            this.etudiants = responseEtu;
          }),
          ((error) => { console.error(error); })
        );
      } else {
        this.etudiantService.getAllEtudiantPopulate().subscribe(
          ((responseEtu) => {
            this.etudiants = responseEtu
          }),
          ((error) => { console.error(error); })
        );
      }
    });

  }

  //Pour la partie traitement des erreurs sur le formulaire de modification
  get nationalite2() { return this.formUpdateEtudiant.get('nationalite').value; }
  get date_naissance2() { return this.formUpdateEtudiant.get('date_naissance'); }


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
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email_ims: ['', [Validators.required, Validators.email]],
      email_perso: ['', [Validators.required, Validators.email]],
      classe_id: ['', Validators.required],
      statut: ['', Validators.required],
      nationalite: ['', Validators.required],
      date_naissance: ['', Validators.required],
      isAlternant: [false],
      // indicatif_tuteur: ["", Validators.pattern('[- +()0-9]+')],
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
      isOnStage: [''],
      enic_naric: [false],
      campus_id: [' '],
      filiere: ['', Validators.required],
      statut_dossier: [''],
      annee_scolaire: ['', Validators.required]
    });
    this.formUpdateDossier = this.formBuilder.group({
      statut_dossier: ['']
    });

    this.formUpdateUser = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email_ims: ['', [Validators.required, Validators.email]],
      email_perso: ['', [Validators.required, Validators.email]]
    });
  }

  onDossierUpdate() {
    let statut_dossier = this.formUpdateDossier.get("statut_dossier")?.value;
    this.etudiantService.updateDossier(this.etudiantToUpdate._id, statut_dossier).subscribe(
      ((responde) => {
        this.messageService.add({ severity: 'success', summary: 'Statut du dossier mis à jour: ' + statut_dossier });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses();
        //this.resetForms();
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode de modification d'un étudiant
  onUpdateEtudiant() {
    //Recuperation des données du formulaire
    let classe_id = this.formUpdateEtudiant.get('classe_id')?.value.value;
    let statut = this.formUpdateEtudiant.get('statut')?.value.value;
    let date_naissance = this.formUpdateEtudiant.get('date_naissance')?.value;
    let nationalite = this.formUpdateEtudiant.get('nationalite')?.value.value;

    let isAlternant = this.formUpdateEtudiant.get('isAlternant')?.value;
    let isOnStage = this.formUpdateEtudiant.get('isOnStage')?.value;

    // let indicatif_tuteur = this.formUpdateEtudiant.get('indicatif_tuteur')?.value;
    let dernier_diplome = this.formUpdateEtudiant.get('dernier_diplome')?.value;
    let sos_email = this.formUpdateEtudiant.get('sos_email')?.value;
    let sos_phone = this.formUpdateEtudiant.get('sos_phone')?.value;
    let numero_INE = this.formUpdateEtudiant.get('numero_INE')?.value;
    let numero_NIR = this.formUpdateEtudiant.get('numero_NIR')?.value;
    let nom_rl = this.formUpdateEtudiant.get('nom_rl')?.value;
    let prenom_rl = this.formUpdateEtudiant.get('prenom_rl')?.value;
    let indicatif_rl = this.formUpdateEtudiant.get('indicatif_rl')?.value;
    let phone_rl = this.formUpdateEtudiant.get('phone_rl')?.value;
    let email_rl = this.formUpdateEtudiant.get('email_rl')?.value;
    let adresse_rl = this.formUpdateEtudiant.get('adresse_rl')?.value;

    let remarque = this.formUpdateEtudiant.get('remarque')?.value;
    let isHandicaped = this.formUpdateEtudiant.get("isHandicaped")?.value;
    let suivi_handicaped = this.formUpdateEtudiant.get("suivi_handicaped")?.value;
    let enic_naric = this.formUpdateEtudiant.get("enic_naric")?.value

    let campus = this.formUpdateEtudiant.get("campus_id")?.value;

    let statut_dossier = this.formUpdateEtudiant.get("statut_dossier")?.value;
    let annee_scolaire = this.formUpdateEtudiant.get("annee_scolaire")?.value;
    let filiere = this.formUpdateEtudiant.get("filiere")?.value;

    let id_tuteur = this.formUpdateEtudiant.get("id_tuteur")?.value;
    let isMinor = this.formUpdateEtudiant.get("isMinor")?.value;


    let etudiant = new Etudiant(
      this.etudiantToUpdate._id,
      this.etudiantToUpdate.user_id,
      classe_id,
      statut,
      nationalite,
      date_naissance,
      this.etudiantToUpdate.code_partenaire,
      this.etudiantToUpdate.hasBeenBought,
      this.etudiantToUpdate.examenBought,
      this.etudiantToUpdate.howMuchBought,
      this.etudiantToUpdate.custom_id,
      numero_INE,
      numero_NIR,
      sos_email,
      sos_phone,
      nom_rl,
      prenom_rl,
      phone_rl,
      email_rl,
      adresse_rl,
      dernier_diplome,
      isAlternant,
      isHandicaped,
      suivi_handicaped,
      this.etudiantToUpdate.diplome,
      this.etudiantToUpdate.parcours,
      remarque,
      isOnStage,
      this.etudiantToUpdate.fileRight,
      this.etudiantToUpdate.payment_reinscrit, true,
      enic_naric,
      campus,
      statut_dossier,
      filiere,
      true,
      true,
      annee_scolaire
    );

    this.etudiantService.update(etudiant).subscribe(
      ((responde) => {
        this.messageService.add({ severity: 'success', summary: 'Etudiant modifié' });

        let bypass: any = this.etudiantToUpdate.user_id
        bypass.firstname = this.formUpdateEtudiant.value.firstname
        bypass.lastname = this.formUpdateEtudiant.value.lastname.toUpperCase()
        bypass.email = this.formUpdateEtudiant.value.email_ims
        bypass.email_perso = this.formUpdateEtudiant.value.email_perso

        this.AuthService.updateByIdForPrivate(bypass).subscribe(v => {
          this.messageService.add({ severity: 'success', summary: 'Modification d\'un étudiant', detail: 'Mise à jour de l\'étudiant avec succès' });
          let bp: any = this.etudiantToUpdate
          bp.user_id = v
          this.etudiants[this.etudiants.indexOf(this.etudiantToUpdate)] = bp;
          //Recuperation de la liste des differentes informations
          this.onGetAllClasses();

          this.showFormUpdateEtudiant = false;
        });
        //this.resetForms();
      }),
      ((error) => { console.error(error); })
    );
  }

  entrepriseEtu: any = { libelle: '', value: '' };
  // tuteurEtudiant: any = { libelle: '', value: '' };

  showFUpdate(user: User, response: Etudiant) {
    //Campus et Filiere, statut a vérifier
    this.etudiantToUpdate = response;
    let date = new Date(response.date_naissance)
    this.parcoursList = response.parcours
    let bypass: any = response.classe_id

    this.formUpdateEtudiant.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email_ims: user.email,
      email_perso: user.email_perso,
      statut: { value: response.statut, viewValue: response.statut },
      classe_id: { libelle: bypass.nom, value: bypass._id },
      nationalite: { value: response.nationalite, viewValue: response.nationalite },
      isAlternant: this.etudiantToUpdate.isAlternant,
      dernier_diplome: this.etudiantToUpdate.dernier_diplome,
      sos_email: this.etudiantToUpdate.sos_email,
      sos_phone: this.etudiantToUpdate.sos_phone,
      numero_INE: this.etudiantToUpdate.numero_INE,
      numero_NIR: this.etudiantToUpdate.numero_NIR,
      nom_rl: this.etudiantToUpdate.nom_rl,
      prenom_rl: this.etudiantToUpdate.prenom_rl,
      phone_rl: this.etudiantToUpdate.phone_rl,
      email_rl: this.etudiantToUpdate.email_rl,
      adresse_rl: this.etudiantToUpdate.adresse_rl,
      isHandicaped: this.etudiantToUpdate.isHandicaped,
      suivi_handicaped: this.etudiantToUpdate.suivi_handicaped,
      remarque: this.etudiantToUpdate.remarque,
      isOnStage: this.etudiantToUpdate.isOnStage,
      enic_naric: this.etudiantToUpdate.enic_naric,
      annee_scolaire: this.etudiantToUpdate.annee_scolaire
    });
    bypass = response.campus
    let bypassv2: any = response.filiere
    this.formUpdateEtudiant.patchValue({
      campus_id: bypass?._id,
      filiere: bypassv2?._id,
      date_naissance: this.formatDate(date)
    })
    this.showFormUpdateEtudiant = true;
    this.showFormExportEtudiant = false;
    this.showFormUpdateUser = false;
  }
  showFormUpdateUser = false
  formUpdateUser: FormGroup

  showFPersonalUpdate(response: User, etudiant: Etudiant) {
    this.etudiantToUpdate = etudiant
    this.formUpdateUser.patchValue({
      firstname: response.firstname,
      lastname: response.lastname,
      email_ims: response.email,
      email_perso: response.email_perso
    })
    this.showFormUpdateUser = true;
    this.showFormUpdateEtudiant = false;
    this.showFormExportEtudiant = false;
  }

  onUpdateUser() {
    let bypass: any = this.etudiantToUpdate.user_id
    bypass.firstname = this.formUpdateUser.value.firstname
    bypass.lastname = this.formUpdateUser.value.lastname.toUpperCase()
    bypass.email = this.formUpdateUser.value.email_ims
    bypass.email_perso = this.formUpdateUser.value.email_perso
    this.AuthService.updateByIdForPrivate(bypass).subscribe(v => {
      this.showFormUpdateUser = false
      this.messageService.add({ severity: 'success', summary: 'Modification d\'un étudiant', detail: 'Mise à jour de l\'étudiant avec succès' });
      let bp: any = this.etudiantToUpdate
      bp.user_id = v
      this.etudiants[this.etudiants.indexOf(this.etudiantToUpdate)] = bp
    })
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  clickFile(rowData) {
    this.uploadUser = rowData
    document.getElementById('selectedFile').click();
  }


  clickFile2() {
    document.getElementById('selectedFile2').click();
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
    this.presenceService.getAllAbsences(rowData?.user_id._id).subscribe(data => {
      this.absences = data
    })
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
  VisualiserFichier(id, i) {
    this.etudiantService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      console.error(error)
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
        this.confirmRighFile(event.files[0], this.showUploadFile)
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.loadPP(this.showUploadFile)
        event.target = null;
        this.showUploadFile = null;

      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }

  }

  parcoursList = []

  onAddParcours() {
    this.parcoursList.push({ diplome: "", date: new Date() })
  }

  /*onChangeParcours(i, event, type) {
    console.log(event.target.value)
    if (type == "date") {
      this.parcoursList[i][type] = new Date(event.target.value);
    } else {
      this.parcoursList[i][type] = event.target.value;
    }
  }*/

  onRemoveParcours(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous vraiment supprimer le parcours ?")) {
      this.parcoursList.splice(i)
    }
  }

  onGetRole() {
    this.CommercialService.getByUserId(this.token.id).subscribe(data => {
      this.isCommercial = data != null
    })
    this.userService.getPopulate(this.token.id).subscribe(dataU => {
      let bypass: any = dataU?.service_id
      this.isAdministration = bypass?.label.includes('sministration') || this.token.role == "Admin"
    })
  }

  onRedirect() {
    this.router.navigate(['ajout-etudiant']);
  }

  disable(etudiant: Etudiant) {
    let bypass: any = etudiant.user_id
    if (confirm(`Etes-vous sûr de vouloir désactiver ${bypass?.lastname} ${bypass?.firstname} (il/elle ne sera plus visible dans cette liste) ?`))
      this.etudiantService.disable(etudiant).subscribe((data) => {
        this.messageService.add({ severity: "success", summary: "L'étudiant a bien été désactivé" })
        this.etudiants.splice(this.etudiants.indexOf(etudiant), 1)
      }, (error) => {
        this.messageService.add({ severity: "error", summary: "La désactivation de l'étudiant a eu un problème", detail: error.error })
        console.error(error)
      })
  }


  langueFinder(pdf: string) {
    let pdf_lower = pdf.toLowerCase()
    this.languesCV = []
    if (pdf_lower.indexOf('français') != -1 || pdf_lower.indexOf('francais') != -1 || pdf_lower.indexOf('french') != -1)
      this.languesCV.push('français')
    if (pdf_lower.indexOf('arabe') != -1 || pdf_lower.indexOf('arabian') != -1)
      this.languesCV.push('arabe')
    if (pdf_lower.indexOf('espagnol') != -1 || pdf_lower.indexOf('spanish') != -1)
      this.languesCV.push('espagnol')
    if (pdf_lower.indexOf('japonais') != -1 || pdf_lower.indexOf('japanese') != -1)
      this.languesCV.push('japonais')
    if (pdf_lower.indexOf('english') != -1 || pdf_lower.indexOf('anglais') != -1)
      this.languesCV.push('anglais')
    if (pdf_lower.indexOf('chinois') != -1 || pdf_lower.indexOf('mandarin') != -1 || pdf_lower.indexOf('chinese') != -1)
      this.languesCV.push('chinois')
    if (pdf_lower.indexOf('allemand') != -1 || pdf_lower.indexOf('german') != -1)
      this.languesCV.push('allemand')
  }


  languesCV = []
  urlVideo = ""
  skillsCV: [
    { skill: String, niveau: String }
  ]
  experiencesCV: [
    { skill: String, date_debut: Date, date_fin: Date }
  ]


  ImagineYaPasDeCountEnJS(string, substring) {
    //return (string.match("/" + substring + "/g") || []).length;
    return string.split(substring).length - 1;
  }


  //Methode pour filtrer les étudiants selon le type choisis dans le filtre
  onFilterByType(event) {
    this.filterByType = event.value;

    if (this.filterByType === true) {
      if (this.filterByAS) {
        if (this.filterByGroupe) {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {

            let bypass_etudiant: any = etudiant.classe_id;
            if (etudiant.isAlternant && bypass_etudiant._id == this.filterByGroupe._id && etudiant.annee_scolaire.includes(this.filterByAS)) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }
        else {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            if (etudiant.isAlternant && etudiant.annee_scolaire.includes(this.filterByAS)) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }

        this.showNumbersByType = true;
      }
      else {
        if (this.filterByGroupe) {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            let bypass_etudiant: any = etudiant.classe_id;
            if (etudiant.isAlternant && bypass_etudiant._id == this.filterByGroupe._id) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }
        else {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            if (etudiant.isAlternant) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }

        this.showNumbersByType = true;
      }

    }

    else if (this.filterByType === false) {
      if (this.filterByAS) {
        if (this.filterByGroupe) {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            let bypass_etudiant: any = etudiant.classe_id;
            if (!etudiant.isAlternant && bypass_etudiant._id == this.filterByGroupe._id && etudiant.annee_scolaire.includes(this.filterByAS)) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }
        else {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            if (!etudiant.isAlternant && etudiant.annee_scolaire.includes(this.filterByAS)) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }

        this.showNumbersByType = true;
      }
      else {
        if (this.filterByGroupe) {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            let bypass_etudiant: any = etudiant.classe_id;
            if (!etudiant.isAlternant && bypass_etudiant._id == this.filterByGroupe._id) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }
        else {
          this.etudiantsByType = [];
          this.etudiants.forEach((etudiant) => {
            if (!etudiant.isAlternant) {
              this.etudiantsByType.push(etudiant);
            }
          });
        }

        this.showNumbersByType = true;
      }
    }
    else if (this.filterByType === null) {
      this.showNumbersByType = false;
    }
  }

  //Methode pour filtrer les étudiants par année-scolaire
  onFilterByAS(event: any) {
    this.filterByAS = event.value;

    this.etudiantsByAS = [];

    this.etudiants.forEach((etudiant) => {
      if (etudiant.annee_scolaire.includes(this.filterByAS)) {
        this.etudiantsByAS.push(etudiant);
      }
    });

    this.showNumbersByAS = true;
  }


  //Methode pour filtrer par campus
  onFilterByCampus(event: any) {
    if (event.value) {
      this.etudiantsByCampus = [];

      //Recuperation du campus
      this.campusService.getByCampusId(event.value)
        .then((response: Campus) => {
          this.filterByCampus = response;
          this.etudiants.forEach((etudiant) => {
            if (this.filterByAS) {
              let bypass_etudiant: any = etudiant.campus;
              if (bypass_etudiant._id == this.filterByCampus._id && etudiant.annee_scolaire.includes(this.filterByAS)) {
                this.etudiantsByCampus.push(etudiant);
              }
            }
            else {
              let bypass_etudiant: any = etudiant.campus;
              if (bypass_etudiant._id == this.filterByCampus._id) {
                this.etudiantsByCampus.push(etudiant);
              }
            }
          });
          this.showFilterByCampus = true;
        })
        .catch((error) => { console.log(error) });
    }
    else {
      this.showFilterByCampus = false;
    }

  }

  onFilterbyGroup(event: any) {
    if (event.value) {
      //Recuperation du groupe
      this.classeService.get(event.value).subscribe(
        ((response) => {
          this.filterByGroupe = response;
          this.etudiantsByGroupe = [];

          this.etudiants.forEach((etudiant) => {
            if (this.filterByAS) {
              let bypass_etudiant: any = etudiant.classe_id;
              if (bypass_etudiant._id == this.filterByGroupe._id && etudiant.annee_scolaire.includes(this.filterByAS)) {
                this.etudiantsByGroupe.push(etudiant);
              }
            }
            else {
              let bypass_etudiant: any = etudiant.classe_id;
              if (bypass_etudiant._id == this.filterByGroupe._id) {
                this.etudiantsByGroupe.push(etudiant);
              }
            }
          });
          this.showFilterByGroupe = true;
        }),
        ((error) => { console.log(error); })
      );
    }
    else {
      this.showFilterByGroupe = false;
    }
  }


  //Methode pour vider tous les compteurs
  onTrashCount() {
    this.filterByType = null;
    this.showNumbersByType = false;
    this.etudiantsByType = [];

    this.filterByAS = undefined;
    this.showNumbersByAS = false;
    this.etudiantsByAS = [];

    this.filterByGroupe = undefined;
    this.showFilterByGroupe = false;
    this.etudiantsByGroupe = [];

    this.filterByCampus = undefined;
    this.showFilterByCampus = false;
    this.etudiantsByCampus = [];
  }


  

  exportExcel() {
    let dataExcel = []
    //Clean the data
    if (this.filtedTable.length < 1)
      this.filtedTable = this.etudiants
    this.filtedTable.forEach(etudiant => {
      let t = {}
      t['ID Etudiant'] = etudiant?.custom_id
      t['NOM'] = etudiant?.user_id?.lastname
      t['Prenom'] = etudiant?.user_id?.firstname
      t['Filière'] = etudiant?.filiere?.titre
      t['Groupe'] = etudiant?.classe_id?.abbrv
      t['Campus'] = etudiant?.campus?.libelle
      t['Email Ecole'] = etudiant?.user_id?.email
      t['Email Personnel'] = etudiant?.user_id?.email_perso
      t['Source'] = etudiant?.source
      t['Alternant ?'] = etudiant?.isAlternant
      t['Date de naissance'] = etudiant?.date_naissance
      t['Nationalite'] = etudiant?.user_id?.nationnalite

      t['Telephone'] = etudiant?.user_id?.indicatif + etudiant?.user_id?.phone
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "etudiants" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }
}