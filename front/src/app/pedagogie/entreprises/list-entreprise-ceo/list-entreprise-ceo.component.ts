import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/models/Entreprise';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-entreprise-ceo',
  templateUrl: './list-entreprise-ceo.component.html',
  styleUrls: ['./list-entreprise-ceo.component.scss']
})
export class ListEntrepriseCeoComponent implements OnInit {

  loading:boolean = true;
  entreprises: Entreprise[] = [];
  contracts: ContratAlternance[] = [];
  showContractForEnterprise: boolean = false;

  // entreprise selectionné
  entrepriseSelected: Entreprise;

  token: any;

  constructor(private router: Router, private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des entreprises du CEO connecté
    this.entrepriseService.getEntreprisesByIdCEO(this.token.id)
    .then((response) => { this.entreprises = response; this.loading = false;})
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Entreprise', detail: error.error }); })
  }

  // Methode de recuperation des alternants de l'entreprise
  onLoadContracts(entreprise: Entreprise): void
  {
    this.entrepriseSelected = entreprise;

    this.entrepriseService.getAllContratsbyEntreprise(entreprise._id).subscribe({
      next: (response) => { 
        this.contracts = response; 
        this.showContractForEnterprise = true; 
      },
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.error }); },
      complete: () => { console.log('Liste des contrats récuperé')}
    });
  }

  // methode de edirection vers la liste des présences
  showPresence(alternant_id: String): void 
  {
    this.router.navigate(["details/" + alternant_id]);
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
