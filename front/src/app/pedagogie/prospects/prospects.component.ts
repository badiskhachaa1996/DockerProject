import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { ClasseService } from 'src/app/services/classe.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
  selector: 'app-prospects',
  templateUrl: './prospects.component.html',
  styleUrls: ['./prospects.component.scss']
})
export class ProspectsComponent implements OnInit {

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
  DocTypes: any[] = [
    { value: null, label: "Choississez le type de fichier", },
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  showAssignForm: Prospect = null;

  groupeList = [];

  statutList = [
    { value: "Etudiant" },
    { value: "Alternant" }

  ]

  constructor(private ActiveRoute: ActivatedRoute, private userService: AuthService, private admissionService: AdmissionService,
    private messageService: MessageService, private commercialService: CommercialPartenaireService, private classeService: ClasseService,
    private etudiantService: EtudiantService) { }


  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })

  AssignForm: FormGroup = new FormGroup({
    groupe: new FormControl("", Validators.required),
    statut: new FormControl(this.statutList[0], Validators.required)
  })

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.userService.WhatTheRole(this.token.id).subscribe(data => {
      if (data.type == 'Commercial' && data.data.statut == 'Admin') {
        this.dataCommercial = data.data
      }
      this.refreshProspect()
    })
    this.classeService.getAll().subscribe(groupes => {
      groupes.forEach(g => {
        this.groupeList.push({ label: g.abbrv, value: g._id, nom: g.nom })
      })
      this.AssignForm.patchValue({
        groupe: this.groupeList[0].value
      })
    })
  }

  onAddEtudiant() {
    let etd: Etudiant = new Etudiant(
      this.showAssignForm._id,
      this.showAssignForm.user_id,
      this.AssignForm.value.groupe,
      this.AssignForm.value.statut.value,
      this.users[this.showAssignForm.user_id].nationalite,
      this.showAssignForm.date_naissance,
      this.showAssignForm.code_commercial,
      null, null, null, this.showAssignForm.customid,
      null, null, null, null, null, null, null, null, null,//A faire pour Alternant
      this.showAssignForm.validated_academic_level,
      this.AssignForm.value.statut.value == "Alternant",
      null, null, null, null, null, null, null,//A faire pour Alternant
      null, null//A faire pour PMR
    )
    this.etudiantService.createfromPreinscris(etd).subscribe(data => {
      this.refreshProspect()
      this.showAssignForm=null
    }, err => {
      console.error(err)
    })
  }

  expandRow(prospect: Prospect) {
    this.admissionService.getFiles(prospect?._id).subscribe(
      (data) => {
        console.log(data)
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
  }

  refreshProspect() {
    //Recuperation de la liste des utilisateurs
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user) => {
          this.users[user._id] = user;
        });
        this.admissionService.getAllWait().subscribe(d => {
          this.prospects = d
        })
      })
    );
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

}
