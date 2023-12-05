import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { Demande } from 'src/app/models/Demande';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CaptchaModule } from 'primeng/captcha';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {ClipboardModule} from '@angular/cdk/clipboard';



@Component({
  selector: 'app-add-remboussement',
  templateUrl: './add-remboussement.component.html',
  styleUrls: ['./add-remboussement.component.scss']
})

export class AddRemboussementComponent implements OnInit {






  showResponse(event) {
    this.messageService.add({ severity: 'info', summary: 'Succees', detail: 'User Responded' });
  }


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private demandeRemboursementService: DemandeRemboursementService,
    private router: Router,
    private formationService: FormulaireAdmissionService,
    private userService: AuthService,
  ) { }

  

  docList = [
    {
      name: 'RIB',
      slug: 'rib',
      doc: '',
      added_on: '',
      added_by: '',
      doc_number: ''

    },
    {
      name: 'Attestation de Paiement',
      slug: 'attestation_payement',
      doc: '',
      added_on: '',
      added_by: '',
      doc_number: ''
    },
    {
      name: "Document d'inscription",
      slug: 'document_inscription',
      doc: '',
      added_on: '',
      added_by: '',
      doc_number: ''
    },
    {
      name: 'Preuve de Paiement',
      slug: 'preuve_payement',
      doc: '',
      added_on: '',
      added_by: '',
      doc_number: ''
    },
    {
      name: 'Notification de refus (ou autre justificatif)',
      slug: 'autres_doc',
      doc: '',
      added_on: '',
      added_by: '',
      doc_number: ''
    }
  ]

  civilitySelect = [
    { label: "Monsieur", value: "Monsieur" },
    { label: "Madame", value: "Madame" },
    { label: "Non Précisé", value: "Non précisé" },
  ]

  ecoles = []

  formations = []

  annescolaires = []

  //TODO à rajouter au fichier env

  motifs = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "7" },
  ]

  token: any;

  user: any;

  motif = environment.motif

  modePaiement = environment.paymentType

  pays_residence = environment.pays

  @Output() cancelFormOutPut = new EventEmitter<boolean>();

  @Output() doneUpdating = new EventEmitter<boolean>();
  @Input() currentDemande = new Demande;


  Successfull = false

  @Input() showUpdateForm = false;

  @Input() isNewDemande = false

  formRembourssement: UntypedFormGroup;
  aFormGroup: UntypedFormGroup;

  availableStatus = environment.availableStatus
  siteKey = environment. recaptchaKey



  ngOnInit(): void {

    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });


    this.formRembourssement = this.formBuilder.group({
      civilite: ['' ,Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      nationalite: ['', Validators.required],
      pays_resid: ['', Validators.required],
      paymentType: ['', Validators.required],
      indicatif_phone: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      annee_scolaire: ['', Validators.required],
      ecole: ['', Validators.required],
      formation: ['', Validators.required],
      motif_refus: ['', Validators.required],
      montant: ['', Validators.required],
      payment_date: ['', Validators.required],

    })


    this.formationService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.formations.push({ label: d.nom, value: d.nom })
      })
      this.formationService.RAgetAll().subscribe(data => {
        data.forEach(d => {
          this.annescolaires.push({ label: d.nom, value: d._id })
        })
        this.formationService.EAgetAll().subscribe(data => {
          data.forEach(d => {
            this.ecoles.push({ label: d.titre, value: d.url_form })
          })
          if (this.showUpdateForm && !this.isNewDemande) {
            this.chargeFormDate(this.currentDemande)
          } else if (this.showUpdateForm && this.isNewDemande) {
            this.currentDemande = new Demande
            this.currentDemande.docs = {
              rib: null,
              attestation_payement: null,
              autres_doc: null,
              preuve_payement: null,
              document_inscription: null
            }
          } else {
            this.currentDemande.docs = {
              rib: null,
              attestation_payement: null,
              autres_doc: null,
              preuve_payement: null,
              document_inscription: null
            }
          }

        })
      })
    })

    this.token = jwt_decode(localStorage.getItem('token'));
    this.user = this.token.id

  }





  // Mis à jour de la demande 


  chargeFormDate(demande) {
    this.formRembourssement = this.formBuilder.group({
      civilite: [demande.student?.civility],
      nom: [demande.student?.last_name],
      prenom: [demande.student?.first_name],
      date_naissance: [demande.student?.date_naissance],
      nationalite: [demande.student?.nationality],
      pays_resid: [demande.student?.country_residence],
      paymentType: [demande.refund?.method],
      indicatif_phone: [demande.student?.indicatif_phone],
      phone: [demande.student?.phone],
      email: [demande.student?.email],
      annee_scolaire: [demande.training?.scholar_year],
      ecole: [demande.training?.school],
      formation: [demande.training?.name],
      motif_refus: [demande.motif],
      montant: [demande.payment?.montant],
      payment_date: [demande.payment?.date],

    })

    for (let key in demande.docs) {
      if (demande.docs[key]) {
        this.chargeDocs(key)
      }
    }

  }




  updateDemandeObject(demande, update) {
    demande.created_on = !update ? new Date() : demande.created_on
    if (this.token?.id) {
      console.log(this.token);
      demande.created_by = this.token.id
    }
    demande.motif = this.formRembourssement.value.motif_refus
    demande.student = {
      civility: this.formRembourssement.value.civilite,
      last_name: this.formRembourssement.value.nom,
      first_name: this.formRembourssement.value.prenom,
      date_naissance: this.formRembourssement.value.date_naissance,
      nationality: this.formRembourssement.value.nationalite,
      country_residence: this.formRembourssement.value.pays_resid,
      indicatif_phone: this.formRembourssement.value.indicatif_phone,
      phone: this.formRembourssement.value.phone,
      email: this.formRembourssement.value.email,
    },

      demande.training = {
        scholar_year: this.formRembourssement.value.annee_scolaire,
        school: this.formRembourssement.value.ecole,
        name: this.formRembourssement.value.formation,
      }

    demande.payment = {
      montant: this.formRembourssement.value.montant,
      date: this.formRembourssement.value.payment_date,
      method: this.formRembourssement.value.paymentType

    }

    demande.payment = {
      date: this.formRembourssement.value.payment_date,
      montant: this.formRembourssement.value.montant,
      method: this.formRembourssement.value.paymentType
    }

    if (update && !this.isNewDemande) {
      this.updateDemande(demande)
    } else {
      this.currentDemande = new Demande
      this.newDemande(demande)
    }
  }



  chargeDocs(doc) {
    let index = this.docList.findIndex(document => document.slug === doc);

    this.getDocOwner(index, this.currentDemande.docs[doc].added_by)
    this.docList[index].added_on = this.currentDemande.docs[doc].added_on
    this.docList[index].doc_number = this.currentDemande.docs[doc].doc_number
  }

  updateDemande(demande) {
    // Use the service to make the POST request
    demande.status = demande.status == 'new' ? demande.status = 'in-progress' : demande.status
    this.demandeRemboursementService.updateRemboursement(demande).subscribe(
      (response) => {
        this.doneUpdating.emit(true)
        // Handle success (show a success message)
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Remboursement ajouté avec succès.'
        });
        console.log(response);
        console.log(demande);

        this.router.navigate(['remboursements']);
      },
      (error) => {
        // Handle error (show an error message)
        console.error('Error adding remboursement:', error);
        // Check if the error response contains a message
        const errorMessage = error.error ? error.error.message : 
        "Échec de l'ajout du remboursement.";
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
    demande.status = 'new';
    console.log(demande);
    this.demandeRemboursementService.addRemboursement(demande).subscribe(
      (response) => {

        console.log('Before MessageService.add');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Remboursement ajouté avec succès.'
        });
        console.log('After MessageService.add');
        

        for (let key in this.docList) {
          let doc = this.docList[key]
          if (doc.doc) {
            const formData = new FormData();
            formData.append('id', response._id)
            formData.append('docname', doc.slug)
            formData.append('file', doc.doc)
            this.demandeRemboursementService.postDoc(formData)
              .then((response) => { })
              .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: "Le document " + " " + doc.name + " " + " n'a pas pu être ajouté" }); });
          }
        }
        this.showUpdateForm = false
        if (this.isNewDemande) {
          this.cancelForm()
        }

        this.Successfull = true
      },
      (error) => {
        // Handle error (show an error message)
        console.error("Échec d'ajout de remboursement" , error);
      
        if (error.status === 400 && error.error && error.error.message) {
          // Check if the error response indicates a missing field
          const missingFieldMessage = error.error.message;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Missing Field: ${missingFieldMessage}`
          });
        } else {
          // Default error message for other errors
          const errorMessage = error.error ? error.error.message : "Échec d'ajout de remboursement"





          ;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        }
      }
      
    );
  }

  onSubmitRemboussementForm() {
    const captchaResponse = this.aFormGroup.get('recaptcha').value;

    if (captchaResponse && this.formRembourssement.valid) {
        this.updateDemandeObject(this.currentDemande, this.showUpdateForm);

        // Assuming a successful form submission, navigate to the list of demands
        this.router.navigate(['remboursements']); // Update with your actual route
    } else {
        console.log('Veuillez remplir tous les champs obligatoires et vérifier le captcha avant de soumettre');
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Veuillez remplir tous les champs obligatoires et vérifier le captcha avant de soumettre'
        });
    }
}
  


  cancelForm() {
    this.cancelFormOutPut.emit(true)
    this.showUpdateForm = false
    this.isNewDemande = false
    this.ngOnInit()
  }

  uploadDoc(doc) {
    console.log(doc)
    const documentIndex = this.docList.findIndex(document => document.slug === doc.slug);
    if (documentIndex !== -1) {
      this.docList[documentIndex] = doc;
    }
    this.currentDemande.docs[doc.slug] = {
      nom: doc.name,
      added_on: new Date(),
      added_by: this.user ? this.user : 'Annonyme',
      doc_number: doc.doc_number,
    }
  }

  removeDoc(doc) {
    this.currentDemande.docs[doc] = null
    const documentIndex = this.docList.findIndex(document => document.slug === doc);
    if (documentIndex !== -1) {
      this.docList[documentIndex].doc = null;
    }
  }

  getUserNameById(id) {
    const user = this.user.find(u => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : 'Utilisateur introuvable';
  }




  getDocOwner(index, id) {
    this.userService.getPopulate(id).subscribe(u => {
      this.docList[index].added_by = u.firstname + ' ' + u.lastname
    })
  }
  value = 'http://localhost:4200/#/formulaire-remboursement'
  copy(value) {
    return `${value}`;
  }


}
