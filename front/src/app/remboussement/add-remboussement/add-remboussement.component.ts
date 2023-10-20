import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import {  FormBuilder, FormGroup } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { MessageService } from 'primeng/api';

import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';

import { User } from 'src/app/models/User';

import { environment } from 'src/environments/environment';

import jwt_decode from 'jwt-decode';

import { Demande } from 'src/app/models/Demande';

import { Router } from '@angular/router';

import { error } from 'console';

import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

 

@Component({

  selector: 'app-add-remboussement',

  templateUrl: './add-remboussement.component.html',

  styleUrls: ['./add-remboussement.component.scss']

})

export class AddRemboussementComponent implements OnInit {

 

  constructor(

    private formBuilder: FormBuilder,

    private http: HttpClient,

    private messageService: MessageService,

    private demandeRemboursementService: DemandeRemboursementService,

    private router: Router,

    private formationService : FormulaireAdmissionService

  ) {}

 

  civilitySelect = [

    { label: "Monsieur", value: "Monsieur" },

    { label: "Madame", value: "Madame" },

    { label: "Non Précisé", value: "Non précisé" },

]

 

ecoles = []

 

 

formations = []

 

annescolaires=[]

 

 

//TODO à rajouter au fichier env

motifs = [

    { label: "1"  },

    { label: "2" },

    { label: "3" },

    { label: "4" },

    { label: "5" },

    { label: "6"},

    { label: "7"},

]

 

token: any;

motif = environment.motif

 

modePaiement = environment.paymentType

 

documents = [

    { label: "RIB", value: "rib" },

    { label: "Attestion de paiement", value: "attestion_paiement" },

    { label: "Preuve de paiement", value: "preuve_paiement" },

    { label: "Document d'inscription", value: "document_inscription" },

    { label: "Notification de refus (ou autre justificatif)", value: "notification_ou_autre_justificatif" },

]

 

pays_residence = environment.pays

 

@Output() cancelFormOutPut = new EventEmitter<boolean>();

 

@Output() doneUpdating = new EventEmitter<boolean>();

 

 

@Input() currentDemande;

showUpdateForm = false;

 

formRembourssement: FormGroup;

 

 

 

 availableStatus = environment.availableStatus

 

 

user: User;

 

 

 

 

  ngOnInit(): void {

 

 

    this.formationService.FAgetAll().subscribe(data => {

 

     

      data.forEach(d => {

        this.formations.push({ label: d.nom, value: d.nom })

      })

 

    })

    this.formationService.RAgetAll().subscribe(data =>{

      data.forEach(d => {

        this.annescolaires.push({ label: d.nom, value: d._id })

      })

     

    })

 

    this.formationService.EAgetAll().subscribe(data => {

     

      data.forEach(d => {

        this.ecoles.push({ label: d.titre, value: d.url_form })

      })

    })

 

   

 

 

 

    this.formRembourssement =  this.formBuilder.group({

      civilite: [''],

      nom: [''],

      prenom: [''],

      date_naissance: [''],

      nationalite: [''],

      pays_resid: [''],

      paymentType: [''],

      indicatif_phone: [''],

      phone: [''],

      email: [''],

      annee_scolaire: [''],

      ecole: [''],

      formation: [''],

      motif_refus: [''],

      montant: [''],

      rib: [''],

      attestion_paiement: [''],

      preuve_paiement: [''],

      document_inscription: [''],

      notification_ou_autre_justificatif: [''],

    })

 

    if(this.currentDemande && this.showUpdateForm ) {

      this.chargeFormDate(this.currentDemande)

    }

   

    this.token = jwt_decode(localStorage.getItem('token'));

  }

  selectedDocument: string | null = null; // Variable pour stocker le document sélectionné

 

  onClickToAddFile(event: any, document_name: string) {

      event.preventDefault();

      this.selectedDocument = document_name;

      const fileInput = document.getElementById(document_name) as HTMLInputElement;

      fileInput.click();

  }

 

  onFileSelected(event: any) {

      if (!this.selectedDocument) {

          return;

      }

 

      const selectedFile = event.target.files[0];

      if (selectedFile && selectedFile.type === 'application/pdf') {

          this.formRembourssement.get(this.selectedDocument)?.setValue(selectedFile);

      } else {

          alert('Veuillez sélectionner un fichier PDF valide.');

      }

 

      // Réinitialiser la variable de document sélectionné après la sélection du fichier

      this.selectedDocument = null;

  }

