import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entreprise } from 'src/app/models/Entreprise';
import { Stage } from 'src/app/models/Stage';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { StageService } from 'src/app/services/stage.service';
import { TuteurService } from 'src/app/services/tuteur.service';
import jwt_decode from "jwt-decode";
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-stage-ceo',
  templateUrl: './stage-ceo.component.html',
  styleUrls: ['./stage-ceo.component.scss']
})
export class StageCeoComponent implements OnInit {

  entreprises: Entreprise[];
  stages: Stage[];
  stageToUpdate: Stage;
  doc: any;
  showStagesForEnterprises: boolean;
  showFormAddDoc: boolean;
  formAddDoc: FormGroup;

  // variables qui définit un chargement pour la tables des entreprises
  loading: boolean;

  token: any;
  fileTypeList: any[];

  constructor(private router: Router, private tuteurService: TuteurService, private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private stageService: StageService, private messageService: MessageService, private etudiantService: EtudiantService, private userService: AuthService, private campusService: CampusService, private diplomeService: DiplomeService) { }

  ngOnInit(): void {
    this.loading = true;
    this.showStagesForEnterprises = false;
    this.token = jwt_decode(localStorage.getItem('token'));
    this.showFormAddDoc = false;

    // initialisation de la liste des fichiers pour l'upload
    this.fileTypeList = [
      { label: '-Choisir le type de fichier-', value: null },
      { label: 'Attestation de stage', value: 'Attestation de stage' },
      { label: 'Convention de stage', value: 'Convention de stage' },
      { label: 'Avenant du stage', value: 'Avenant du stage' }
    ];

    // récupération de la liste des données nécessaires
    this.onGetAllDatas();

    // initialisation du formulaire d'upload de fichier
    this.formAddDoc = this.formBuilder.group({
      fileType: ['', Validators.required],
    });
  }

  // méthode de récupération de la liste des données
  onGetAllDatas(): void
  {
    // initialisation du formulaire d'upload de fichier
    this.formAddDoc = this.formBuilder.group({
      fileType: ['', Validators.required],
    });
    
    // recuperation de la liste des entreprises
    this.entrepriseService.getEntreprisesByIdCEO(this.token.id)
    .then((response) => { this.entreprises = response; this.loading = false;})
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Entreprise', detail: error.error }); });
  }

  // récupération de la liste des stage d'une entreprises
  onLoadContracts(entreprise: Entreprise): void
  {
    // recuperation de la liste des stages
    this.stageService.getStageByEnterpriseId(entreprise._id)
    .then((response) => {
      this.stages = [];
      response.forEach((stage: Stage) => {
        this.stages.push(stage);
      });
      this.showStagesForEnterprises = true;
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Stages', detail: error.errorMsg }); });
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
  
  // méthode de redirection vers la page des assiduités
  showPresence(id: string): void
  {
    this.router.navigate(["details/" + id]);
  }
}
