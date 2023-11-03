import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { DailyCheck } from 'src/app/models/DailyCheck';
import { User } from 'src/app/models/User';
import { DailyCheckService } from 'src/app/services/daily-check.service';
import { RhService } from 'src/app/services/rh.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { MailType } from 'src/app/models/MailType';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { HistoriqueEmail } from 'src/app/models/HistoriqueEmail';
import { FileUpload } from 'primeng/fileupload';
import { saveAs } from 'file-saver';
import mongoose from 'mongoose';
import { AuthService } from 'src/app/services/auth.service';
import { CongeService } from 'src/app/services/conge.service';
import { Router } from '@angular/router';
import { ServService } from 'src/app/services/service.service';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.scss']
})
export class CollaborateursComponent implements OnInit {
  collaborateurs: Collaborateur[] = [];
  agents: any[] = [];
  collaborateurToUpdate: Collaborateur;
  collaborateurPersonalData: User; // information personnelles du collaborateur pour la mise à jour des données
  collaborateurCompetences: any[] = []; // liste des compétences du collaborateur
  clonedCollaborateurCompetences: { [s: string]: any } = {};
  formAdd: FormGroup; // ajout du collaborateur
  showFormAdd: boolean = false;
  formUpdate: FormGroup; // mise à jour des infos collaborateur du collaborateur
  showFormUpdate: boolean = false;
  formUpdatePersonalInfo: FormGroup; // mise à jour des informations personnelles du collaborateur
  showFormUpdatePersonalInfo: boolean = false;
  showCompetenceTable: boolean = false;
  formAddCompetence: FormGroup;
  showFormAddCompetence: boolean = false;
  showJobDescription: boolean = false;
  formUpdateJobDescription: FormGroup;
  showFormUpdateJobDescriptionForm: boolean = false;
  showCra: boolean = false;
  showHistoriqueCra: boolean = false;
  historiqueCra: DailyCheck[] = [];
  historiqueCraSelected: DailyCheck;

  // chargement des données de tableau
  loading: boolean = false;