  refundRequests: any[] = [];

  deleteDemande(){}

  // deleteDocument( documentId: string) {

  //   if (!documentId) {

  //     console.error('Invalid document ID');

  //     return;

  //   }

  //   this.demandeRemboursementService.deleteDemande(documentId ).subscribe(()=>

  //  {

  //   console.log('Doc deleted');

  //  },

  //  (error)=>{

  //   console.log('error',error)

  //  }

  //   )

  // }

  onSubmitRemboussementForm() {

 

    if (this.formRembourssement.invalid) {

      this.messageService.add({

        severity: 'error',

        summary: 'Error',

        detail: 'Form is incomplete or contains errors.'

      });

      return;

    };

 

    if(!this.showUpdateForm) {

      const demande  = new Demande

      demande.created_on = new Date;

      this.updateDemandeObject(demande, false)

   

    }  else {

      this.updateDemandeObject(this.currentDemande, true)

    }

 

  }

  cancelForm() {

    this.cancelFormOutPut.emit(true)

    this.showUpdateForm = false

    this.ngOnInit()

  }

 

 

  chargeFormDate(demande) {

    var indicatifLength = this.formRembourssement.value.indicatif_phone.length + 2;

    this.formRembourssement =  this.formBuilder.group({

      civilite: [demande.student?.civility],

      nom: [demande.student?.last_name],

      prenom: [demande.student?.first_name],

      date_naissance: [demande.student?.date_naissance],

      nationalite: [demande.student?.nationality],

      pays_resid: [demande.student?.country_residence],

      paymentType: [demande.refund?.method],

     indicatif_phone:[demande.student?.phone.slice(0, indicatifLength + 4)],

     phone:[demande.student?.phone.slice(indicatifLength + 4  )],

      email: [demande.student?.email],

      annee_scolaire: [ demande.training?.scholar_year],

      ecole: [ demande.training?.school],

      formation: [ demande.training?.name],

      motif_refus: [demande.motif],

      montant: [demande.refund?.montant],

      rib: [demande.docs?.rib],

      attestion_paiement: [demande.docs?.attestation_payement],

      preuve_paiement: [demande.docs?.preuve_payement],

      document_inscription: [demande.docs?.document_inscription],

      notification_ou_autre_justificatif: [demande.docs?.autres_doc],

    })

  }

 

 

