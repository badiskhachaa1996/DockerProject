import { Component, OnInit, ViewChild } from '@angular/core';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FileUpload } from 'primeng/fileupload';
import jwt_decode from "jwt-decode";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { MessageService } from 'primeng/api';

import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-gestion-preinscriptions',
  templateUrl: './gestion-preinscriptions.component.html',
  styleUrls: ['./gestion-preinscriptions.component.scss']
})
export class GestionPreinscriptionsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;
  code = this.ActiveRoute.snapshot.paramMap.get('code');
  users: User[] = [];
  prospects: any[] = [];
  inscriptionSelected: Prospect;
  showUploadFile: Prospect;
  ListDocuments: String[] = []
  token;
  dataCommercial: CommercialPartenaire;
  infoCommercialExpand: CommercialPartenaire;
  ListPiped: String[] = []
  showPayement: Prospect
  DocTypes: any[] = [
    { value: null, label: "Choississez le type de fichier", },
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];

  DocTypes2: any[] = [
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  statutList: any[] = [
    { value: "Documents manquants" },
    { value: "Dossier passable" },
    { value: "Dossier complet" },
    { value: "Manque d'orientation" }
  ]
  statutVisible = [
    { value: "Dossier suspendu - En attente du prospect" },
    { value: "Traitement Terminé" }
  ]

  listFR = [
    { value: "Pas de TCF - Pays non Francophone" },
    { value: "TCF B2 ou plus" },
    { value: "ILC B2 ou plus" },
    { value: "Moins de B2" },
    { value: "Non concerné" }
  ]
  decisionList = [
    { value: "Suspendu" },
    { value: "Suspension - Test TCF" },
    { value: "Accepté" },
    { value: "Accepté sur réserve" },
    { value: "Non Retenu" },
    { value: "Payée" },
  ]
  dropdownDecision = [
    { value: null, label: "Decision Admission" },
    { value: "Suspendu", label: "Suspendu" },
    { value: "Suspension - Test TCF", label: "Suspension - Test TCF" },
    { value: "Accepté", label: "Accepté" },
    { value: "Accepté sur réserve", label: "Accepté sur réserve" },
    { value: "Non Retenu", label: "Non Retenu" },
    { value: "Payée", label: "Payée" },
  ]

  filterTraitement = [
    { value: null, label: "Tous les états" },
    { value: "Nouvelle", label: "Nouvelle" },
    { value: "Retour Etudiant", label: "Retour Etudiant" },
    { value: "Vu", label: "Vu" },
    { value: "Traité", label: "Traité" },
  ]

  phaseComplementaire = [
    { value: "Aucune" },
    { value: "Choix de formation" },
    { value: "Changement de campus" },
    { value: "Manquant" },
    { value: "Rupture d'étude" },
    { value: "Sous Dossier" },
    { value: "Envoyé à Eduhorizons" },
    { value: "En attente du retour ELC" },
    { value: "Demande équivalence envoyée" },
  ]

  statutPayement = [
    { value: "Aucun" },
    { value: "Pré-inscription" },
    { value: "Inscription" },
    { value: "Inscription définitive" },
  ]

  listAgent = [
    { value: "Aucun" },
    { value: "Haitham" },
    { value: "Dhekra" },
    { value: "Moez" },
    { value: "Dhouha" },
    { value: "Maroua N" },
    { value: "Malek" },
    { value: "Feryel" },
    { value: "Elyes" },
    { value: "Rania" },
    { value: "Asma" },
    { value: "Islem" },
    { value: "SLIM" },
    { value: "Achraf" },
  ]

  stat_cf = [
    { label: "Oui", value: true },
    { label: "Non", value: false }
  ]

  payementList = []

  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })


  onAddPayement() {
    this.payementList.push({ type: "", montant: 0 })
  }

  changeMontant(i, event, type) {
    if (type == "montant") {
      this.payementList[i][type] = parseInt(event.target.value);
    } else {
      this.payementList[i][type] = event.target.value;
    }
  }

  deletePayement(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le payement ?")) {
      this.payementList.splice(i, 1)
    }
  }

  addNewPayment() {
    console.log(this.payementList)
    this.admissionService.addNewPayment(this.showPayement._id, { payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Le payement a été ajouter" })
      this.refreshProspect()
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur" })
    })
  }

  constructor(private ActiveRoute: ActivatedRoute, private userService: AuthService, private formBuilder: FormBuilder,
    private admissionService: AdmissionService, private router: Router, private messageService: MessageService, private commercialService: CommercialPartenaireService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.userService.WhatTheRole(this.token.id).subscribe(data => {
      if (data.type == 'Commercial' && data.data.statut == 'Admin') {
        this.dataCommercial = data.data
      }
      this.refreshProspect()
    })

  }

  expandRow(prospect: Prospect) {
    this.admissionService.getFiles(prospect?._id).subscribe(
      (data) => {
        this.ListDocuments = data
        this.ListPiped = []
        data.forEach(doc => {
          let docname: string = doc.replace("/", ": ").replace('releve_notes', 'Relevé de notes ').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
          this.ListPiped.push(docname)
        })
      },
      (error) => { console.error(error) }
    );
    if (prospect.code_commercial) {
      this.commercialService.getCommercialDataFromCommercialCode(prospect.code_commercial).subscribe(data => {
        this.infoCommercialExpand = data
      },
        (error) => { console.error(error) })
    } else {
      this.infoCommercialExpand = null
    }
    this.admissionService.changeEtatTraitement(prospect._id).subscribe(data => {
      this.prospects[this.prospects.indexOf(prospect)].etat_traitement = "Vu"
    })
  }

  refreshProspect() {
    //Recuperation de la liste des utilisateurs
    this.userService.getAll().subscribe(
      ((response) => {
        if (this.code) {
          if (this.token != null && this.dataCommercial != null) {
            this.admissionService.getAllByCodeAdmin(this.dataCommercial.partenaire_id).subscribe(
              ((responseAdmission) => {
                this.prospects = responseAdmission
                response.forEach((user) => {
                  this.users[user._id] = user;
                });
              }),
              ((error) => { console.error(error); })
            );
          } else {
            this.admissionService.getAllCodeCommercial(this.code).subscribe(
              ((responseAdmission) => {
                this.prospects = responseAdmission
                response.forEach((user) => {
                  this.users[user._id] = user;
                });
              }),
              ((error) => { console.error(error); })
            );
          }

        } else {
          if (this.dataCommercial && this.dataCommercial.statut == "Admin" || this.token.role == "Admin") {
            this.admissionService.getAll().subscribe(
              ((responseAdmission) => {
                this.prospects = responseAdmission
                response.forEach((user) => {
                  this.users[user._id] = user;
                });
              }),
              ((error) => { console.error(error); })
            );
          }
        }
      }),
      ((error) => { console.error(error); })
    );
  }

  changeStateForm: FormGroup = new FormGroup({
    statut: new FormControl(this.statutList[0], Validators.required),
    typeDoc: new FormControl(""),
    statut_fr: new FormControl(this.listFR[0]),
    decision_admission: new FormControl(this.decisionList[0]),
    phase_complementaire: new FormControl(this.phaseComplementaire[0]),
    statut_payement: new FormControl(this.statutPayement[0]),
    customid: new FormControl("", Validators.required),
    traited_by: new FormControl(this.listAgent[0]),
    validated_cf: new FormControl(false),
    avancement_visa: new FormControl(false)
  })


  initStatutForm(prospect: Prospect) {
    this.changeStateForm.patchValue({
      statut: { value: prospect.statut_dossier },
      statut_fr: { value: prospect.tcf },
      decision_admission: { value: prospect.decision_admission },
      phase_complementaire: { value: prospect.phase_complementaire },
      statut_payement: { value: prospect.statut_payement },
      customid: prospect.customid,
      traited_by: { value: prospect.traited_by },
      validated_cf: prospect.validated_cf,
      avancement_visa: prospect.avancement_visa
    })
  }

  changeStateBtn() {
    let p = {
      _id: this.inscriptionSelected._id,
      statut_dossier: this.changeStateForm.value.statut.value,
      tcf: this.changeStateForm.value.statut_fr.value,
      document_manquant: this.changeStateForm.value.typeDoc,
      agent_id: this.token.id,
      decision_admission: this.changeStateForm.value.decision_admission.value,
      phase_complementaire: this.changeStateForm.value.phase_complementaire.value,
      statut_payement: this.changeStateForm.value.statut_payement.value,
      customid: this.changeStateForm.value.customid,
      traited_by: this.changeStateForm.value.traited_by.value,
      validated_cf: this.changeStateForm.value.validated_cf,
      avancement_visa: this.changeStateForm.value.avancement_visa,
      etat_traitement: "Traité"
    }
    this.admissionService.updateStatut(this.inscriptionSelected._id, p).subscribe((dataUpdated) => {
      console.log(dataUpdated)
      this.messageService.add({ severity: "success", summary: "Le statut du prospect a été mis à jour" })
      this.refreshProspect()
      this.prospects[this.prospects.indexOf(this.inscriptionSelected)] = dataUpdated
      this.inscriptionSelected = null
    }, (error) => {
      console.error(error)
    })
  }


  //Methode de redirection vers la page d'ajout d'une nouvelle admission
  onGetFormAdmissionESTYA() {
    this.router.navigate(['formulaire-admission', 'estya']);
  }

  onGetFormAdmissionADG() {
    this.router.navigate(['formulaire-admission', 'adg']);
  }

  onGetFormAdmissionESPIC() {
    this.router.navigate(['formulaire-admission', 'espic']);
  }

  downloadFile(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), this.ListPiped[i])
    }, (error) => {
      console.error(error)
    })

  }

  deleteFile(id, i) {
    if (confirm("Voulez-vous vraiment supprimer le fichier " + this.ListPiped[i] + " ?")) {
      this.admissionService.deleteFile(id, this.ListDocuments[i]).subscribe((data) => {
        this.messageService.add({ severity: "success", summary: "Le fichier a bien été supprimé" })
        this.ListDocuments.splice(i, 1)
        this.ListPiped.splice(i, 1)
      }, (error) => {
        this.messageService.add({ severity: "error", summary: "Le fichier n'a pas pu être supprimé", detail: error })
        console.error(error)
      })
    }
  }

  FileUpload(event) {
    if (this.uploadFileForm.value.typeDoc != null && event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.showUploadFile._id)
      formData.append('document', this.uploadFileForm.value.typeDoc)
      formData.append('file', event.files[0])
      this.admissionService.uploadFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.expandRow(this.showUploadFile)
        event.target = null;
        this.showUploadFile = null;
        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
    this.prospects.forEach(p => {
      let t = {}
      t['NOM'] = p.lastname.toUpperCase()
      t['Prenom'] = p.firstname
      t['Date de la demande'] = p?.date_creation
      t['Date de naissance'] = p.date_naissance
      t['Pays de residence'] = p['pays_de_residence']
      t['Nationalite'] = p['nationnalite']
      t['Email'] = p['email']
      t['Telephone'] = p['telephone']
      t['Ecole demande'] = p?.type_form
      t['1er choix'] = p.campus_choix_1
      t['2eme choix'] = p.campus_choix_2
      t['3eme choix'] = p.campus_choix_3
      t['Programme'] = p.programme
      t['formation'] = p.formation
      t['Rythme de Formation'] = p.rythme_formation
      t['Dernier niveau academique'] = p.validated_academic_level
      t['Num WhatsApp'] = p.indicatif_whatsapp + " " + p.numero_whatsapp
      t['Statut pro actuel'] = p.statut_actuel
      t['Langues'] = p.languages
      t['Experiences pro'] = p.professional_experience
      t['Nom du garant'] = p?.nomGarant.toUpperCase()
      t['Prenom du garant'] = p?.prenomGarant
      t['Nom de l\'agence'] = p?.nomAgence
      t['Code du commercial'] = p?.code_commercial
      t['Autre'] = p.other
      t['Nombre de documents'] = p.nbDoc
      t['Decision Admission'] = p.decision_admission
      t['Phase complémentaire'] = p.phase_complementaire
      t['Statut Payement'] = p.statut_payement
      t['ID Etudiant'] = p.customid
      t['Att Traité par'] = p.traited_by
      t['Confirmation CF'] = p.validated_cf
      if (p.agent_id) {
        t['Agent'] = this.users[p.agent_id].lastname.toUpperCase() + " " + this.users[p.agent_id].firstname
      }
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "preinscrit" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }
}
