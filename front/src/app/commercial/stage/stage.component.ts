import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Campus } from 'src/app/models/Campus';
import { Diplome } from 'src/app/models/Diplome';
import { Entreprise } from 'src/app/models/Entreprise';
import { Etudiant } from 'src/app/models/Etudiant';
import { Stage } from 'src/app/models/Stage';
import { Tuteur } from 'src/app/models/Tuteur';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { StageService } from 'src/app/services/stage.service';
import { TuteurService } from 'src/app/services/tuteur.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  stages: Stage[];
  stageToUpdate: Stage;

  formAdd: FormGroup;
  showFormAdd: boolean;
  formUpdate: FormGroup;
  showFormUpdate: boolean;
  formAddDoc: FormGroup;
  showFormAddDoc: boolean;
  formUpdateStatus: FormGroup;
  showFormUpdateStatus: boolean;

  // liste des status du stage
  statusList: any[];

  // parties liste des filtres
  statusFilters: any[];
  commercialFilters: any[]; // utilisé pour les filtres et pour la dropdown liste des commerciaux
  campusFilters: any[];
  certificateFilters: any[];

  // autres variables
  token: any;
  students: any[];
  enterprises: any[];
  tuteurs: any[];
  anneeScolaires: any[];
  actualDirectorId: string; // représente à chaque fois l'id du directeur de l'entreprise sélectionné lors de l'ajout et de la modif de stage
  doc: any; // représente le document à uploader
  fileTypeList: any[]; // liste des fichiers pour l'upload de document

  constructor(private router: Router, private tuteurService: TuteurService, private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private stageService: StageService, private messageService: MessageService, private etudiantService: EtudiantService, private userService: AuthService, private campusService: CampusService, private diplomeService: DiplomeService) { }

  ngOnInit(): void {
    this.messageService.add({severity: 'info', summary: 'Stages', detail: 'Recuperation de la liste des stages'});
    this.stages               = [];
    this.students             = [];
    this.showFormAdd          = false;
    this.showFormUpdate       = false;
    this.showFormAddDoc       = false;
    this.showFormUpdateStatus = false;

    // initialisation des années scolaires
    this.anneeScolaires = [
      { label: '2021-2022', value: '2021-2022' },
      { label: '2022-2023', value: '2022-2023' },
      { label: '2023-2024', value: '2023-2024' },
      { label: '2024-2025', value: '2024-2025' },
      { label: '2025-2026', value: '2025-2026' },
    ];

    // initialisations de la liste des status
    this.statusList = [
      { label: 'Choisir le status du contrat', value: null },
      { label: '1- Conclu', value: 'Conclu' },
      { label: '2- Champs requis', value: 'Champs requis' },
      { label: '3- Établie', value: 'Établie' },
      { label: '4- Signé', value: 'CSigné' },
      { label: '5- Fini', value: 'Fini' },
    ];

    // initialisation des données de filtres sur les status
    this.statusFilters = [
      { label: 'Tous les status', value: null },
      { label: '0- Crée', value: 'Crée' },
      { label: '1- Conclu', value: 'Conclu' },
      { label: '2- Champs requis', value: 'Champs requis' },
      { label: '3- Établie', value: 'Établie' },
      { label: '4- Signé', value: 'CSigné' },
      { label: '5- Fini', value: 'Fini' },
    ];

    // initialisation de la liste des fichiers pour l'upload
    this.fileTypeList = [
      { label: '-Choisir le type de fichier-', value: null },
      { label: 'Attestation de stage', value: 'Attestation de stage' },
      { label: 'Convention de stage', value: 'Convention de stage' },
      { label: 'Avenant du stage', value: 'Avenant du stage' }
    ];

    // initialisation de la liste des données
    this.onGetAllDatas();

    // initialisation du formulaire d'ajout de stage
    this.formAdd = this.formBuilder.group({
      student_id:         ['', Validators.required],
      enterprise_id:      ['', Validators.required],
      tutor_id:           ['', Validators.required],
      begin_date:         ['', Validators.required],
      end_date:           ['', Validators.required],
      schedules_per_week: ['', Validators.required],
      commercial_id:      [''],
      mission_tasks:      ['', Validators.required],
      gratification:      ['', Validators.required],
      payment_modality:   ['', Validators.required],
      other_advantages:   [''],
      school_year:        ['', Validators.required],
    });

    // initialisation du formulaire de modification d'un stage
    this.formUpdate = this.formBuilder.group({
      student_id:         ['', Validators.required],
      enterprise_id:      ['', Validators.required],
      tutor_id:           ['', Validators.required],
      begin_date:         ['', Validators.required],
      end_date:           ['', Validators.required],
      schedules_per_week: ['', Validators.required],
      commercial_id:      [''],
      mission_tasks:      ['', Validators.required],
      gratification:      ['', Validators.required],
      payment_modality:   ['', Validators.required],
      other_advantages:   [''],
      school_year:        ['', Validators.required],
    });

    // initialisation du formulaire d'upload de fichier
    this.formAddDoc = this.formBuilder.group({
      fileType: ['', Validators.required],
    });

    // initialisation du formulaire de mise à jour du status
    this.formUpdateStatus = this.formBuilder.group({
      status: ['', Validators.required],
    });
  }


  // méthode de recuperation des classes
  onGetAllDatas(): void
  {
    // recuperation de la liste des stages
    this.stageService.getStages()
    .then((response) => {
      this.stages = [];
      response.forEach((stage: Stage) => {
        this.stages.push(stage);
      });
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Stages', detail: error.errorMsg }); });

    // recuperation de la liste des étudiants
    this.etudiantService.getAllEtudiantPopulate().subscribe({
      next: (response) => {
        this.students = [{label: "--Veuillez choisir un étudiant--", value: null}];
        response.forEach((student: Etudiant) => {
          let {user_id}: any = student;
          let studentData = {label: `${user_id.firstname} ${user_id.lastname}`, value: student._id};
          this.students.push(studentData);
        });
      },
      error: (error) => { this.messageService.add({severity: 'error', summary: 'Étudiant', detail: 'Impossible de récupérer la liste des étudiants'}) }
    });

    // recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe({
      next: (response) => {
        this.enterprises = [{label: '--Veuillez choisir une entreprise--', value: null}];
        response.forEach((entreprise: Entreprise) => {
          this.enterprises.push({label: entreprise.r_sociale, value: entreprise._id});
        });
      },
      error: (error) => { this.messageService.add({severity: 'error', summary: 'Entreprise', detail: 'Impossible de récupérer la liste des entreprises, veuillez contacter un administrateur'}) },
    });

    // recuperation de la liste des commerciaux et remplissage du tableau de filtres commerciales
    this.userService.getAllCommercialV2().subscribe({
      next: (response) => {
        this.commercialFilters = [{label: 'Tous les commerciaux', value: null}];
        response.forEach((commercial: User) => {
          let commercialData = {label: `${commercial.firstname} ${commercial.lastname}`, value: commercial._id};
          this.commercialFilters.push(commercialData);
        });
      },
      error: (error) => { this.messageService.add({severity: 'error', summary: 'Liste des commerciaux', detail: 'Impossible de récupérer la liste des commerciaux, veuillez contacter un administrateur.'}) },
    });

    // recuperation de la liste des campus pour les filtres
    this.campusService.getAllPopulate().subscribe({
      next: (response) => {
        this.campusFilters = [{label: 'Tous les campus', value: null}];
        response.forEach((campus: Campus) => {
          let campusData = {label: campus.libelle, value: campus._id};
          this.campusFilters.push(campusData);
        });
      },
      error: (error) => {this.messageService.add({severity: 'error', summary: 'Liste des campus', detail: 'Impossible de récupérer la liste des campus, veuillez contacter un administrateur.'})},
    });

    // recuperation de la liste des diplômes
    this.diplomeService.getAll().subscribe({
      next: (response) => {
        this.certificateFilters = [{label: 'Toutes les formations', value: null}];
        response.forEach((diplome: Diplome) => {
          let certificateData = {label: diplome.titre, value: diplome._id} ;
          this.certificateFilters.push(certificateData);
        });
      },
      error: (error) => {this.messageService.add({severity: 'error', summary: 'Liste des formations', detail: 'Impossible de récupérer la liste des campus, veuillez contacter un administrateur.'});},
    });
  }


  // méthode de chargement de la liste des tuteurs d'une entreprise
  onLoadTutors(event: any): void
  {
    this.tuteurs = [{label: '--Veuillez choisir le tuteur--', value: null}];
    // recuperation du ceo de l'entreprise
    this.entrepriseService.getByIdPopulate(event.value).subscribe({
      next: (entreprise: Entreprise) => {
        this.tuteurService.getAllByEntrepriseId(event.value).subscribe({
          next: (response: Tuteur[]) => {
            let {directeur_id}: any = entreprise;
            let enterpriseCeoData = {label: `${directeur_id.firstname} ${directeur_id.lastname}`, value: directeur_id._id}
            this.tuteurs.push(enterpriseCeoData);
            // affectation de l'id du ceo à la variable actualDirectorId
            this.actualDirectorId = directeur_id._id;
            response.forEach((tuteur: Tuteur) => {
              let {user_id}: any = tuteur;
              let tutorData = {label: `${user_id.firstname} ${user_id.lastname}`, value: tuteur._id};
              this.tuteurs.push(tutorData);
            });
          },
          error: (error) => { this.messageService.add({severity: 'error', summary: 'Tuteurs', detail: 'Impossible de récupérer la liste des tuteurs, veuillez contacter un administrateur'}); }
        });
      },
      error: (error: any) => { this.messageService.add({severity: 'error', summary: 'Entreprise', detail: "Impossible de récupérer l'entreprise sélectionné, veuillez contacter un administrateur"}); }
    });
  }


  // méthode d'ajout d'un stage
  onAdd(): void
  {
    const formValue = this.formAdd.value;
    const stage = new Stage();

    stage.student_id = formValue.student_id;
    stage.enterprise_id = formValue.enterprise_id;
    if(this.actualDirectorId == formValue.tutor_id)
    {
      stage.tutor_id = null;
      stage.director_id = formValue.tutor_id;
    } else {
      stage.director_id = null;
      stage.tutor_id = formValue.tutor_id;
    }
    stage.begin_date = formValue.begin_date;
    stage.end_date = formValue.end_date;
    stage.schedules_per_week = formValue.schedules_per_week;
    formValue.commercial_id == '' ? stage.commercial_id = null : stage.commercial_id = formValue.commercial_id;
    stage.mission_tasks = formValue.mission_tasks;
    stage.gratification = formValue.gratification;
    stage.payment_modality = formValue.payment_modality;
    stage.other_advantages = formValue.other_advantages;
    stage.status = 'Crée';
    stage.school_year = formValue.school_year;
    

    this.stageService.postStage(stage)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Stage', detail: response.successMsg});
      this.onGetAllDatas();
      this.formAdd.reset();
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Stage', detail: error.error.errorMsg}); });
  }


  // méthode de remplissage du formulaire de mise à jour d'un stage
  onPatchFormUpdate(stage: Stage): void
  {
    this.stageToUpdate = stage;
    let {student_id}: any = stage;
    let {enterprise_id}: any = stage;
    let {tutor_id}: any = stage;
    let {commercial_id}: any = stage;
    
    this.formUpdate.patchValue({
      student_id: {label: `${student_id.user_id?.firstname} ${student_id.user_id?.lastname}`, value: student_id._id},
      // enterprise_id: { label: enterprise_id.r_sociale, value: enterprise_id._id },
      // tutor_id: { label: `${tutor_id.user_id?.firstname} ${tutor_id.user_id?.lastname}`, value: tutor_id._id },
      // begin_date: stage.begin_date,
      // end_date: stage.end_date,
      schedules_per_week: stage.schedules_per_week,
      commercial_id: {label: `${commercial_id?.firstname} ${commercial_id?.lastname}`, value: commercial_id?._id},
      mission_tasks: stage.mission_tasks,
      gratification: stage.gratification,
      payment_modality: stage.payment_modality,
      other_advantages: stage.other_advantages,
      school_year: stage.school_year,
    });

    this.showFormUpdate = true;
  }


  //  méthode de mise à jour d'un stage
  onUpdate(): void
  {
    const formValue = this.formUpdate.value;
    const stage = new Stage();

    stage._id                 = this.stageToUpdate._id;
    stage.student_id          = formValue.student_id;
    stage.enterprise_id       = formValue.enterprise_id;
    if(this.actualDirectorId == formValue.tutor_id)
    {
      stage.tutor_id    = null;
      stage.director_id = formValue.tutor_id;
    } else {
      stage.director_id = null;
      stage.tutor_id    = formValue.tutor_id;
    }
    stage.begin_date          = formValue.begin_date;
    stage.end_date            = formValue.end_date;
    stage.schedules_per_week  = formValue.schedules_per_week;
    formValue.commercial_id == '' ? stage.commercial_id = null : stage.commercial_id = formValue.commercial_id;
    stage.mission_tasks       = formValue.mission_tasks;
    stage.gratification       = formValue.gratification;
    stage.payment_modality    = formValue.payment_modality;
    stage.other_advantages    = formValue.other_advantages;
    stage.status              = this.stageToUpdate.status;
    stage.school_year         = formValue.school_year;

    this.stageService.putStage(stage)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Stage', detail: response.successMsg});
      this.onGetAllDatas();
      this.formUpdate.reset();
      this.showFormUpdate = false;
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Stage', detail: error.error.errorMsg}); });
  }


  // méthode de selection du fichier
  onSelectFile(event: any): void
  {
    if(event.target.files.length > 0)
    {
      this.doc = event.target.files[0];
    }
  }

  // méthode d'upload des fichiers
  onUploadDoc(): void
  {
    const fileType = this.formAddDoc.value.fileType;
    let formData = new FormData();
    formData.append('id', this.stageToUpdate._id); 
    formData.append('file', this.doc); 

    switch(fileType)
    {
      case 'Attestation de stage':
        this.stageService.uploadAttestation(formData)
        .then((response) => {
          this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        })
        .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
        this.onGetAllDatas();
        break;
      case 'Convention de stage':
        this.stageService.uploadConvention(formData)
        .then((response) => {
          this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        })
        .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
        this.onGetAllDatas();
        break;
      case 'Avenant du stage':
        this.stageService.uploadAvenant(formData)
        .then((response) => {
          this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        })
        .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
        this.onGetAllDatas();
        break;
      default:
        this.onGetAllDatas();
        break;
    }
  }

  // méthode de téléchargement des fichiers
  onDownloadDoc(docName: string, idStage: string): void
  {
    switch(docName)
    {
      case 'convention':
        this.stageService.downloadConvention(idStage)
        .then((response: Blob) => {
          let downloadUrl = window.URL.createObjectURL(response);
          saveAs(downloadUrl, `convention_stage.${response.type.split('/')[1]}`);
          this.messageService.add({ severity: "success", summary: "Convention de stage", detail: `Téléchargement réussi` });
        })
        .catch((error) => { this.messageService.add({ severity: "error", summary: 'Convention de stage', detail: 'Impossible de télécharger le fichier' }); });

        break;
      case 'avenant':
        this.stageService.downloadAvenant(idStage)
        .then((response: Blob) => {
          let downloadUrl = window.URL.createObjectURL(response);
          saveAs(downloadUrl, `attestation_stage.${response.type.split('/')[1]}`);
          this.messageService.add({ severity: "success", summary: "Attestation de stage", detail: `Téléchargement réussi` });
        })
        .catch((error) => { this.messageService.add({ severity: "error", summary: 'Attestation de stage', detail: 'Impossible de télécharger le fichier' }); });

        break;
      case 'attestation':
        this.stageService.downloadAttestation(idStage)
        .then((response: Blob) => {
          let downloadUrl = window.URL.createObjectURL(response);
          saveAs(downloadUrl, `attestation_stage.${response.type.split('/')[1]}`);
        })
        .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Attestation de stage', detail: 'Impossible de télécharger le fichier' }); });

        break;
      default:
        break;
    }
  }


  // méthode d'affichage du formulaire de mise à jour du status
  onShowFormUpdateStatus(): void
  {
    this.showFormUpdateStatus = true;
  }


  // méthode de modification du statut d'un stage
  onUpdateStatus(): void
  {
    const status = this.formUpdateStatus.value.status;
    let {commercial_id}: any = this.stageToUpdate;
    
    this.stageService.patchStatus(this.stageToUpdate._id, commercial_id?.email, status)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Statut', detail: response.successMsg});
      this.showFormUpdateStatus = false;
      this.onGetAllDatas();
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Statut', detail: error.error.errorMsg}); })
  }


  // méthode de redirection vers la page des assiduités
  showPresence(id: string): void
  {
    this.router.navigate(["details/" + id]);
  }

}