  updateDemandeObject(demande, update) {

 

    console.log(this.formRembourssement.value)

    demande.created_by = this.token.id

    demande.motif = this.formRembourssement.value.motif_refus

    demande.student = {

     civility: this.formRembourssement.value.civilite,

     last_name:this.formRembourssement.value.nom,

     first_name:this.formRembourssement.value.prenom,

     date_naissance: this.formRembourssement.value.date_naissance,

     nationality:  this.formRembourssement.value.nationalite,

     country_residence: this.formRembourssement.value.pays_resid ,

     indicatif_phone: this.formRembourssement.value.indicatif_phone,

     phone: "(" + this.formRembourssement.value.indicatif_phone + ")" + this.formRembourssement.value.phone,

     email:  this.formRembourssement.value.email,

   },

   demande.training = {

     scholar_year :this.formRembourssement.value.annee_scolaire,

     school:this.formRembourssement.value.ecole,

     name:this.formRembourssement.value.formation?.value,

   }

   demande.refund ={

     montant:this.formRembourssement.value.montant,

     method:this.formRembourssement.value.paymentType

   }

 

demande.docs={

       rib: this.formRembourssement.value.rib ?

       {

         added_on: this.formRembourssement.value.rib.lastModifiedDate,

         nom: this.formRembourssement.value.rib.lastModifiedDate,

         added_by : this.token.id,

         link: 'Link Here',

         doc_number : this.formRembourssement.value.nom[0].toUpperCase() + this.formRembourssement.value.prenom[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()

       } : null ,

       attestation_payement: this.formRembourssement.value.attestion_paiement ?

       {

         added_on : this.formRembourssement.value.attestion_paiement.lastModifiedDate,

         nom : this.formRembourssement.value.attestion_paiement.lastModifiedDate,

         added_by : this.token.id,

         link : 'Link Here',

         doc_number : this.formRembourssement.value.nom[0].toUpperCase() + this.formRembourssement.value.prenom[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()

       } : null,

       document_inscription: this.formRembourssement.value.document_inscription ?

       {

         added_on : this.formRembourssement.value.document_inscription.lastModifiedDate,

         nom : this.formRembourssement.value.document_inscription.lastModifiedDate,

         added_by : this.token.id,

         link : 'Link Here',

         doc_number :this.formRembourssement.value.nom[0].toUpperCase() + this.formRembourssement.value.prenom[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()

       } : null ,

       preuve_payement: this.formRembourssement.value.preuve_paiement ?

       {

         added_on : this.formRembourssement.value.preuve_paiement.lastModifiedDate,

         nom : this.formRembourssement.value.preuve_paiement.lastModifiedDate,

         added_by : this.token.id,

         link : 'Link Here',

         doc_number : this.formRembourssement.value.nom[0].toUpperCase() + this.formRembourssement.value.prenom[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()

 

       } : null,

       autres_doc: this.formRembourssement.value.notification_ou_autre_justificatif ?

       {

         added_on : this.formRembourssement.value.notification_ou_autre_justificatif.lastModifiedDate,

         nom : this.formRembourssement.value.rnotification_ou_autre_justificatifib.lastModifiedDate,

         added_by : this.token.id,

         link : 'Link Here'  ,

         doc_number : this.formRembourssement.value.nom[0].toUpperCase() + this.formRembourssement.value.prenom[0].toUpperCase() + '-' + Math.floor(Math.random() * Date.now()).toString()

       } : null

     }

 

 

     if (update) {

      this.updateDemande(demande)

     } else {

      this.newDemande(demande)

     }

  }

 

 

  updateDemande(demande) {

               // Use the service to make the POST request

               this.demandeRemboursementService.updateRemboursement(demande).subscribe(

                (response) => {

                  this.doneUpdating.emit(true)

                  // Handle success (show a success message)

                  this.messageService.add({

                    severity: 'success',

                    summary: 'Success',

                    detail: 'Remboursement added successfully.'

                  });

 

                 

         

         

                  // this.router.navigate(['remboursement-list']);

                },

                (error) => {

                  // Handle error (show an error message)

                  console.error('Error adding remboursement:', error);

                  // Check if the error response contains a message

                  const errorMessage = error.error ? error.error.message : 'Failed to add remboursement.';

                  this.messageService.add({

                    severity: 'error',

                    summary: 'Error',

                    detail: errorMessage

                  });

                }

              );

  }

 

  newDemande(demande) {

   

              // Use the service to make the POST request

              this.demandeRemboursementService.addRemboursement(demande).subscribe(

                (response) => {

                  // Handle success (show a success message)

                  this.messageService.add({

                    severity: 'success',

                    summary: 'Success',

                    detail: 'Remboursement added successfully.'

                  });

         

         

                  // this.router.navigate(['remboursement-list']);

                },

                (error) => {

                  // Handle error (show an error message)

                  console.error('Error adding remboursement:', error);

                  // Check if the error response contains a message

                  const errorMessage = error.error ? error.error.message : 'Failed to add remboursement.';

                  this.messageService.add({

                    severity: 'error',

                    summary: 'Error',

                    detail: errorMessage

                  });

                }

              );

  }



  rib: any;
  attestation_payement: any;
  document_inscription: any;
  preuve_payement: any;
  autres_doc: any;

  onUpload(event: any, doc:string ) {
    if (event.target.files.length > 0) {
      switch (doc) {
        case 'rib': {
          this.rib = event.target.files[0];
          break;
        }
        case "attestation_payement": {
          this.attestation_payement = event.target.files[0];
          break;
        }
        case "document_inscription": {
          this.document_inscription = event.target.files[0];
          break;
        }
        case 'preuve_payement': {
          this.preuve_payement = event.target.files[0];
          break;
        }
        case 'autres_doc': {
          this.autres_doc = event.target.files[0];
          break;
        }
        default: {
          break;
       }
      }
      console.log(this.autres_doc)
    }

  }

 

  reset(doc) {
    doc.value = ""
  }

 


 
}
 