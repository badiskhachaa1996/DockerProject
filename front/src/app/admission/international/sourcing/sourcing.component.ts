import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { environment } from 'src/environments/environment';
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { HistoriqueEmail } from 'src/app/models/HistoriqueEmail';
import { MailType } from 'src/app/models/MailType';
import mongoose from 'mongoose';
import { HistoriqueLead } from 'src/app/models/HistoriqueLead';
import { Router } from '@angular/router';
import { CandidatureLeadService } from 'src/app/services/candidature-lead.service';
import { VenteService } from 'src/app/services/vente.service';
import { Notification } from 'src/app/models/notification';
import { SocketService } from 'src/app/services/socket.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-sourcing',
  templateUrl: './sourcing.component.html',
  styleUrls: ['./sourcing.component.scss']
})
export class SourcingComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  //Informations necessaires pour l'upload de fichier
  showUploadFile: Prospect = null
  displayFilter: boolean = false;
  Fpays:String;Fcampus:String;Fformation:String;Frythme:String;Flangue:String;Fstatus:String;Fsource:String;Forientation:String;
  FDadmission:String;FSPayement:String;FSvisa:String;FphaseC:String;FRentree;
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
        this.prospects[this.showUploadFile.type_form].forEach(p => {
          if (p._id == this.showUploadFile._id) {
            this.prospects[this.showUploadFile.type_form][this.prospects[this.showUploadFile.type_form].indexOf(p)].haveDoc = true
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

  deleteFile(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.showDetails.documents_dossier[this.showDetails.documents_dossier.indexOf(doc)].path = null
    this.admissionService.deleteFile(this.showDetails._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.admissionService.updateV2({ documents_dossier: this.showDetails.documents_dossier, _id: this.showDetails._id }, "Suppresion d'un document du dossier Lead-Dossier").subscribe(a => {
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
    this.admissionService.updateV2({ documents_autre: this.showDetails.documents_autre, _id: this.showDetails._id }, "Suppresion d'un document autre Lead-Dossier").subscribe(a => {
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
      this.prospects[prospect.type_form][this.prospects[prospect.type_form].indexOf(prospect)].etat_traitement = "Vu"
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

  dropdownPhase = [
    { value: 'Non affecté', label: "Non affecté" },
    { value: "En phase d'orientation scolaire", label: "En phase d'orientation scolaire" },
    { value: "En phase d'admission", label: "En phase d'admission" },
    { value: "En phase d'orientation consulaire", label: "En phase d'orientation consulaire" },
    { value: "Inscription définitive", label: "Inscription définitive" },
    { value: "Recours", label: "Recours" },
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
    { value: null, label: 'Toutes les rentrées scolaires' },
  ]

  constructor(private messageService: MessageService, private PartenaireService: PartenaireService, private admissionService: AdmissionService,
    private FAService: FormulaireAdmissionService, private TeamsIntService: TeamsIntService, private CommercialService: CommercialPartenaireService,
    private UserService: AuthService, private EmailTypeS: EmailTypeService, private router: Router, private CandidatureLeadService: CandidatureLeadService,
    private VenteService: VenteService, private Socket: SocketService, private NotifService: NotificationService, private EmailService: EmailTypeService) { }

  prospects: any[];
  dicEcole = {}
  ecoleList: EcoleAdmission[] = []
  AccessLevel = "Spectateur"
  selectedProspect: Prospect = null

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
  token;
  candidatureDic = {}
  memberDic = {}
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.filterPays = this.filterPays.concat(environment.pays)
    this.CandidatureLeadService.getAll().subscribe(candidatures => {
      candidatures.forEach(v => {
        if (v.lead_id)
          this.candidatureDic[v.lead_id._id] = v
      })
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
          items.push({ label: `${element.user_id?.lastname} ${element.user_id?.firstname}`, value: element?._id })
          this.memberDic[element._id] = element
        })
        this.agentSourcingList.push({
          label: team,
          items
        })
      })
    })
    this.TeamsIntService.TIgetAll().subscribe(data => {
      data.forEach(element => {
        this.equipeSourcingList.push({ label: element.nom, value: element._id })
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

      /*this.admissionService.get100Sourcing().subscribe(data100 => {
        this.prospects = data100
        Object.keys(this.dicEcole).forEach((val, idx) => {
          if (!data100[val])
            this.ecoleList.splice(this.ecoleList.indexOf(this.dicEcole[val]), 1)
        })
      })*/
      this.admissionService.get100Sourcing().subscribe(dataP => {
        this.ecoleList = []
        data.forEach(d => {
          this.dropdownEcole.push({ label: d.titre, value: d.url_form })
          this.ecoleList.push(d)
          this.dicEcole[d.url_form] = d
        })
        this.prospects = dataP
        Object.keys(this.dicEcole).forEach((val, idx) => {
          if (!dataP[val])
            this.ecoleList.splice(this.ecoleList.indexOf(this.dicEcole[val]), 1)
        })
      }, error => { console.error(error) }, () => {
        this.admissionService.getAllSourcing().subscribe(newSourcing => {
          console.log(newSourcing,new Date())
          newSourcing.forEach(val => {
            if (this.prospects[val.type_form])
              this.prospects[val.type_form].push(val)
            else
              this.prospects[val.type_form] = [val]
          })
          this.ecoleList = []
          data.forEach(d => {
            this.ecoleList.push(d)
          })
          Object.keys(this.dicEcole).forEach((val, idx) => {
            if (!this.prospects[val])
              this.ecoleList.splice(this.ecoleList.indexOf(this.dicEcole[val]), 1)
          })
        })
      })

    })
    this.UserService.getPopulate(this.token.id).subscribe(data => {
      if (data.roles_list)
        data.roles_list.forEach(role => {
          if (role.module == "International")
            this.AccessLevel = role.role
        })
      if (data.role == "Admin")
        this.AccessLevel = "Super-Admin"
    })
  }

  //Partie Affectation

  showAffectation: Prospect = null

  agentSourcingList = [{ label: "Aucun", items: [{ label: "Aucun", value: null }] }]
  equipeSourcingList = [{ label: "Aucune", value: null }]
  dropdownFormation = []
  affectationForm: UntypedFormGroup = new FormGroup({
    agent_sourcing_id: new FormControl(null),
    team_sourcing_id: new FormControl(null),
    date_sourcing: new FormControl(new Date()),
    phase_candidature: new FormControl("")
  })

  initAffectation(prospect: Prospect) {
    this.showAffectation = prospect
    this.affectationForm.patchValue({ ...prospect })
    this.scrollToTop()
  }

  saveAffectation() {
    let data = {
      _id: this.showAffectation._id,
      ...this.affectationForm.value
    }
    if (data.agent_sourcing_id || data.team_sourcing_id) {
      data.phase_candidature = "En phase d'orientation scolaire"
      data.date_orientation = new Date()
    }
    this.admissionService.updateV2(data, "Affectation du dossier Sourcing").subscribe(newProspect => {
      this.prospects[newProspect.type_form].splice(this.prospects[newProspect.type_form].indexOf(this.showAffectation), 1, newProspect)
      this.showAffectation = null
      this.messageService.add({ severity: "success", summary: "Affectation du lead avec succès" })
      if (data.agent_sourcing_id) {
        this.Socket.NewNotifV2(this.memberDic[data?.agent_sourcing_id].user_id._id, `Le lead ${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname} vous a été attribué à la date ${new Date().toLocaleDateString('fr-FR')}`)
        this.NotifService.create(new Notification(null, null, false,
          `Le lead ${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname} vous a été attribué à la date ${new Date().toLocaleDateString('fr-FR')}`,
          new Date(), this.memberDic[data?.agent_sourcing_id].user_id._id, null)).subscribe(test => { })
        this.admissionService.sendMailAffectation({
          prospect_name: `${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname}`,
          date: new Date().toLocaleDateString('fr-FR'),
          email: this.memberDic[data?.agent_sourcing_id].user_id.email
        }).subscribe(() => { })
      } else if (data.team_sourcing_id) {
        this.TeamsIntService.MIgetAll().subscribe(mbs => {
          mbs.forEach(m => {
            if (m.team_id._id == data.team_sourcing_id) {
              this.Socket.NewNotifV2(m.user_id._id, `Le lead ${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname} vous a été attribué à la date ${new Date().toLocaleDateString('fr-FR')}`)
              this.NotifService.create(new Notification(null, null, false,
                `Le lead ${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname} vous a été attribué à la date ${new Date().toLocaleDateString('fr-FR')}`,
                new Date(), m.user_id._id, null)).subscribe(test => { })
              this.admissionService.sendMailAffectation({
                prospect_name: `${this.showAffectation?.user_id?.lastname} ${this.showAffectation?.user_id?.firstname}`,
                date: new Date().toLocaleDateString('fr-FR'),
                email: m.user_id.email
              }).subscribe(() => { })
            }

          })
        })


      }


    })
  }

  //Partie Details
  showDetails: Prospect = null
  dropdownEcole = []
  detailsForm: UntypedFormGroup = new FormGroup({
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
    phase_candidature: new FormControl(''),
    //Avancement consulaire
    a_besoin_visa: new FormControl(''),
    validated_cf: new FormControl(''),
    avancement_cf: new FormControl(''),
    logement: new FormControl(''),
    finance: new FormControl(''),
    avancement_visa: new FormControl(''),
    type_form: new FormControl('', Validators.required)


  })

  exportExcel(url_form) {
    let dataExcel = []
    //Clean the data
    this.prospects[url_form].forEach(p => {
      let t = {}
      t['Date Inscr.'] = p?.date_creation
      t['ID Lead'] = p?.customid
      t['Source'] = p?.source
      t['Prenom'] = p?.user_id?.firstname
      t['NOM'] = p?.user_id?.lastname
      t['Pays de residence'] = p?.user_id.pays_adresse
      let email = ""
      if (p?.user_id?.email)
        email = p?.user_id?.email
      if (p?.user_id?.email_perso)
        email = p?.user_id?.email_perso
      t['Adresse Email'] = email
      t['Numéro de téléphone'] = p?.user_id?.indicatif + p?.user_id?.phone
      t['Campus'] = p.campus_choix_1
      t['formation'] = p.formation
      t['Rentrée Scolaire'] = p.rentree_scolaire
      t['Initial/Alternant'] = p.rythme_formation
      t['Programme'] = p.programme
      t['Etat de dossier'] = p.statut_dossier
      t['Decision Orientation'] = p.decision_orientation
      t['Decision Admission'] = p.decision_admission
      t['Dossier Lead'] = p.haveDoc
      t['Statut Paiement'] = p.statut_payement
      t['Visa'] = p.avancement_visa
      t['Phase de Candidature'] = p.phase_candidature

      t['Date de naissance'] = p.date_naissance

      t['Nationalite'] = p?.user_id?.nationnalite


      t['Ecole demande'] = p?.type_form

      t['2eme choix'] = p.campus_choix_2
      t['3eme choix'] = p.campus_choix_3



      t['Dernier niveau academique'] = p.validated_academic_level
      t['Num WhatsApp'] = p.indicatif_whatsapp + " " + p.numero_whatsapp
      t['Statut pro actuel'] = p.statut_actuel
      t['Langues'] = p.languages
      t['Experiences pro'] = p.professional_experience
      t['Nom du garant'] = p?.nomGarant?.toUpperCase()
      t['Prenom du garant'] = p?.prenomGarant
      t['Nom de l\'agence'] = p?.nomAgence
      t['Code du commercial'] = p?.code_commercial
      t['Autre'] = p.other
      t['A des documents'] = (p.haveDoc) ? "Oui" : "Non"

      t['Phase complémentaire'] = p.phase_complementaire

      t['Att Traité par'] = p.traited_by

      t['Confirmation CF'] = (p.validated_cf) ? "Oui" : "Non"
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "sourcing" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }
  initalPayement = []
  partenaireOwned: string = null
  initDetails(prospect: Prospect) {
    this.showDetails = prospect
    this.admissionService.getFiles(prospect?._id).subscribe(
      (data) => {
        if (data) {
          this.ListDocuments = data
          this.ListPiped = []
          data.forEach(doc => {
            let docname: string = doc.replace("/", ": ").replace('releve_notes', 'Relevé de notes ').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
            this.ListPiped.push(docname)
          })
        }

      },
      (error) => { console.error(error) }
    );
    this.initalPayement = prospect?.payement
    let bypass: any = prospect.user_id
    this.detailsForm.patchValue({ ...bypass, ...prospect })
    this.payementList = prospect?.payement
    if (!this.payementList) { this.payementList = [] }
    this.scrollToTop()
    if (prospect.code_commercial)
      this.CommercialService.getByCode(prospect.code_commercial).subscribe(commercial => {
        this.partenaireOwned = commercial.partenaire_id
      })
  }

  saveDetails(willClose = false) {
    let bypass: any = this.showDetails?.user_id
    let user = {
      civilite: this.detailsForm?.value?.civilite,
      lastname: this.detailsForm?.value?.lastname,
      firstname: this.detailsForm?.value?.firstname,
      indicatif: this.detailsForm?.value?.indicatif,
      phone: this.detailsForm?.value?.phone,
      email_perso: this.detailsForm?.value?.email_perso,
      pays_adresse: this.detailsForm?.value?.pays_adresse,
      numero_adresse: this.detailsForm?.value?.numero_adresse,
      postal_adresse: this.detailsForm?.value?.postal_adresse,
      rue_adresse: this.detailsForm?.value?.rue_adresse,
      ville_adresse: this.detailsForm?.value?.ville_adresse,
      _id: bypass?._id
    }
    let date_cf = this.showDetails?.date_cf
    let date_visa = this.showDetails?.date_visa
    if (this.detailsForm?.value?.avancement_visa != 'Pas de retour' && this.detailsForm?.value?.avancement_visa != this.showDetails?.avancement_visa)
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
      type_form: this.detailsForm.value.type_form,
      finance: this.detailsForm.value.finance,
      payement: this.payementList,
      avancement_visa: this.detailsForm.value.avancement_visa,
      _id: this.showDetails._id,
      date_cf, date_visa, date_inscription_def

    }
    let listIDS = []
    this.initalPayement.forEach(payement => {
      listIDS.push(payement.ID)
    })
    if (this.detailsForm.value.decision_orientation != this.showDetails.decision_orientation) {
      this.Socket.NewNotifV2(this.showDetails.user_id._id, `La décision d'orientation est ${this.detailsForm.value.decision_orientation} , prise à la date ${new Date().toLocaleDateString('fr-FR')}`)

      this.NotifService.create(new Notification(null, null, false,
        `La décision d'orientation est ${this.detailsForm.value.decision_orientation} , prise à la date ${new Date().toLocaleDateString('fr-FR')}`,
        new Date(), this.showDetails.user_id._id, null)).subscribe(test => { })

      this.EmailService.defaultEmail({
        email: this.showDetails?.user_id?.email_perso,
        objet: '[IMS] Admission - Changement de décision orientation',
        mail: `
        <p>Cher(e) Etudiant,</p>
        <p>Nous avons le plaisir de vous informer que la décision d'orientation a été prise. </p>
        <p>La décision d'orientation est ${this.detailsForm.value.decision_orientation} et elle a été prise à la date ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>Nous vous remercions de votre confiance et de votre collaboration tout au long de ce parcours. </p>
        <p>Cordialement </p>
        `
      }).subscribe(() => { })
      if (this.showDetails.code_commercial)
        this.CommercialService.getByCode(this.showDetails.code_commercial).subscribe(commercial => {
          if (commercial) {
            this.Socket.NewNotifV2(commercial.user_id._id, `La décision d'orientation est ${this.detailsForm.value.decision_orientation} concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname}, prise à la date ${new Date().toLocaleDateString('fr-FR')}`)

            this.NotifService.create(new Notification(null, null, false,
              `La décision d'orientation est ${this.detailsForm.value.decision_orientation} concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname}, prise à la date ${new Date().toLocaleDateString('fr-FR')}`,
              new Date(), commercial.user_id._id, null)).subscribe(test => { })

            this.EmailService.defaultEmail({
              email: commercial.user_id?.email,
              objet: '[IMS] Admission - Changement de décision orientation d\'un de vos leads ',
              mail: `
            Cher(e) partenaire,

            Nous sommes ravis de vous informer que la décision d'orientation concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} a été prise. La décision d'orientation est ${this.detailsForm.value.decision_orientation} et elle a été prise à la date ${new Date().toLocaleDateString('fr-FR')}.
            
            Nous sommes convaincus que cette orientation sera bénéfique pour l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} et contribuera à son développement académique et professionnel. Nous tenons à vous remercier pour votre collaboration tout au long de ce processus d'orientation.
            
            Si vous avez des questions ou besoin de plus amples informations sur cette décision, n'hésitez pas à nous contacter. Nous sommes là pour soutenir l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} et assurer sa réussite.
            
            Nous apprécions grandement notre partenariat et nous sommes impatients de continuer à travailler ensemble pour accompagner les étudiants dans leur parcours éducatif.
            
            Cordialement,
            `
            }).subscribe(() => { })
          }
        })
    }
    if (this.detailsForm.value.decision_admission != this.showDetails.decision_admission) {
      this.Socket.NewNotifV2(this.showDetails.user_id._id, `La décision d'admission est ${this.detailsForm.value.decision_admission} , prise à la date ${new Date().toLocaleDateString('fr-FR')}`)

      this.NotifService.create(new Notification(null, null, false,
        `La décision d'admission est ${this.detailsForm.value.decision_admission} , prise à la date ${new Date().toLocaleDateString('fr-FR')}`,
        new Date(), this.showDetails.user_id._id, null)).subscribe(test => { })

      this.EmailService.defaultEmail({
        email: this.showDetails?.user_id?.email_perso,
        objet: '[IMS] Admission - Changement de décision admission',
        mail: `
        <p>Cher(e) Etudiant,</p>
        <p>Nous avons le plaisir de vous informer que la décision d'admission a été prise. </p>
        <p>La décision d'admission est ${this.detailsForm.value.decision_admission} et elle a été prise à la date ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>Nous vous remercions de votre confiance et de votre collaboration tout au long de ce parcours. </p>
        <p>Cordialement </p>
        `
      }).subscribe(() => { })
      if (this.showDetails.code_commercial)
        this.CommercialService.getByCode(this.showDetails.code_commercial).subscribe(commercial => {
          if (commercial) {
            this.Socket.NewNotifV2(commercial.user_id._id, `La décision d'admission est ${this.detailsForm.value.decision_admission} concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname}, prise à la date ${new Date().toLocaleDateString('fr-FR')}`)

            this.NotifService.create(new Notification(null, null, false,
              `La décision d'admission est ${this.detailsForm.value.decision_admission} concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname}, prise à la date ${new Date().toLocaleDateString('fr-FR')}`,
              new Date(), commercial.user_id._id, null)).subscribe(test => { })

            this.EmailService.defaultEmail({
              email: commercial.user_id?.email,
              objet: '[IMS] Admission - Changement de décision admission d\'un de vos leads ',
              mail: `
            Cher(e) partenaire,

            Nous avons le plaisir de vous informer que la décision d'admission concernant l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} a été prise. La décision d'admission est ${this.detailsForm.value.decision_admission} et elle a été prise à la date ${new Date().toLocaleDateString('fr-FR')}.
            
            Cette décision marque une étape importante dans le parcours académique de l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname}. Nous croyons fermement en son potentiel et sommes convaincus qu'il/elle apportera une contribution significative à notre établissement.
            
            Si vous avez des questions ou avez besoin de plus amples informations concernant cette décision d'admission, n'hésitez pas à nous contacter. Nous sommes là pour vous assister.
            
            Nous tenons à vous remercier à nouveau pour votre partenariat précieux et nous sommes impatients de continuer à travailler ensemble pour façonner l'avenir de nos étudiants.
            
            Cordialement,
          `
            }).subscribe(() => { })
          }
        })
    }
    if (this.initalPayement.toString() != this.payementList.toString()) {
      this.payementList.forEach((val, idx) => {
        if (val.ID && listIDS.includes(val.ID) == false) {
          let data: any = { prospect_id: this.showDetails._id, montant: val.montant, date_reglement: new Date(val.date), modalite_paiement: val.type, partenaire_id: this.partenaireOwned, paiement_prospect_id: val.ID }
          //Ajouter Notif Payement
          this.Socket.NewNotifV2(this.showDetails.user_id._id, `Vous avez effectuer un paiement de ${val.montant} à la date ${new Date(val.date).toLocaleDateString('fr-FR')} par ${val.type}`)

          this.NotifService.create(new Notification(null, null, false,
            `Vous avez effectuer un paiement de ${val.montant} à la date ${new Date(val.date).toLocaleDateString('fr-FR')} par ${val.type}`,
            new Date(), this.showDetails.user_id._id, null)).subscribe(test => { })
          if (this.showDetails.code_commercial)
            this.CommercialService.getByCode(this.showDetails.code_commercial).subscribe(commercial => {
              if (commercial) {
                this.Socket.NewNotifV2(commercial.user_id._id, `L'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} Lead a effecté un paiement de ${val.montant} à la date ${new Date(val.date).toLocaleDateString('fr-FR')} par ${val.type}`)

                this.NotifService.create(new Notification(null, null, false,
                  `L'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} Lead a effecté un paiement de ${val.montant} à la date ${new Date(val.date).toLocaleDateString('fr-FR')} par ${val.type}`,
                  new Date(), commercial.user_id._id, null)).subscribe(test => { })

                this.EmailService.defaultEmail({
                  email: commercial.user_id?.email,
                  objet: '[IMS] Admission - Ajout d\'un paiement d\'un de vos leads ',
                  mail: `
                  Cher partenaire,

                  Nous avons le plaisir de vous informer que l'étudiant ${this.showDetails?.user_id?.firstname} ${this.showDetails?.user_id?.lastname} a effectué un paiement de ${val.montant} à la date ${new Date(val.date).toLocaleDateString('fr-FR')} par ${val.type}.
                  
                  Nous tenons à vous remercier pour votre efficacité et votre professionnalisme dans le traitement de ce paiement. Votre collaboration nous aide à maintenir un processus de paiement fluide et efficace pour nos étudiants.
                  
                  Si vous avez des questions ou des préoccupations concernant ce paiement, n'hésitez pas à nous contacter. Nous sommes là pour vous aider et répondre à vos besoins.
                  
                  Nous apprécions grandement notre partenariat continu et nous sommes impatients de poursuivre notre collaboration fructueuse à l'avenir.
                  
                  Cordialement,
                `
                }).subscribe(() => { })
              }
            })
        }
      })
    }
    if (this.initalPayement.toString() != this.payementList.toString()) {
      this.payementList.forEach((val, idx) => {
        if (val.ID && listIDS.includes(val.ID) == false) {
          let data: any = { prospect_id: this.showDetails._id, montant: val.montant, date_reglement: new Date(val.date), modalite_paiement: val.type, partenaire_id: this.partenaireOwned, paiement_prospect_id: val.ID }
          this.VenteService.create({ ...data }).subscribe(v => {
            console.log(v)
            this.messageService.add({ severity: "success", summary: "Une nouvelle vente a été créé avec succès" })
          })
        }

      })
    }
    this.admissionService.update({ user, prospect }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.prospects[this.showDetails.type_form].splice(this.prospects[this.showDetails.type_form].indexOf(this.showDetails), 1, data)
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


  paysList = environment.pays;

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

  //Gestions de l'ARGENT

  payementList = []
  onAddPayement() {
    if (this.payementList == null) {
      this.payementList = []
    }
    this.payementList.push({ type: "", montant: 0, date: "", ID: this.generateIDPaiement() })
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
  generateIDPaiement() {
    let date = new Date()
    return (this.payementList.length + 1).toString() + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
  }

  deletePayement(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le paiement ?")) {
      this.payementList.splice(i, 1)
      if (this.payementList[i].ID)
        this.VenteService.deleteByPaymentID(this.payementList[i].ID).subscribe(data => {
          if (data)
            this.messageService.add({ severity: 'success', summary: 'La vente associé a été supprimé' })
        })
    }
  }
  showSideBar = false
  infoCommercial: CommercialPartenaire
  infoPartenaire: Partenaire
  expand(prospect: Prospect) {
    this.selectedProspect = prospect
    this.showSideBar = true
    this.infoCommercial = null
    if (prospect.code_commercial)
      this.CommercialService.getByCode(prospect.code_commercial).subscribe(data => {
        this.infoCommercial = data
        this.PartenaireService.getById(data.partenaire_id).subscribe(datp => {
          this.infoPartenaire = datp
        })
      })
  }

  delete(prospect: Prospect) {
    let { user_id }: any = prospect
    if (confirm('Voulez-vous vraiment supprimer ' + user_id?.lastname + " " + user_id?.firstname + " ?"))
      this.admissionService.delete(prospect._id, user_id._id).subscribe(data => {
        this.prospects[prospect.type_form].splice(this.prospects[prospect.type_form].indexOf(prospect), 1)
        this.messageService.add({ severity: "success", summary: "Lead supprimé avec succès" })
      })
  }

  showEmail = false
  prospectSendTo: Prospect = null
  emailTypeSelected: string = null
  mailDropdown = []
  mailTypeDropdown = []

  formEmailPerso = new UntypedFormGroup({
    objet: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    cc: new FormControl([]),
    send_from: new FormControl('', Validators.required)
  })
  formEmailType = new UntypedFormGroup({
    objet: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    cc: new FormControl([]),
    send_from: new FormControl('', Validators.required)
  })
  onEmailPerso() {
    console.log(this.formEmailPerso.value.cc)
    this.EmailTypeS.sendPerso({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: this.prospectSendTo.user_id.email_perso, send_from: this.formEmailPerso.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: this.prospectSendTo._id, send_from: this.formEmailPerso.value.send_from.email }).subscribe(data2 => {
        this.formEmailPerso.reset()
        this.historiqueEmails.push(data2)
        this.messageService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  onEmailType() {
    this.EmailTypeS.sendPerso({ ...this.formEmailType.value, send_by: this.token.id, send_to: this.prospectSendTo.user_id.email_perso, send_from: this.formEmailType.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({ ...this.formEmailType.value, send_by: this.token.id, send_to: this.prospectSendTo._id, send_from: this.formEmailType.value.send_from.email }).subscribe(data2 => {
        this.formEmailType.reset()
        this.historiqueEmails.push(data2)
        this.messageService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  initSendEmail(prospect: Prospect) {
    this.showEmail = true
    this.prospectSendTo = prospect
    this.EmailTypeS.HEgetAllTo(this.prospectSendTo._id).subscribe(data => {
      this.historiqueEmails = data
    })
    this.EmailTypeS.getAll().subscribe(data => {
      data.forEach(val => {
        this.mailDropdown.push({ label: val.email, value: val })
      })
    })
    this.EmailTypeS.MTgetAll().subscribe(data => {
      data.forEach(e => {
        this.mailTypeDropdown.push({ label: e.objet, value: e })
      })
    })
  }

  onMailType(event: MailType) {
    this.formEmailType.patchValue({
      ...event
    })
    this.piece_jointes = event.pieces_jointe
    this.mailTypeSelected = event
  }
  mailTypeSelected: MailType
  historiqueEmails: HistoriqueEmail[] = []
  piece_jointes = []

  //Gestion des PJs
  onDeletePJ(ri) {
    delete this.piece_jointes[ri]
  }

  uploadFilePJ: {
    date: Date,
    nom: string,
    path: string,
    _id: string
  } = null

  onAddPj() {
    this.piece_jointes.push({ date: new Date(), nom: "Téléverser le fichier s'il vous plaît", path: '', _id: new mongoose.Types.ObjectId().toString() })
  }
  downloadPJFile(pj) {
    this.EmailTypeS.downloadPJ(this.mailTypeSelected?._id, pj._id, pj.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, pj.path)
    }, (error) => {
      console.error(error)
    })
  }

  onUploadPJ(uploadFilePJ) {
    if (uploadFilePJ?.nom && uploadFilePJ.nom != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFile').click();
      this.uploadFilePJ = uploadFilePJ
    } else {
      this.messageService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }

  }

  FileUploadPJ(event: [File]) {
    console.log(event)
    if (event != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.mailTypeSelected?._id)
      formData.append('file', event[0])
      this.EmailTypeS.uploadPJ(formData).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.piece_jointes[this.piece_jointes.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  listHistorique: HistoriqueLead[] = []
  leadHistorique: Prospect
  initHistorique(lead: Prospect) {
    this.leadHistorique = lead
    this.admissionService.getAllHistoriqueFromLeadID(lead._id).subscribe(data => {
      this.listHistorique = data
    })
  }

  getDiff(histo: HistoriqueLead) {
    let keys = Object.keys(histo.lead_after)
    let r = ""
    keys.forEach(k => {
      if (histo.lead_after[k] && histo.lead_before[k] && (histo.lead_after[k].toString() != histo.lead_before[k].toString()))
        r = r + `${k} : ${histo.lead_before[k]} -> ${histo.lead_after[k]}\n`
    })
    if (histo.user_after && histo.user_before) {
      let keysUser = Object.keys(histo.user_after)
      keysUser.forEach(k => {
        if (histo.user_after[k] && histo.user_before[k] && (histo.user_after[k].toString() != histo.user_before[k].toString()))
          r = r + `${k} : ${histo.user_before[k]} -> ${histo.user_after[k]}\n`
      })
    }

    if (r == "")
      r = "Aucune modification n'a été trouvé, cela veut dire que c'est les données personnelles de l'user et non le dossier qui a été changé"
    r = r.replace('type_form', 'Ecole').replace('firstname', 'Prénom')
      .replace('lastname', 'Nom').replace('_', ' ').replace('campus choix 1', "Campus")

    return r
  }

  selectedLeads: Prospect[] = []
  showAffectationList = false

  affectationFormList: FormGroup = new FormGroup({
    agent_sourcing_id: new FormControl(null),
    team_sourcing_id: new FormControl(null),
    date_sourcing: new FormControl(new Date()),
    phase_candidature: new FormControl("")
  })
  onRowSelect(event) {
    if (this.selectedLeads.length != 0) {
      this.showAffectationList = true
      //this.scrollToTop()
    }
    if (this.selectedLeads.length == 1) {
      this.messageService.add({ severity: 'info', summary: "Vous pouvez affecter ou supprimer les leads via l'interface en haut de la page" })
    }

  }

  saveAffectationList() {
    let listIds = []
    this.selectedLeads.forEach(p => {
      listIds.push(p._id)
    })
    let data = {
      _id: listIds,
      ...this.affectationFormList.value
    }
    if (data.agent_sourcing_id || data.team_sourcing_id) {
      data.phase_candidature = "En phase d'orientation scolaire"
      data.date_orientation = new Date()
    }

    this.admissionService.updateMany(data, "Affectation du dossier Sourcing").subscribe(prospects => {
      prospects.forEach(newProspect => {
        this.prospects[newProspect.type_form].splice(this.prospects[newProspect.type_form].indexOf(this.showAffectation), 1, newProspect)
      })
      this.showAffectationList = false
      this.affectationFormList.reset()
      this.messageService.add({ severity: "success", summary: "Affectation du lead avec succès" })
    })
  }

  goToCandidature(id) {
    this.router.navigate(['admission/lead-candidature/', id])
  }

  deleteList() {
    if (confirm('Êtes-vous sûr de vouloir supprimer les leads selectionnés ?')) {
      let listIds = []
      let user_ids = []
      this.selectedLeads.forEach(p => {
        listIds.push(p._id)
        user_ids.push(p.user_id._id)
        this.prospects[p.type_form].splice(this.prospects[p.type_form].indexOf(p), 1)
      })
      this.admissionService.deleteMany(listIds, user_ids).subscribe(prospects => {
        this.showAffectationList = false
        this.affectationFormList.reset()
        this.messageService.add({ severity: "success", summary: "Suppresions des leads avec succès" })
      })
    }
  }
  showTimeline: Boolean = false
  dataTimeline: any[] = []
  onShowTimeline(p: Prospect) {
    this.dataTimeline = []
    this.dataTimeline.push({ status: "Inscription", date: p.date_creation })
    this.dataTimeline.push({ status: "Affectation", date: p.date_sourcing })
    this.dataTimeline.push({ status: "Contact", date: p.contact_date })
    this.dataTimeline.push({ status: "Décision Orientation", date: p.date_orientation })
    this.dataTimeline.push({ status: "Décision Admission", date: p.date_admission })
    if (p.payement && p.payement[0].date)
      this.dataTimeline.push({ status: "Paiement", date: p.payement[0].date })
    else
      this.dataTimeline.push({ status: "Paiement", date: null })
    this.dataTimeline.push({ status: "Confirmation campus France", date: p.date_cf })
    this.dataTimeline.push({ status: "Décision visa", date: p.decision_admission })
    this.dataTimeline.push({ status: "Inscription définitive", date: p.date_inscription_def })
    this.showTimeline = true
    console.log(this.dataTimeline)
  }

  clearFilter(){
    this.Fpays=null;this.Fcampus=null;this.Fformation=null;this.Frythme=null;this.Flangue=null;this.Fstatus=null;this.Fsource=null;this.Forientation=null;
    this.FDadmission=null;this.FSPayement=null;this.FSvisa=null;this.FphaseC=null;this.FRentree=null;

  }

}
