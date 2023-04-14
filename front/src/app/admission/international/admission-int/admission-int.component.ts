import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-admission-int',
  templateUrl: './admission-int.component.html',
  styleUrls: ['./admission-int.component.scss']
})
export class AdmissionIntComponent implements OnInit {
  //Informations necessaires pour l'upload de fichier
  showUploadFile: Prospect = null
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
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

  @ViewChild('fileInput') fileInput: FileUpload;
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
        this.prospects.forEach(p => {
          if (p._id == this.showUploadFile._id) {
            this.prospects[this.prospects.indexOf(p)].haveDoc = true
            //this.socket.emit("UpdatedProspect", this.prospects[this.prospects.indexOf(p)]);
          }
        })
        event.target = null;
        this.showUploadFile = null;

        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  downloadFile(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(new Blob([byteArray], { type: data.documentType }), this.ListPiped[i])
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

  //Informations chargé lors de l'ouverture de l'expand Row
  ListDocuments: String[] = []
  ListPiped: String[] = []
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
    this.admissionService.changeEtatTraitement(prospect._id).subscribe(data => {
      this.prospects[this.prospects.indexOf(prospect)].etat_traitement = "Vu"
    })
  }

  //Filter Tableau
  filterCampus = [
    { value: null, label: "Tous les campus" },
  ]
  dropdownDecisionAdmission = [
    { value: null, label: "Toutes les décisions" },
    { value: "Accepté", label: "Accepté" },
    { value: "Accepté sur réserve", label: "Accepté sur réserve" },
    { value: "Suspendu", label: "Suspendu" },
    { value: "Suspension - Test TCF", label: "Suspension - Test TCF" },
    { value: "Non Retenu", label: "Non Retenu" },
    { value: "Refusé", label: "Refusé" },
    { value: "En attente de traitement", label: "En attente de traitement" },
    { value: "Payée", label: "Payée" },
    { value: "A signé les documents", label: "A signé les documents" },
  ]
  dropdownDecisionOrientation = [
    { value: null, label: "Toutes les décisions" },
    { label: "En attente de contact", value: "En attente de contact" },
    { label: "Validé", value: "Validé" },
    { label: "Changement de campus", value: "Changement de campus" },
    { label: "Changement de formation", value: "Changement de formation" },
    { label: "Changement de destination", value: "Changement de destination" },
    { label: "Dossier rejeté", value: "Dossier rejeté" },
  ]
  filterPays = [
    { value: null, label: "Tous les pays" }
  ]
  filterFormation = [
    { value: null, label: "Toutes les formations" }
  ]
  filterRythmeFormation = [
    { value: null, label: "Toutes les rythmes de formations" },
    { value: "Alternance", label: "Alternance" },
    { value: "Initiale", label: "Initiale" },
  ]
  filterPhase = [
    { value: null, label: "Toutes les phases de candidature" }
  ]
  filterStatut: any[] = [
    { value: null, label: "Toutes les status" },
    { value: "Manquants", label: "Manquants" },
    { value: "Passable", label: "Passable" },
    { value: "Complet", label: "Complet" },
    { value: "Manque orientation", label: "Manque orientation" }
  ]

  filterVisa = [
    { value: null, label: "Toutes les status" },
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Non", value: "Non" },
    { label: "Pas de retour", value: "Pas de retour" },
  ]
  filterRentreeScolaire = [
    { value: null, label: 'Toutes les rentrées scolaires' },
    { value: 'Janvier 2023', label: 'Janvier 2023' },
    { value: 'Septembre 2023', label: 'Septembre 2023' }
  ]

  constructor(private messageService: MessageService, private admissionService: AdmissionService, private TeamsIntService: TeamsIntService, private CommercialService: CommercialPartenaireService) { }

  prospects: Prospect[];

  selectedProspect: Prospect = null

