import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contrats-tutelle-ceo',
  templateUrl: './contrats-tutelle-ceo.component.html',
  styleUrls: ['./contrats-tutelle-ceo.component.scss']
})
export class ContratsTutelleCeoComponent implements OnInit {

  contracts: ContratAlternance[] = [];
  token: any;

  constructor(private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des contrat sous la tutelle du ceo
    this.entrepriseService.getContratsByCeo(this.token.id)
    .then((response) => { 
      this.contracts = response.contrats;
      this.messageService.add({ severity: 'success', summary:'Contrats', detail: response.success });
    })
    .catch((error) => { console.log(error.error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.errorMsg }); });
  }

  // méthode de téléchargement du calendrier de la formation
  onDownloadCalendar(id: string): void
  {
    this.entrepriseService.getCalendar(id)
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

}
