import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { saveAs } from "file-saver";
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import mongoose from 'mongoose';
@Component({
  selector: 'app-list-prospects',
  templateUrl: './list-prospects.component.html',
  styleUrls: ['./list-prospects.component.scss']
})
export class ListProspectsComponent implements OnInit {

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

  documentDropdown = [
    { label: "Inscription", value: "inscription" },
    { label: "Préinscription", value: "preinscription" },
    { label: "Paiement", value: "paiement" },
    { label: "Paiement préinscription", value: "paiement-preinscription" },
    { label: "Paiement préinscription - acompte", value: "paiement-preinscription-acompte" },
    { label: "Paiement acompte", value: "paiement-acompte" },
    { label: "Dérogation", value: "derogation" },
    { label: "Lettre d'acceptation", value: "lettre-acceptation" },
  ]
  uploadAdminFileForm: FormGroup = new FormGroup({
    //typeDoc: new FormControl(this.DocTypes[0], Validators.required),
    date: new FormControl(this.convertTime(new Date), Validators.required),
    nom: new FormControl("", Validators.required),
    note: new FormControl(""),
    traited_by: new FormControl("", Validators.required),
    type: new FormControl(""),
  })
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
  generateCustomID(nom) {
    let reeldate = new Date();

    let date = (reeldate.getDate()).toString() + (reeldate.getMonth() + 1).toString() + (reeldate.getFullYear()).toString();

    let random = Math.random().toString(36).substring(5).toUpperCase();

    nom = nom.substr(0, 2).toUpperCase();

    return 'DOC' + nom + date + random;
  }
  @ViewChild('fileInput') fileInput: FileUpload;
  FileUploadAdmin(event: { files: [File], target: EventTarget }) {

    if (this.uploadAdminFileForm.valid && event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.showUploadFile._id)
      formData.append('date', this.uploadAdminFileForm.value.date)
      formData.append('note', this.uploadAdminFileForm.value.note)
      formData.append('nom', this.uploadAdminFileForm.value.nom)
      formData.append('type', this.uploadAdminFileForm.value.type)
      formData.append('custom_id', this.generateCustomID(this.uploadAdminFileForm.value.nom))
      formData.append('traited_by', this.uploadAdminFileForm.value.traited_by)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.admissionService.uploadAdminFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        console.log(res)
        if (res.documents_administrative)
          this.prospects[this.prospects.indexOf(this.showUploadFile)].documents_administrative = res.documents_administrative
        event.target = null;
        this.showUploadFile = null;

        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  downloadAdminFile(path) {
    this.admissionService.downloadFileAdmin(this.showDocuments._id, path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })

  }