  // liste de données
  localisationList: any[] = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];
  siteFilter = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ]

  contratList: any[] = [
    { label: 'Stage', value: 'Stage' },
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Prestation', value: 'Prestation' },
    { label: 'SIVP', value: 'SIVP' }
  ];

  statutList: any[] = [
    { label: 'Actif', value: 'Actif' },
    { label: 'Démission', value: 'Démission' },
    { label: 'Abandon poste', value: 'Abandon poste' },
    { label: 'Période d\'essai', value: 'Période d\'essai' },
    { label: 'Fin contrat', value: 'Fin contrat' },
  ];
  serviceFilter = []
  statutFilter: any[] = [
    { label: 'Actif', value: 'Actif' },
    { label: 'Démission', value: 'Démission' },
    { label: 'Abandon poste', value: 'Abandon poste' },
    { label: 'Période d\'essai', value: 'Période d\'essai' },
    { label: 'Fin contrat', value: 'Fin contrat' },
  ];

  civiliteList: any[] = [
    { label: 'Monsieur', value: 'Monsieur' },
    { label: 'Madame', value: 'Madame' },
    { label: 'Autre', value: 'Autre' },
  ];

  levelList: any[] = [
    { label: 'Basique', value: 'Basique' },
    { label: 'Intermédiaire', value: 'Intermédiaire' },
    { label: 'Avancé', value: 'Avancé' },
  ];

  showEmailView: boolean = false;
  formEmailPerso: FormGroup;
  formEmailType: FormGroup;
  mailDropdown: any[] = [];
  mailTypeDropdown: any[] = [];

  uploadFilePJ: {
    date: Date,
    nom: string,
    path: string,
    _id: string
  } = null;

  piece_jointes: any[] = [];
  mailTypeSelected: MailType;
  @ViewChild('fileInput') fileInput: FileUpload;
  historiqueEmails: HistoriqueEmail[] = [];

  token: any;

  constructor(private emailTypeService: EmailTypeService, private dailyCheckService: DailyCheckService,
    private messageService: MessageService, private rhService: RhService, private formBuilder: FormBuilder,
    private UserService: AuthService, private congeService: CongeService, private router: Router, private ServService: ServService) { }

  ngOnInit(): void {
    // décodage du token
    this.token = jwt_decode(localStorage.getItem('token'));
    // recuperation de la liste des collaborateurs
    this.onGetCollaborateurs();
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceFilter.push({ label: val.label, value: val._id })
      })
    })
    // recuperation de la liste des agents
    this.rhService.getAgents()
      .then((response) => {
        this.agents = [];
        response.forEach((user: User) => {
          let userName = `${user?.lastname} ${user?.firstname}`;
          this.agents.push({ label: userName, value: user._id });
        });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des agents' }); });

    // initialisation du formulaire d'ajout
    this.formAdd = this.formBuilder.group({
      user_id: ['', Validators.required],
      matricule: [''],
      date_demarrage: [new Date()],
      date_naissance: [new Date()],
      localisation: [[]],
      intitule_poste: [''],
      contrat_type: ['', Validators.required],
      statut: [''],
      h_cra: ['']
    });

    // initialisation du formulaire de mise à jour
    this.formUpdate = this.formBuilder.group({
      user_id: ['', Validators.required],
      matricule: [''],
      date_demarrage: [''],
      date_naissance: [''],
      localisation: [[]],
      intitule_poste: [''],
      contrat_type: ['', Validators.required],
      statut: [''],
      h_cra: ['']
    });

    // initialisation du formulaire de lise à jour des informations personnelles du collaborateur
    this.formUpdatePersonalInfo = this.formBuilder.group({
      civilite: [''],
      firstname: [''],
      lastname: [''],
      indicatif: [''],
      phone: [''],
      email: [''],
      email_perso: [''],
    });

    // initialisation du formulaire d'ajout de compétences
    this.formAddCompetence = this.formBuilder.group({
      competences: this.formBuilder.array([this.onCreateCompetenceField()]),
    });

    // initialisation des formulaires d'envois de mails
    this.formEmailPerso = new FormGroup({
      objet: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      cc: new FormControl([]),
      send_from: new FormControl('', Validators.required)
    });

    this.formEmailType = new FormGroup({
      objet: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      cc: new FormControl([]),
      send_from: new FormControl('', Validators.required)
    });
  }

  // recuperation de la liste des collaborateurs
  onGetCollaborateurs(): void {
    this.rhService.getCollaborateurs()
      .then((response) => {
        this.collaborateurs = []
        response.forEach(c => {
          if (c.user_id)
            this.collaborateurs.push(c)
        })
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
  }

  // récupère un collaborateur via son id et attribution de ses compétences
  onGetCollaborateurCompetence(id: string): void {
    this.rhService.getCollaborateur(id)
      .then((response) => { this.collaborateurCompetences = response.competences; })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer le collaborateur' }); });
  }

  // méthode d'ajout du collaborateur
  onAdd(): void {
    // recuperation des données du formulaire
    const formValue = this.formAdd.value;

    // création du nouvel objet collaborateur
    const collaborateur = new Collaborateur();
    collaborateur.user_id = formValue.user_id;
    collaborateur.matricule = formValue.matricule;
    collaborateur.date_demarrage = formValue.date_demarrage;
    collaborateur.date_naissance = formValue.date_naissance;
    collaborateur.localisation = formValue.localisation;
    collaborateur.intitule_poste = formValue.intitule_poste;
    collaborateur.contrat_type = formValue.contrat_type;
    collaborateur.statut = formValue.statut;
    collaborateur.h_cra = formValue.h_cra;

    // envoi des données en base de données
    this.rhService.postCollaborateur(collaborateur)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Agents', detail: 'Collaborateur ajouté avec succès' });
        // recuperation de la liste des collaborateurs
        this.onGetCollaborateurs();
        // masque le formulaire de mise à jour
        this.showFormAdd = false;
        this.formAdd.reset();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: "Ajout impossible" }); });
  }

  // remplissage du formulaire de modification
  onFillForm(collaborateur: Collaborateur): void {
    this.collaborateurToUpdate = collaborateur;
    const { user_id } = collaborateur;

    this.formUpdate.patchValue({
      user_id: collaborateur.user_id._id,
      matricule: collaborateur.matricule,
      localisation: collaborateur.localisation,
      intitule_poste: collaborateur.intitule_poste,
      contrat_type: collaborateur.contrat_type,
      statut: collaborateur.statut,
      h_cra: collaborateur.h_cra,
    });
    if (collaborateur.date_demarrage)
      this.formUpdate.patchValue({ date_demarrage: new Date(collaborateur.date_demarrage), })
    if (collaborateur.date_naissance)
      this.formUpdate.patchValue({ date_naissance: new Date(collaborateur.date_naissance), })

    // masque les autres formulaires
    this.showFormAdd = false;
    this.showFormUpdatePersonalInfo = false;
    // affichage du formulaire
    this.showFormUpdate = true;
  }

  // mise à jour des données collaborateur d'un collaborateur
  onUpdate(): void {
    // recuperation des données du formulaire
    const formValue = this.formUpdate.value;
    // affectations des données à la variable de mise à jour
    this.collaborateurToUpdate.user_id = formValue.user_id;
    this.collaborateurToUpdate.matricule = formValue.matricule;
    this.collaborateurToUpdate.date_demarrage = formValue.date_demarrage;
    this.collaborateurToUpdate.date_naissance = formValue.date_naissance;
    this.collaborateurToUpdate.localisation = formValue.localisation;
    this.collaborateurToUpdate.intitule_poste = formValue.intitule_poste;
    this.collaborateurToUpdate.contrat_type = formValue.contrat_type;
    this.collaborateurToUpdate.statut = formValue.statut;
    this.collaborateurToUpdate.h_cra = formValue.h_cra;

    this.rhService.patchCollaborateurData(this.collaborateurToUpdate)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: 'Collaborateur mis à jour avec succès' });
        this.showFormUpdate = false;
        this.formUpdate.reset();
        // recuperation de la liste des collaborateurs
        this.onGetCollaborateurs();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour le collaborateur' }); });
  }

  // remplissage du formulaire de mise à jour des informations personnelles
  onFillFormUpdatePersonalData(collaborateur: Collaborateur): void {
    this.collaborateurToUpdate = collaborateur;
    // recuperation des informations user du collaborateur;
    const { user_id } = collaborateur;
    this.collaborateurPersonalData = user_id;

    this.formUpdatePersonalInfo.patchValue({
      civilite: user_id?.civilite,
      firstname: user_id?.firstname,
      lastname: user_id?.lastname,
      indicatif: user_id?.indicatif,
      phone: user_id?.phone,
      email: user_id?.email,
      email_perso: user_id?.email_perso,
    });
    // masque le formulaire d'ajout et de modif d'info collaborateur
    this.showFormAdd = false;
    this.showFormUpdate = false;
    // affichage du formulaire
    this.showFormUpdatePersonalInfo = true;
  }

  // mise à jour des informations personnelles du collaborateur
  onUpdatePersonalData(): void {
    const formValue = this.formUpdatePersonalInfo.value;
    this.collaborateurPersonalData.civilite = formValue.civilite;
    this.collaborateurPersonalData.firstname = formValue.firstname;
    this.collaborateurPersonalData.lastname = formValue.lastname;
    this.collaborateurPersonalData.indicatif = formValue.indicatif;
    this.collaborateurPersonalData.phone = formValue.phone;
    this.collaborateurPersonalData.email = formValue.email;
    this.collaborateurPersonalData.email_perso = formValue.email_perso;
    this.collaborateurPersonalData.role = formValue.role;

    // envoi des données en bases de données
    this.rhService.patchCollaborateurPersonalData(this.collaborateurPersonalData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Informations personnelles du collaborateur mis à jour avec succès' });
        this.showFormUpdatePersonalInfo = false;
        this.formUpdatePersonalInfo.reset();
        this.onGetCollaborateurs();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Informations personnelles', detail: 'Impossible de mettre à jour les informations personnelles du collaborateur' }); });
  }

  // pour créer des champs de formulaires à la volée
  onCreateCompetenceField(): FormGroup {
    return (
      this.formBuilder.group({
        kind: [''],
        level: ['']
      })
    );
  }

  // récupère les compétences
  getCompetences(): FormArray {
    return this.formAddCompetence.get('competences') as FormArray;
  }

  // ajoute de nouveaux champs au formulaire
  onAddCompetence(): void {
    const newCompetenceControl = this.onCreateCompetenceField();
    this.getCompetences().push(newCompetenceControl);
  }

  // suppression d'un champ de compétence
  onDeleteCompetence(i: number): void {
    this.getCompetences().removeAt(i);
  }

  // méthode de mise à jour du collaborateur pour lui ajouter des compétences
  onAddCollaborateurSkills(): void {
    const formValue = this.formAddCompetence.value;

    // envoi des données en base de données
    this.rhService.patchCollaborateurSkills(this.collaborateurToUpdate._id, formValue.competences)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: 'Compétences du collaborateur mis à jour' });
        this.formAddCompetence.reset();
        this.showFormAddCompetence = false;
        // recuperation de la liste des collaborateurs
        this.onGetCollaborateurs();
        this.onGetCollaborateurCompetence(response._id);
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour les compétences du collaborateur' }); });
  }

  // méthodes de mise à jour d'une compétence
  onRowEditInit(competence: any) {
    this.clonedCollaborateurCompetences[competence._id as string] = { ...competence };
  }

  onRowEditSave(competence: any) {
    // méthode de mise à jour de la compétence
    this.collaborateurToUpdate.competences = this.collaborateurCompetences;
    this.rhService.patchCollaborateurData(this.collaborateurToUpdate)
      .then((response) => {
        this.onGetCollaborateurs();
        this.onGetCollaborateurCompetence(response._id);
        this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: 'Compétence mis à jour' });
        delete this.clonedCollaborateurCompetences[competence._id as string];
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour les compétences du collaborateur' }); });
  }

  onRowEditCancel(competence: any, index: number) {
    this.collaborateurCompetences[index] = this.clonedCollaborateurCompetences[competence._id as string];
    delete this.clonedCollaborateurCompetences[competence._id as string];
  }

  // méthode de suppression d'une compétence
  onDeleteCollaborateurCompetence(id: string): void {
    this.collaborateurToUpdate.competences = this.collaborateurToUpdate.competences.filter(c => c._id != id);

    this.rhService.patchCollaborateurData(this.collaborateurToUpdate)
      .then((response) => {
        this.onGetCollaborateurs();
        this.onGetCollaborateurCompetence(response._id);
        this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: 'Compétence mis à jour' });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour les compétences du collaborateur' }); });
  }

  // méthode de suppression du collaborateur
  onRemoveCollaborateur(id: string): void {
    if (confirm('Voulez vous supprimer ce collaborateur ?')) {
      this.rhService.deleteCollaborateur(id)
        .then((response) => {
          this.onGetCollaborateurs();
          this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: response });
        })
        .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: error }); });
    }
  }

  // initialisation du formulaire de mise à jour de la description du poste
  onInitFormUpdateJobDescription(): void {
    // initialisation du formulaire de mise à jour de la description du poste
    this.formUpdateJobDescription = this.formBuilder.group({
      description: [this.collaborateurToUpdate?.poste_description, Validators.required],
    });
  }

  // mise à jour du poste du collaborateur
  onUpdateJobDescription(): void {
    const formValue = this.formUpdateJobDescription.value;

    this.collaborateurToUpdate.poste_description = formValue.description;

    this.rhService.patchCollaborateurData(this.collaborateurToUpdate)
      .then((response) => {
        this.onGetCollaborateurs();
        this.showFormUpdateJobDescriptionForm = false;
        this.formUpdateJobDescription.reset();
        this.messageService.add({ severity: 'success', summary: 'Collaborateur', detail: 'Compétence mis à jour' });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour les compétences du collaborateur' }); });
  }

  // recuperation de l'historique des cra
  onGetHistoriqueCra(id: string) {
    this.dailyCheckService.getUserChecks(id)
      .then((response) => {
        this.historiqueCra = response;
        console.log(response)
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })
  }


  // méthode d'upload de fichier
  FileUploadPJ(event: [File]) {
    if (event != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.mailTypeSelected?._id)
      formData.append('file', event[0])
      this.emailTypeService.uploadPJ(formData).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.piece_jointes[this.piece_jointes.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  onAddPj() {
    this.piece_jointes.push({ date: new Date(), nom: "Téléverser le fichier s'il vous plaît", path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  // méthode d'initialisation de la vue envoi de mail
  onInitEmailView(collaborateur: Collaborateur): void {
    this.collaborateurToUpdate = collaborateur;
    const { user_id }: any = this.collaborateurToUpdate;

    this.emailTypeService.HEgetAllTo(user_id._id).subscribe(data => {
      this.historiqueEmails = data
      console.log(data, user_id._id)
    });

    this.emailTypeService.getAll().subscribe(data => {
      data.forEach(val => {
        this.mailDropdown.push({ label: val.email, value: val })
      })
    });

    this.emailTypeService.MTgetAll().subscribe(data => {
      data.forEach(e => {
        this.mailTypeDropdown.push({ label: e.objet, value: e })
      })
    })

    this.showEmailView = true;
  }

  downloadPJFile(pj) {
    this.emailTypeService.downloadPJ(this.mailTypeSelected?._id, pj._id, pj.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, pj.path)
    }, (error) => {
      console.error(error)
    })
  }

  onUploadPJ(uploadFilePJ) {
    if (uploadFilePJ?.nom && uploadFilePJ.nom != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFile').click();
      this.uploadFilePJ = uploadFilePJ
    } else {
      this.messageService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }
  }

  onDeletePJ(ri) {
    delete this.piece_jointes[ri];
  }

  onMailType(event: MailType) {
    this.formEmailType.patchValue({
      ...event
    })
    this.piece_jointes = event.pieces_jointe
    this.mailTypeSelected = event
  }

  onEmailPerso() {

    const { user_id }: any = this.collaborateurToUpdate;

    this.emailTypeService.sendPerso({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: user_id.email, send_from: this.formEmailPerso.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.emailTypeService.HEcreate({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: user_id._id, send_from: this.formEmailPerso.value.send_from.email }).subscribe(data2 => {
        this.formEmailPerso.reset()
        this.historiqueEmails.push(data2)
        console.log(data2)
        this.messageService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }

  onEmailType() {
    const { user_id }: any = this.collaborateurToUpdate;
    this.emailTypeService.sendPerso({ ...this.formEmailType.value, send_by: this.token.id, send_to: user_id.email_perso, send_from: this.formEmailType.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.emailTypeService.HEcreate({ ...this.formEmailType.value, send_by: this.token.id, send_to: user_id._id, send_from: this.formEmailType.value.send_from.email }).subscribe(data2 => {
        this.formEmailType.reset()
        this.historiqueEmails.push(data2)
        this.messageService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }


  seeFile: User
  clickUploadFile(user: User) {
    this.seeFile = user
  }

  downloadRHFile(doc) {
    this.UserService.downloadRH(this.seeFile._id, doc._id, doc.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  uploadFileRH
  FileUploadRH(event: [File]) {
    if (event != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('filename', this.uploadFileRH.filename)
      formData.append('_id', this.uploadFileRH._id)
      formData.append('path', event[0].name)
      formData.append('file', event[0])
      this.UserService.uploadRH(formData).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.seeFile.documents_rh[this.seeFile.documents_rh.indexOf(this.uploadFileRH)].path = event[0].name
        this.uploadFileRH = null;
        this.UserService.update({ documents_rh: this.seeFile.documents_rh, _id: this.seeFile._id }).subscribe(u => { })
        //this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  onAddRH() {
    this.seeFile.documents_rh.push({ date: new Date(), filename: "Téléverser le fichier s'il vous plaît", _id: new mongoose.Types.ObjectId().toString() })
  }
  onUploadRH(uploadFileRH) {
    if (uploadFileRH?.filename && uploadFileRH.filename != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFileRH').click();
      this.uploadFileRH = uploadFileRH
    } else {
      this.messageService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }
  }

  onDeleteRH(ri) {
    delete this.seeFile.documents_rh[ri];
  }

  saveRH() {
    this.UserService.update({ documents_rh: this.seeFile.documents_rh, _id: this.seeFile._id }).subscribe(u => {
      this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Les fichiers ont bien été sauvegardé' });
    }, err => {
      console.error(err)
    })
  }

  displayConge = false
  dataConge: Collaborateur;
  nbrConge = 0
  onInitConge(collaborateur: Collaborateur) {
    this.displayConge = true
    this.dataConge = collaborateur
    this.congeService.getAllByUserId(this.dataConge.user_id._id)
      .then((response) => {
        let nb = 0
        response.forEach(c => {
          nb += c.nombre_jours
        })
        this.nbrConge = nb
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Liste des congés', detail: "Impossible de recuprer vos demande de congé, veuillez contacter un admin via le service ticketing" }) });
  }

  onUpdateConge() {
    this.rhService.patchCollaborateurData({ _id: this.dataConge._id, conge_nb: this.dataConge.conge_nb, plafond: this.dataConge.plafond }).then(c => { })
  }

  calculDay(): number {
    var Difference_In_Time = new Date(this.dataConge.date_demarrage).getTime() - new Date().getTime();
    return Math.floor(Math.abs(Difference_In_Time / (1000 * 3600 * 24)) + 1);
  }

  afficherAnciennete(coll) {
    var Difference_In_Time = new Date(coll.date_demarrage).getTime() - new Date().getTime();
    return Math.floor(Math.abs(Difference_In_Time / (1000 * 3600 * 24)) + 1);
  }

  calcCPA(): number {
    return Math.floor((this.dataConge.conge_nb * this.calculDay()) / 30)
  }

  seeCalendar(c: Collaborateur) {
    this.router.navigate(['rh/calendrier', c.user_id._id])
  }

  clickDetails(r: Collaborateur) {
    this.displayDetails = true
    this.dataCollab = r
  }

  displayDetails = false
  dataCollab: Collaborateur
  addOther() {
    this.dataCollab.other.push({ _id: new mongoose.Types.ObjectId().toString(), title: '', description: '' })
  }
  onDeleteRow(ri) {
    this.dataCollab.other.splice(ri, 1)
    this.rhService.patchCollaborateurData({ ...this.dataCollab }).then(r => { })
  }
  onUpdateRow() {
    this.rhService.patchCollaborateurData({ ...this.dataCollab }).then(r => { })
  }

  testDate(date: string) {
    let db = new Date(date)
    db.setMonth(db.getMonth() + 5)
    return db.getTime() < new Date().getTime()
  }

}