import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/models/Entreprise';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { saveAs } from 'file-saver';
import { ClasseService } from 'src/app/services/classe.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

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
  contractToUpdate: ContratAlternance;

  // entreprise sélectionnée
  entrepriseSelected: Entreprise;

  formRemarque: UntypedFormGroup;
  showFormRemarque: boolean = false;

  token: any;

  constructor(private router: Router, private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService, private classeService: ClasseService, private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des entreprises du CEO connecté
    this.entrepriseService.getEntreprisesByIdCEO(this.token.id)
    .then((response) => { this.entreprises = response; this.loading = false;})
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Entreprise', detail: error.error }); });

    // méthode d'initialisation du formulaire des remarques
    this.formRemarque = this.formBuilder.group({
      remarque: ['', Validators.required],
    });
  }

  // Méthode de recuperation des alternants de l'entreprise
  onLoadContracts(entreprise: Entreprise): void
  {
    this.entrepriseSelected = entreprise;

    this.entrepriseService.getAllContratsbyEntreprise(entreprise._id).subscribe({
      next: (response) => { 
        this.contracts = response; 
        this.showContractForEnterprise = true; 
      },
      error: (error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.error }); },
      complete: () => { console.log('Liste des contrats récupéré')}
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

  // methode de téléchargement de l'accord de prise en charge
  onDownloadAccordPriseEnCharge(id: string): void
  {
    this.entrepriseService.getAccord(id)
    .then((response: Blob) => {
      let downloadUrl = window.URL.createObjectURL(response);
      saveAs(downloadUrl, `accord_prise_charge.${response.type.split('/')[1]}`);
      this.messageService.add({ severity: "success", summary: "Accord de prise en charge", detail: `Téléchargement réussi` });
    })
    .catch((error) => { this.messageService.add({ severity: "error", summary: "Accord de prise en charge", detail: `Impossible de télécharger le fichier` }); });
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