  downloadFile(doc: { date: Date, nom: String, path: String }) {
    this.admissionService.downloadFile(this.showDetails._id, `${doc.nom}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  docToUpload: { date: Date, nom: string, path: string, _id: string }
  initUpload(doc: { date: Date, nom: string, path: string, _id: string }, id = "selectedFile") {
    this.docToUpload = doc
    document.getElementById(id).click();
  }

  uploadFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.showDetails._id);
    formData.append('document', `${this.docToUpload.nom}`);
    formData.append('file', event[0]);
    this.admissionService.uploadFile(formData, this.showDetails._id).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.showDetails.documents_dossier.splice(this.showDetails.documents_dossier.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })
      this.admissionService.updateV2({ documents_dossier: this.showDetails.documents_dossier, _id: this.showDetails._id }, "Affectation du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });
  }

  delete(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.showDetails.documents_dossier[this.showDetails.documents_dossier.indexOf(doc)].path = null
    this.admissionService.deleteFile(this.showDetails._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.admissionService.updateV2({ documents_dossier: this.showDetails.documents_dossier, _id: this.showDetails._id }, "Suppression d'un document du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    })

  }

  addDoc() {
    this.showDetails.documents_autre.push({ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  uploadOtherFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.showDetails._id);
    formData.append('document', `${this.docToUpload._id}`);
    formData.append('file', event[0]);
    this.admissionService.uploadFile(formData, this.showDetails._id).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.showDetails.documents_autre.splice(this.showDetails.documents_autre.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })

      this.admissionService.updateV2({ documents_autre: this.showDetails.documents_autre, _id: this.showDetails._id }, "Ajout d'un document du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });

  }
  deleteOther(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.showDetails.documents_autre.splice(this.showDetails.documents_autre.indexOf(doc), 1)
    this.admissionService.updateV2({ documents_autre: this.showDetails.documents_autre, _id: this.showDetails._id }, "Suppression d'un document autre Lead-Dossier").subscribe(a => {
      console.log(a)
    })
    this.admissionService.deleteFile(this.showDetails._id, `${doc._id}/${doc.path}`).subscribe(p => {
      console.log(p)

    })
  }

  downloadOtherFile(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.admissionService.downloadFile(this.showDetails._id, `${doc._id}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
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
    { value: "Paris - France", label: "Paris - France" },
    { value: "Montpellier - France", label: "Montpellier - France" },
    { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
    { value: "Rabat - Maroc", label: "Rabat - Maroc" },
    { value: "La Valette - Malte", label: "La Valette - Malte" },
    { value: "UAE - Dubai", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ]
  dropdownCampus = [
    { value: "Paris - France", label: "Paris - France" },
    { value: "Montpellier - France", label: "Montpellier - France" },
    { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
    { value: "Rabat - Maroc", label: "Rabat - Maroc" },
    { value: "La Valette - Malte", label: "La Valette - Malte" },
    { value: "UAE - Dubai", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ]
  filterSource = [
    { value: null, label: 'Tous les sources' }, { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Site web ESTYA", value: "Site web ESTYA" },
    { label: "Site web Ecole", value: "Site web" },
    { label: "Equipe communication", value: "Equipe communication" },
    { label: "Bureau Congo", value: "Bureau Congo" },
    { label: "Bureau Maroc", value: "Bureau Maroc" },
    { label: "Collaborateur interne", value: "Collaborateur interne" },
    { label: "Report", value: "Report" },
    { label: "IGE", value: "IGE" }
  ]
  dropdownDecisionAdmission = [
    { value: null, label: "Décisions Admission" },
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
    { value: null, label: "Décisions Orientation" },
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
  filterProgramme = [
    { value: null, label: "Toutes les langues" },
    { value: "Programme Français", label: "Programme Français", },
    { value: "Programme Anglais", label: "Programme Anglais", }
  ];
  filterRythmeFormation = [
    { value: null, label: "Toutes les rythmes de formations" },
    { value: "Alternance", label: "Alternance" },
    { value: "Initiale", label: "Initiale" },
  ]
  filterPhase = [
    { value: null, label: "Toutes les phases de candidature" },
    { value: 'Non affecté', label: "Non affecté" },
    { value: "En phase d'orientation scolaire", label: "En phase d'orientation scolaire" },
    { value: "En phase d'admission", label: "En phase d'admission" },
    { value: "En phase d'orientation consulaire", label: "En phase d'orientation consulaire" },
    { value: "Inscription définitive", label: "Inscription définitive" },
    { value: "Recours", label: "Recours" },
  ]
  filterStatut: any[] = [
    { value: null, label: "Toutes les statuts de dossier" },
    { value: true, label: "Oui" },
    { value: false, label: "Non" }
  ]
  filterPaiement: any[] = [
    { value: null, label: "Toutes les statuts de paiements" },
    { value: "Oui", label: "Oui" },
    { value: "Non", label: "Non" }
  ]
  filterVisa = [
    { value: null, label: "Toutes les statuts de Visa" },
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Non", value: "Non" },
    { label: "Pas de retour", value: "Pas de retour" },
  ]
  filterRentreeScolaire = [
    { value: null, label: 'Toutes les rentrées scolaires' }
  ]
  filterEcole = []

  constructor(private PartenaireService: PartenaireService, private messageService: MessageService, private admissionService: AdmissionService, private TeamsIntService: TeamsIntService,
    private CommercialService: CommercialPartenaireService, private FAService: FormulaireAdmissionService, private route: ActivatedRoute) { }

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
    this.filterPays = this.filterPays.concat(environment.pays)
    this.token = jwt_decode(localStorage.getItem('token'));
    this.admissionService.getAll().subscribe(data => {
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
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => this.filterRentreeScolaire.push({ label: d.nom, value: d.nom }))
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filterFormation.push({ label: d.nom, value: d.nom })
        this.dropdownFormation.push({ label: d.nom, value: d.nom })
      })
    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.dropdownEcole.push({ label: d.titre, value: d.url_form })
        this.filterEcole.push({ label: d.titre, value: d.url_form })
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
  ppList = [
    { label: "Sous dossier", value: "Sous dossier" },
    { label: "En attente de validation BIM", value: "En attente de validation BIM" },
    { label: "Entretien de motivation", value: "Entretien de motivation" },
    { label: "Quiz Informatique", value: "Quiz Informatique" },
  ]

  dropdownFormation = []
  dropdownEcole = []

  stat_cf = [
    { label: "Oui", value: "Oui" },
    { label: "Non", value: "Non" },
    { label: "Non concerné", value: "Non concerné" },
  ]
  initTraitement(prospect: Prospect) {
    this.showTraitement = prospect
    this.traitementForm.patchValue({ ...prospect })
    if (prospect.dossier_traited_by == null)
      this.TeamsIntService.MIgetByUSERID(this.token.id).subscribe(data => {
        if (data)
          this.traitementForm.patchValue({ dossier_traited_by: data._id })
      })
  }
  saveTraitement(willClose = false) {
    this.admissionService.updateV2({ ...this.traitementForm.value }, "Traitement du dossier List des Leads").subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.prospects.splice(this.prospects.indexOf(this.showTraitement), 1, data)
      this.showTraitement = null
      this.traitementForm.reset()
    })
  }

  traitementForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    dossier_traited_by: new FormControl(),
    dossier_traited_date: new FormControl(new Date()),
    statut_dossier: new FormControl(),
    procedure_peda: new FormControl(""),
    decision_admission: new FormControl(""),
    note_decision: new FormControl(""),
    statut_payement: new FormControl(""),
    numero_dossier_campus_france: new FormControl(""),
    validated_cf: new FormControl(""),
    avancement_cf: new FormControl(''),
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
    numero_dossier_campus_france: new FormControl(''),
    type_form: new FormControl('', Validators.required),
    avancement_visa: new FormControl(''),


  })

  initDetails(prospect: Prospect) {
    this.showDetails = prospect
    this.payementList = prospect?.payement
    if (!this.payementList) { this.payementList = [] }
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
    if (!this.payementList) { this.payementList = [] }
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
    let date_cf = this.showDetails.date_cf
    let date_visa = this.showDetails.date_visa
    if (this.detailsForm.value.avancement_visa != 'Pas de retour' && this.detailsForm.value.avancement_visa != this.showDetails.avancement_visa)
      date_visa = new Date()
    let date_inscription_def = this.showDetails.date_inscription_def
    if (this.detailsForm.value.avancement_cf == 'Entretien Validé' && this.detailsForm.value.avancement_cf != this.showDetails.avancement_cf)
      date_cf = new Date()
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
      avancement_cf: this.detailsForm.value.avancement_cf,
      logement: this.detailsForm.value.logement,
      numero_dossier_campus_france: this.detailsForm.value.numero_dossier_campus_france,
      avancement_visa: this.detailsForm.value.avancement_visa,
      payement: this.payementList,
      type_form: this.detailsForm.value.type_form,
      _id: this.showDetails._id,
      date_cf, date_visa, date_inscription_def

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
    { label: "Suspendu", value: "Suspendu" },
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

  typePaiement = [
    { value: null, label: "Aucun Suite a un renouvelement" },
    { value: "Chèque Montpellier", label: "Chèque Montpellier" },
    { value: "Chèque Paris", label: "Chèque Paris" },
    { value: "Chèque Tunis", label: "Chèque Tunis" },
    { value: "Compensation", label: "Compensation" },
    { value: "Espèce chèque Autre", label: "Espèce chèque Autre" },
    { value: "Espèce chèque Montpellier", label: "Espèce chèque Montpellier" },
    { value: "Espèce chèque Paris", label: "Espèce chèque Paris" },
    { value: "Espèce Congo", label: "Espèce Congo" },
    { value: "Espèce Maroc", label: "Espèce Maroc" },
    { value: "Espèce Montpellier", label: "Espèce Montpellier" },
    { value: "Espèce Paris", label: "Espèce Paris" },
    { value: "Espèce Tunis", label: "Espèce Tunis" },
    { value: "Lien de paiement", label: "Lien de paiement" },
    { value: "PayPal", label: "PayPal" },
    { value: "Virement", label: "Virement" },
    { value: "Virement chèque Autre", label: "Virement chèque Autre" },
    { value: "Virement chèque Montpellier", label: "Virement chèque Montpellier" },
    { value: "Virement chèque Paris", label: "Virement chèque Paris" },
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
    if (type == "type") {
      this.payementList[i][type] = event.value;
    } else if (type == "montant") {
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
  infoPartenaire: Partenaire
  expand(prospect: Prospect) {
    this.selectedProspect = prospect
    this.showSideBar = true
    this.infoPartenaire = null
    this.infoCommercial = null
    if (prospect.code_commercial)
      this.CommercialService.getByCode(prospect.code_commercial).subscribe(data => {
        this.infoCommercial = data
        this.PartenaireService.getById(data.partenaire_id).subscribe(datp => {
          this.infoPartenaire = datp
        })
      })
  }

  showPaiement: Prospect = null
  lengthPaiement = 0
  initPaiement(prospect) {
    this.showPaiement = prospect
    this.payementList = prospect?.payement
    if (!this.payementList) { this.payementList = [] }
    this.lengthPaiement = prospect?.payement?.length
  }
  savePaiement() {
    let statut_payement = "Oui" //TODO Vérifier length de prospect.payement par rapport à payementList
    let phase_candidature = "En phase d'orientation consulaire"
    if (this.payementList.length == 0) {
      statut_payement = this.showPaiement.statut_payement;
      phase_candidature = this.showPaiement.phase_candidature;
    }

    this.admissionService.updateV2({ _id: this.showPaiement._id, payement: this.payementList, statut_payement, phase_candidature }, "Modification des paiements Liste des leads").subscribe(data => {
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
  convertTime(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
