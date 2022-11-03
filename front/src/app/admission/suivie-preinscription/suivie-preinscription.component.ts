import { Component, OnInit, ViewChild } from '@angular/core';

import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';

@Component({
  selector: 'app-suivie-preinscription',
  templateUrl: './suivie-preinscription.component.html',
  styleUrls: ['./suivie-preinscription.component.scss']
})
export class SuiviePreinscriptionComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;

  ecoleProspect: any;
  subscription: Subscription;
  ListDocuments: String[] = [];
  ListPiped: String[] = [];

  ProspectConnected: Prospect = {};

  diplomeTest: boolean = false;
  piece_identiteTest: boolean = false;
  CVTest: boolean = false;
  LMTest: boolean = false;
  RdNTest: boolean = false;
  RdNTest2: boolean = false;
  TCFTest: boolean = false;
  codeCommercial;
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
    { value: 'Carte_vitale', label: 'Carte vitale', },
    { value: 'Carte_sejour', label: "Carte séjour" },
    { value: 'Carte_etudiant', label: "Carte étudiant" },
    { value: 'Attestation_scolarite', label: 'Attestation de scolarité' },
    { value: 'Attestation_travail', label: 'Attestation de travaille' },
    { value: 'Visa', label: "Visa" },
    { value: "Justificatif_Sportif_Haut_Niveau", label: "Justificatif Sportif Haut Niveau" }
  ];

  DocTypes2: any[] = [
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];

  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })
  constructor(private router: Router, private messageService: MessageService, private admissionService: AdmissionService) { }

  ngOnInit(): void {

    this.codeCommercial = localStorage.getItem("CommercialCode")

    this.ProspectConnected = jwt_decode(localStorage.getItem('ProspectConected'))['prospectFromDb'];

    this.ecoleProspect = this.ProspectConnected.type_form


    this.router.navigate(['/login'])


    this.admissionService.getFiles(this.ProspectConnected._id).subscribe(

      (data) => {
        this.ListDocuments = data

        for (let doc of this.ListDocuments) {

          let docname: string = doc.replace("/", ": ").replace('releve_notes1', '1er relevé de notes ').replace('releve_notes2', '2ème relevé de notes').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
          this.ListPiped.push(docname)
          if (doc.includes('diplome/')) {
            this.diplomeTest = true;
          }
          if (doc.includes('piece_identite/')) {
            this.piece_identiteTest = true;
          }
          if (doc.includes('CV/')) {
            this.CVTest = true;
          }
          if (doc.includes('LM/')) {
            this.LMTest = true;
          }
          if (doc.includes('releve_notes1/')) {
            this.RdNTest = true;
          }
          if (doc.includes('releve_notes2/')) {
            this.RdNTest2 = true;
          }
          if (doc.includes('TCF/')) {
            this.TCFTest = true;
          }

        }
      },
      (error) => { console.error(error) }
    );


  }

  resetAuth() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  comeBack() {
    localStorage.removeItem('ProspectConected');
    this.router.navigateByUrl('/gestion-preinscriptions/' + this.codeCommercial)
  }



  FileUpload(event, doc: string) {
    let docname: string = doc.replace("/", ": ").replace('releve_notes1', '1er relevé de notes ').replace('releve_notes2', '2ème relevé de notes').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
    this.messageService.add({ severity: 'info', summary: 'Fichier en cours d\envoi', detail: docname + ' en cours d\'upload\nVeuillez Patientez' });
    let formData = new FormData();
    formData.append('id', this.ProspectConnected._id);
    formData.append('document', doc);
    formData.append('file', event.files[0]);
    this.admissionService.uploadFile(formData, this.ProspectConnected._id, 'ProspectConected').subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: docname + ' a été envoyé' });
      if (doc.includes('diplome')) {
        this.diplomeTest = true;
      }
      else if (doc.includes('piece_identite')) {
        this.piece_identiteTest = true;
      }
      else if (doc.includes('CV')) {
        this.CVTest = true;
      }
      else if (doc.includes('LM')) {
        this.LMTest = true;
      }
      else if (doc.includes('releve_notes1')) {
        this.RdNTest = true;
      }
      else if (doc.includes('releve_notes2')) {
        this.RdNTest2 = true;
      }
      else if (doc.includes('TCF')) {
        this.TCFTest = true;
      }
      if (this.diplomeTest && this.piece_identiteTest && this.CVTest && this.LMTest && this.RdNTest && this.RdNTest2 && this.TCFTest) {
        this.messageService.add({ severity: 'success', summary: 'Tous les documents ont été envoyés', detail: "Attendez la validation par un agent." });
      }
      if (this.ProspectConnected.etat_traitement != "Nouvelle") {
        this.admissionService.changeEtatTraitement(this.ProspectConnected._id, "Retour Etudiant", 'ProspectConected')
      }
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: doc, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });


    this.fileInput.clear()
    event.target = null;
  }

  changementVisa(value){
    console.log(value)
  }


}
