import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
import { Partenaire } from 'src/app/models/Partenaire';

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
  dicCommercial = {}
  ListPiped: String[] = []
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
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
    { value: "Initial" },
    { value: "Alternant" }
  ]

  statutDossier = [
    { value: "Document Manquant", label: "Document Manquant" },
    { value: "Paiement non finalisé", label: "Paiement non finalisé" },
    { value: "Dossier Complet", label: "Dossier Complet" },
    { value: "Abandon", label: "Abandon" }
  ]

  constructor(private ActiveRoute: ActivatedRoute, private userService: AuthService, private admissionService: AdmissionService,
    private messageService: MessageService, private commercialService: CommercialPartenaireService, private classeService: ClasseService,
    private etudiantService: EtudiantService, private formBuilder: FormBuilder) { }


  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })

  AssignForm: FormGroup = this.formBuilder.group({
    groupe: ["", Validators.required],
    statut_dossier: [[this.statutDossier[0].value], Validators.required],
  })

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.commercialService.getByUserId(this.token.id).subscribe(data => {
      if (data && data.statut == 'Admin') {
        this.dataCommercial = data
      }
    })
    this.classeService.getAll().subscribe(groupes => {
      groupes.forEach(g => {
        this.groupeList.push({ label: g.abbrv, value: g._id, nom: g.nom })
      })
      this.AssignForm.patchValue({
        groupe: this.groupeList[0].value
      })
    })
    this.refreshEtudiant()
  }
  etudiants: Etudiant[] = [];

  refreshEtudiant() {
    this.etudiantService.getAllWait().subscribe(data => {
      this.etudiants = data
    })
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user) => {
          this.users[user._id] = user;
        });
      })
    );
  }
  
  imageToShow: any = "../assets/images/avatar.PNG"
  loadPP(rowData) {
    this.imageToShow = "../assets/images/avatar.PNG"
    this.userService.getProfilePicture(rowData.user_id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        let reader: FileReader = new FileReader();
        reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
        }, false);
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          reader.readAsDataURL(blob);
        }
      }

    })
    this.etudiantService.getFiles(rowData?._id).subscribe(
      (data) => {
        this.ListDocuments = data
      },
      (error) => { console.error(error) }
    );
  }

  onAddEtudiant() {
    let data = { _id: this.showAssignForm._id, statut_dossier: this.AssignForm.value.statut, groupe: this.AssignForm.value.groupe }
    //this.AssignForm.value.nom_tuteur, this.AssignForm.value.prenom_tuteur, this.AssignForm.value.adresse_tuteur, this.AssignForm.value.email_tuteur, this.AssignForm.value.phone_tuteur, this.AssignForm.value.indicatif_tuteur
    this.etudiantService.assignToGroupe(data).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Etudiant assigné à un groupe", detail: "L'étudiant a été assigné" })
      this.showAssignForm = null
    }, err => {
      console.error(err)
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
  }

  downloadFile(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), this.ListPiped[i])
    }, (error) => {
      console.error(error)
    })

  }
  VisualiserFichier(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
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

  //Verification si le prospect est mineure ou majeur
  onIsMinor(): boolean {
    let result: boolean = false;

    //recuperation de l'année actuelle
    let anneeActuel = new Date().getFullYear();
    //recuperation de l'année de naissance du prospect
    let anneeDeNaissance = new Date(this.showAssignForm.date_naissance).getFullYear();

    //Calcule de la difference
    if (anneeActuel - anneeDeNaissance >= 18) {
      result = false;
    } else {
      result = true;
    }

    return result;
  }

}
