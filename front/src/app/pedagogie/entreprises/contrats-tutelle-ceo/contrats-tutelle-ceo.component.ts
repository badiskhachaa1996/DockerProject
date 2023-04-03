import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { saveAs } from 'file-saver';
import { ClasseService } from 'src/app/services/classe.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contrats-tutelle-ceo',
  templateUrl: './contrats-tutelle-ceo.component.html',
  styleUrls: ['./contrats-tutelle-ceo.component.scss']
})
export class ContratsTutelleCeoComponent implements OnInit {

  contracts: ContratAlternance[] = [];
  showContractForEnterprise: boolean = false;
  contractToUpdate: ContratAlternance;

  formRemarque: FormGroup;
  showFormRemarque: boolean = false;
  token: any;

  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService, private classeService: ClasseService) { }

  ngOnInit(): void {
    // décodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des contrat sous la tutelle du ceo
    this.entrepriseService.getContratsByCeo(this.token.id)
    .then((response) => {
      this.contracts = response.contrats;
      this.messageService.add({ severity: 'success', summary:'Contrats', detail: response.success });
    })
    .catch((error) => { console.log(error.error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.errorMsg }); });
  
    // méthode d'initialisation du formulaire des remarques
    this.formRemarque = this.formBuilder.group({
      remarque: ['', Validators.required],
    });
  }

  // méthode de téléchargement du calendrier de la formation
  onDownloadCalendar(id: string): void
  {
    this.classeService.downloadCalendar(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `calendrier.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Calendrier", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Calendrier", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement du cerfa
  onDownloadCerfa(id: string): void
  {
    this.entrepriseService.getCerfa(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `cerfa.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Cerfa", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Cerfa", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la convention
  onDownloadConvention(id: string): void
  {
    this.entrepriseService.getConvention(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `convention.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Convention", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Convention", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la résiliation
  onDownloadResiliation(id: string): void
  {
    this.entrepriseService.getResiliation(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `resiliation.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Resiliation", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Resiliation", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la rélance
  onDownloadRelance(id: string): void
  {
    this.entrepriseService.getRelance(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `relance.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Relance", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Relance", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de pre-remplissage du formulaire des remarques
  onPatchValueRemarque(): void
  {
    this.formRemarque.patchValue({ remarque: this.contractToUpdate.remarque });
  }

  // méthode de mise à jur de la remarque d'un contrat d'alternance
  onUpdateRemarque(): void
  {
    const remarque = this.formRemarque.value.remarque;
    
    this.entrepriseService.patchRemarque(this.contractToUpdate._id, remarque)
    .then((response) => { 
      this.messageService.add({ severity: 'success', summary: 'Remarques', detail: "Remarque mis à jour'" }); 
      this.formRemarque.reset();
      this.showFormRemarque = false;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Remarques', detail: "Impossible de prendre en compte cette remarque" }); });
  }

}
