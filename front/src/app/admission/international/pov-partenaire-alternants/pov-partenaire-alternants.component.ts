import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { AlternantsPartenaire } from 'src/app/models/AlternantsPartenaire';
import { AlternantsPartenaireService } from 'src/app/services/alternants-partenaire.service';
import { environment } from 'src/environments/environment';
import { saveAs } from "file-saver";
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-pov-partenaire-alternants',
  templateUrl: './pov-partenaire-alternants.component.html',
  styleUrls: ['./pov-partenaire-alternants.component.scss']
})
export class PovPartenaireAlternantsComponent implements OnInit {

  alternants: AlternantsPartenaire[]
  PARTENAIRE: Partenaire
  COMMERCIAL: CommercialPartenaire
  ID = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute, private FAService: FormulaireAdmissionService, private CommercialService: CommercialPartenaireService, private APService: AlternantsPartenaireService, private ToastService: MessageService, private router: Router, private PService: PartenaireService) { }

  showDocuments: AlternantsPartenaire;
  dicCommercial = {}
  ngOnInit(): void {
    this.CommercialService.getAllPopulate().subscribe(data => {
      data.forEach(d => {
        let { user_id }: any = d
        if (user_id) {
          //this.filterCommercial.push({ label: user_id.lastname + " " + user_id.firstname, value: d.code_commercial_partenaire })
          this.dicCommercial[d.code_commercial_partenaire] = user_id.lastname + " " + user_id.firstname
        }

      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(f => {
        this.formationlist.push({ label: f.nom, value: f.nom })
      })
    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.ecoleList.push({ label: d.titre, value: d.titre })
        this.dicEcole[d.titre] = d
      })
    })
    if (this.ID) {
      //T'as fumé quoi ????
      if (this.ID.length > 12) {
        //this.ID corresponds alors à un partenaire ID
        this.PService.getById(this.ID).subscribe(data => {
          this.PARTENAIRE = data
        })
        this.APService.getAllByPartenaireID(this.ID).subscribe(data => {
          this.alternants = data
        })
      } else {
        //ID correponds alors à un code commercial
        this.APService.getAllByCommercialCode(this.ID).subscribe(data => {
          this.alternants = data
        })
        this.CommercialService.getByCode(this.ID).subscribe(data => {
          this.COMMERCIAL = data
        })
      }

    }

    else
      this.APService.getAll().subscribe(data => {
        this.alternants = data
      })
  }

  initDocument(alternant: AlternantsPartenaire) {
    this.showDocuments = alternant
  }

  showUploadRequisFile = false;
  showUploadOptionnelFile = false
  initUploadRequis(filename: string) {
    this.showUploadRequisFile = true
    if (filename) {
      this.uploadRequisFileForm.setValue({ nom: filename })
    }
  }
  uploadRequisFileForm = new FormGroup({
    nom: new FormControl('', Validators.required)
  })
  uploadOptionnelFileForm = new FormGroup({
    nom: new FormControl('', Validators.required)
  })

  fichierRequisList = [
    { label: 'CV', value: 'CV' },
    { label: 'Titre de séjour', value: 'Titre de séjour' },
    { label: "Pièce d'identité ou passeport", value: "Pièce d'identité ou passeport" },
    { label: 'Dernier diplome obtenu', value: 'Dernier diplome obtenu' },
  ]

  downloadRequis(path: string) {
    this.APService.downloadFile(this.showDocuments._id, 'requis', path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })
  }

  downloadOptionnel(path: string) {
    this.APService.downloadFile(this.showDocuments._id, 'optionnel', path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })
  }

  deleteRequis(path: string) {
    this.APService.deleteRequisFile(this.showDocuments._id, path).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Suppression du Fichier', detail: 'Le fichier a bien été supprimé' });
      if (res.documents_requis)
        this.alternants[this.alternants.indexOf(this.showDocuments)].documents_requis = res.documents_requis
    })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  //Partie Mis à jour
  updateAlternant: AlternantsPartenaire
  initUpdate(alternant: AlternantsPartenaire) {
    this.updateAlternant = alternant
    this.updateForm.patchValue({ ...alternant })
    this.updateForm.patchValue({ date_naissance: this.convertTime(alternant.date_naissance), date_contrat: this.convertTime(alternant.date_contrat) })
  }


  updateForm = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    pays: new FormControl('', Validators.required),
    campus: new FormControl('', Validators.required),
    ecole: new FormControl('', Validators.required),
    formation: new FormControl(''),
    rentree_scolaire: new FormControl('', Validators.required),
    etat_contrat: new FormControl('', Validators.required),
    civilite: new FormControl('', Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
    whatsapp: new FormControl(''),
    indicatif: new FormControl('', Validators.required),
    indicatif_whatsapp: new FormControl(''),
    isPMR: new FormControl(false, Validators.required),
    rue: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    postal: new FormControl('', Validators.required),
    ville: new FormControl('', Validators.required),
    date_contrat: new FormControl('', Validators.required),
    entreprise: new FormControl('', Validators.required),
    adresse_entreprise: new FormControl('', Validators.required),
    telephone_entreprise: new FormControl('', Validators.required),
    mail_entreprise: new FormControl('', [Validators.required, Validators.email]),
  })

  ActiveIndex = 0
  nationList = environment.nationalites;
  paysList = environment.pays;

  civiliteList: any = [
    { label: 'Monsieur', value: "Monsieur" },
    { label: 'Madame', value: "Madame" },
    { label: 'Autre', value: "Autre" },
  ];

  ecoleList = [
  ]
  dicEcole = {}
  campusList = [
    { label: 'Paris - Champs sur Marne', value: 'Paris - Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: "Montpellier" },
  ]
  rentreeList = [
    { label: '2023 - 2024', value: "2023 - 2024" },
    { label: '2024 - 2025', value: "2024 - 2025" },
  ]

  etatList = [
    { label: 'A la recherche', value: "A la recherche" },
    { label: "En attente d'information", value: "En attente d'information" },
    { label: 'Contrat Etabli', value: "Contrat Etabli" },
    { label: 'Contrat signé', value: "Contrat signé" },
    { label: 'Contrat déposé à OPCO', value: "Contrat déposé à OPCO" },
    { label: 'Contrat validé à la facturation', value: "Contrat validé à la facturation" },
  ]

  canNext1() {
    return this.updateForm.get('prenom').valid && this.updateForm.get('nom').valid &&
      this.updateForm.get('civilite').valid && this.updateForm.get('date_naissance').valid &&
      this.updateForm.get('nationalite').valid && this.updateForm.get('email').valid &&
      this.updateForm.get('indicatif').valid && this.updateForm.get('telephone').valid &&
      this.updateForm.get('indicatif_whatsapp').valid && this.updateForm.get('whatsapp').valid &&
      this.updateForm.get('isPMR').valid
  }

  canNext2() {
    return this.updateForm.get('numero').valid && this.updateForm.get('rue').valid &&
      this.updateForm.get('postal').valid && this.updateForm.get('ville').valid &&
      this.updateForm.get('pays').valid
  }

  canNext3() {
    return this.updateForm.get('ecole').valid && this.updateForm.get('campus').valid &&
      this.updateForm.get('rentree_scolaire').valid
  }


  onUpdateAlternant() {
    this.APService.update({ ...this.updateForm.value }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Mise à jour de l'alternant avec succès" })
      this.alternants.splice(this.alternants.indexOf(this.updateAlternant), 1, data)
      this.updateAlternant = null
      this.ActiveIndex = 0
      this.updateForm.reset()
    })
  }

  nextPage() {
    this.ActiveIndex += 1
  }

  previousPage() {
    this.ActiveIndex -= 1
  }

  convertTime(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  //Partie Upload des Documents
  @ViewChild('fileInput') fileInput: FileUpload;
  FileUploadRequis(event: { files: [File], target: EventTarget }) {

    if (this.uploadRequisFileForm.valid && event.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.showDocuments._id)
      formData.append('nom', this.uploadRequisFileForm.value.nom)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.APService.uploadRequisFile(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        console.log(res)
        if (res.documents_requis)
          this.alternants[this.alternants.indexOf(this.showDocuments)].documents_requis = res.documents_requis
        event.target = null;
        this.showUploadRequisFile = false;

        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  FileUploadOptionnel(event: { files: [File], target: EventTarget }) {

    if (this.uploadOptionnelFileForm.valid && event.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.showDocuments._id)
      formData.append('nom', this.uploadOptionnelFileForm.value.nom)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.APService.uploadOptionnelFile(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        console.log(res)
        if (res.documents_optionnel)
          this.alternants[this.alternants.indexOf(this.showDocuments)].documents_optionnel = res.documents_optionnel
        event.target = null;
        this.showUploadRequisFile = false;

        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  formationlist = []
  onSelectEcole() {
    this.formationlist = []
    this.dicEcole[this.updateForm.value.ecole].formations.forEach(f => {
      this.formationlist.push({ label: f.nom, value: f.nom })
    })
  }

}