  token;

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 50) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.admissionService.getAllAdmission().subscribe(data => {
      this.prospects = data
    })
    this.TeamsIntService.MIgetAll().subscribe(data => {
      let dic = {}
      let listTeam = []
      data.forEach(element => {
        if (!dic[element.team_id.nom]) {
          dic[element.team_id.nom] = [element]
          listTeam.push(element.team_id.nom)
        }
        else
          dic[element.team_id.nom].push(element)
      })
      listTeam.forEach(team => {
        let items = []
        dic[team].forEach(element => {
          items.push({ label: `${element.user_id.lastname} ${element.user_id.firstname}`, value: element._id })
        })
        this.agentSourcingList.push({
          label: team,
          items
        })
      })
    })

  }

  //Partie Traitement
  showTraitement: Prospect = null
  agentSourcingList = [{ label: "Aucun", items: [{ label: "Aucun", value: null }] }]
  avancementList = [
    { label: "En attente", value: "En attente" },
    { label: "Joignable", value: "Joignable" },
    { label: "Rappel demandé", value: "Rappel demandé" },
    { label: "Non Joignable  &  Mail envoyé", value: "Non Joignable  &  Mail envoyé" },
    { label: "Pas de numéro & Mail envoyé", value: "Pas de numéro & Mail envoyé" },
  ]
  etatList = [
    { label: "Complet", value: "Complet" },
    { label: "Manquant", value: "Manquant" },
    { label: "Pas de dossier", value: "Pas de dossier" },
  ]
  phaseList = [
    { label: "Mail documents admission", value: "Mail documents admission" },
    { label: "Mail document manquant", value: "Mail document manquant" },
    { label: "Orienté à ILTS", value: "Orienté à ILTS" },
    { label: "Sous dossier", value: "Sous dossier" },
  ]
  langueList = [
    { label: "Pas de TCF - Pays non francophone", value: "Pas de TCF - Pays non francophone" },
    { label: "Niveau B2 ( TCF DALF DELF )", value: "Niveau B2 ( TCF DALF DELF )" },
    { label: "Niveau C1  ( TCF DALF DELF )", value: "Niveau C1  ( TCF DALF DELF )" },
    { label: "Niveau C2 ( TCF DALF DELF )", value: "Niveau C2 ( TCF DALF DELF )" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Niveau inf B2", value: "Niveau inf B2" },
  ]
  initTraitement(prospect: Prospect) {
    this.showTraitement = prospect
    this.traitementForm.patchValue({ ...prospect })
  }
  saveTraitement(willClose = false) {
    this.admissionService.updateV2({ ...this.traitementForm.value }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.prospects.splice(this.prospects.indexOf(this.showTraitement), 1, data)
      if (willClose) {
        this.showTraitement = null
        this.traitementForm.reset()
      }
    })
  }

  traitementForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    contact_date: new FormControl(new Date),
    contact_orientation: new FormControl(''),
    avancement_orientation: new FormControl(),
    note_avancement: new FormControl(""),
    decision_orientation: new FormControl(""),
    note_decision: new FormControl(""),
    statut_dossier: new FormControl(""),
    note_dossier: new FormControl(""),
    phase_complementaire: new FormControl(""),
    note_phase: new FormControl(""),
    niveau_langue: new FormControl("")
  })

  //Partie Details
  showDetails: Prospect = null

  detailsForm: FormGroup = new FormGroup({
    //Informations Personnelles
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    indicatif: new FormControl(''),
    phone: new FormControl(''),
    email_perso: new FormControl('', Validators.required),
    pays_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    date_creation: new FormControl(''),
    //Programme d'étude
    formation: new FormControl(''),
    campus_choix_1: new FormControl(''),
    campus_choix_2: new FormControl(''),
    campus_choix_3: new FormControl(''),
    //Orientation
    decision_orientation: new FormControl(''),
    decision_admission: new FormControl(''),
    //Avancement consulaire
    a_besoin_visa: new FormControl(''),
    validated_cf: new FormControl(''),
    logement: new FormControl(''),
    finance: new FormControl(''),
    avancement_visa: new FormControl(''),


  })

  initDetails(prospect: Prospect) {
    this.showDetails = prospect
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
    let bypass: any = prospect.user_id
    this.detailsForm.patchValue({ ...bypass, ...prospect })
    this.payementList = prospect?.payement
    this.scrollToTop()
  }

  saveDetails(willClose = false) {
    let bypass: any = this.showDetails.user_id
    let user = {
      civilite: this.detailsForm.value.civilite,
      lastname: this.detailsForm.value.lastname,
      firstname: this.detailsForm.value.firstname,
      indicatif: this.detailsForm.value.indicatif,
      phone: this.detailsForm.value.phone,
      email_perso: this.detailsForm.value.email_perso,
      pays_adresse: this.detailsForm.value.pays_adresse,
      numero_adresse: this.detailsForm.value.numero_adresse,
      postal_adresse: this.detailsForm.value.postal_adresse,
      rue_adresse: this.detailsForm.value.rue_adresse,
      ville_adresse: this.detailsForm.value.ville_adresse,
      _id: bypass._id
    }

    let prospect = {
      formation: this.detailsForm.value.formation,
      campus_choix_1: this.detailsForm.value.campus_choix_1,
      campus_choix_2: this.detailsForm.value.campus_choix_2,
      campus_choix_3: this.detailsForm.value.campus_choix_3,
      //Orientation
      decision_orientation: this.detailsForm.value.decision_orientation,
      decision_admission: this.detailsForm.value.decision_admission,
      a_besoin_visa: this.detailsForm.value.a_besoin_visa,
      validated_cf: this.detailsForm.value.validated_cf,
      logement: this.detailsForm.value.logement,
      finance: this.detailsForm.value.finance,
      avancement_visa: this.detailsForm.value.avancement_visa,
      payement: this.payementList,
      _id: this.showDetails._id

    }
    this.admissionService.update({ user, prospect }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.prospects.splice(this.prospects.indexOf(this.showDetails), 1, data)
      if (willClose)
        this.showDetails = null
    })
  }
  abesoinvisaList = [
    { label: "Choisissez", value: null },
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
  ]

  cflist = [
    { label: "Choisissez", value: null },
    { label: "Pas d'avancement", value: "Pas d'avancement" },
    { label: "Compte Campus France crée", value: "Compte Campus France crée" },
    { label: "En attente de l'entretien", value: "En attente de l'entretien" },
    { label: "Entretien Validé", value: "Entretien Validé" },
  ]

  logementList = [
    { label: "Choisissez", value: null },
    { label: "Attestation de logement sans blocage", value: "Attestation de logement sans blocage" },
    { label: "Attestation de logement avec blocage", value: "Attestation de logement avec blocage" },
    { label: "Contrat de baille", value: "Contrat de baille" },
  ]

  visaList = [
    { label: "Choisissez", value: null },
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Non", value: "Non" },
    { label: "Pas de retour", value: "Pas de retour" },
  ]

  civiliteList: any = [
    { label: 'Monsieur', value: 'Monsieur' },
    { label: 'Madame', value: 'Madame' },
    { label: 'Autre', value: 'Autre' },
  ]
  orientationList = [
    { label: "En attente de contact", value: "En attente de contact" },
    { label: "Validé", value: "Validé" },
    { label: "Changement de campus", value: "Changement de campus" },
    { label: "Changement de formation", value: "Changement de formation" },
    { label: "Changement de destination", value: "Changement de destination" },
    { label: "Dossier rejeté", value: "Dossier rejeté" },
  ]

  admissionList = [
    { value: "Accepté", label: "Accepté" },
    { value: "Accepté sur réserve", label: "Accepté sur réserve" },
    { value: "Suspendu", label: "Suspendu" },
    { value: "Suspension - Test TCF", label: "Suspension - Test TCF" },
    { value: "Non Retenu", label: "Non Retenu" },
    { value: "Refusé", label: "Refusé" },
    { value: "En attente de traitement", label: "En attente de traitement" },
    { value: "Payée", label: "Payée" },
    { value: "A signé les documents", label: "A signé les documents" },
  ]


  paysList = environment.pays;

  //Gestions de l'ARGENT

  payementList = []
  onAddPayement() {
    if (this.payementList == null) {
      this.payementList = []
    }
    this.payementList.push({ type: "", montant: 0, date: "" })
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
    if (confirm("Voulez-vous supprimer le paiement ?")) {
      this.payementList.splice(i, 1)
    }
  }
  showSideBar = false
  infoCommercial: CommercialPartenaire
  expand(prospect: Prospect) {
    this.selectedProspect = prospect
    this.showSideBar = true
    this.infoCommercial = null
    if (prospect.code_commercial)
      this.CommercialService.getByCode(prospect.code_commercial).subscribe(data => {
        this.infoCommercial = data
      })
  }

  showPaiement = null
  initPaiement(prospect) {
    this.showPaiement = prospect
    this.payementList = prospect?.payement
  }
  savePaiement() {
    this.admissionService.updateV2({ _id: this.showPaiement._id, payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.prospects.splice(this.prospects.indexOf(this.showPaiement), 1, data)
      this.showPaiement = null
    })
  }

  showDocuments = null
  initDocument(prospect) {
    this.showDocuments = prospect
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
  }

}
