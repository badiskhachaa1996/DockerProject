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
import { io } from 'socket.io-client';
import { SocketService } from 'src/app/services/socket.service';

import { SelectButtonModule } from 'primeng/selectbutton';
import { environment } from 'src/environments/environment';
import { ProspectIntuns } from 'src/app/models/ProspectIntuns';


@Component({
  selector: 'app-gestion-preinscriptions',
  templateUrl: './gestion-preinscriptions.component.html',
  styleUrls: ['./gestion-preinscriptions.component.scss']
})
export class GestionPreinscriptionsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;
  code = this.ActiveRoute.snapshot.paramMap.get('code');

  socket = io(environment.origin.replace('/soc', ''));

  users: User[] = [];
  prospects: any[] = [];
  alternants: Prospect[] = [];
  inscriptionSelected: Prospect;
  showUploadFile: Prospect;
  prospectsIntuns: ProspectIntuns[];
  ListDocuments: String[] = []
  token;
  dataCommercial: CommercialPartenaire;
  infoCommercialExpand: CommercialPartenaire;
  ListPiped: String[] = []
  showPayement: Prospect
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  // L1 L2 L3 M1 M2 BAC Lycée
  DocPresent = [
    { label: "Relevé de note de semestre L1" },
    { label: "Relevé de note de semestre L2" },
    { label: "Relevé de note de semestre L3" },
    { label: "Relevé de note de semestre M1" },
    { label: "Relevé de note de semestre M2" },
    { label: "Relevé de note de semestre BAC" },
    { label: "Relevé de note de semestre Lycée" },
    { label: "Diplôme BAC" },
    { label: "Diplôme Licence" },
    { label: "Diplôme Master" },
    { label: "Curriculum Vitae" },
    { label: "Lettre de motivation" },
    { label: "Passeport" },
    { label: "Carte d'identité nationale" },
    { label: "Pièce d'identité" },
    { label: "Attestation de travail" },
    { label: "Attestation de stage" },
    { label: "Certifications (tout type de certification)" },
    { label: "Lettre de recommandation" },
    { label: "Attestation d'inscription en Licence niveau X" },
    { label: "Attestation de fréquentation" },
    { label: "Attestation de Réussite" },
  ]

  DocTypes2: any[] = [
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  statutList: any[] = [
    { value: "Manquants" },
    { value: "Passable" },
    { value: "Complet" },
    { value: "Manque orientation" }
  ]
  statutVisible = [
    { value: "Dossier suspendu - En attente du prospect" },
    { value: "Traitement Terminé" }
  ]

  listFR = [
    { value: "Pas de TCF - Pays non Francophone" },
    { value: "TCF B2 ou plus" },
    { value: "ELC B2 ou plus" },
    { value: "En cours de formation ILTS" },
    { value: "Non concerné" }
  ]
  decisionList = [
    { value: "Accepté" },
    { value: "Accepté sur réserve" },
    { value: "Suspendu" },
    { value: "Suspension - Test TCF" },
    { value: "Non Retenu" },
    { value: "Refusé" },
    { value: "En attente de traitement" },
    { value: "Payée" },
    { value: "A signé les documents" },
  ]
  dropdownDecision = [
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

  filterTraitement = [
    { value: null, label: "Tous les états" },
    { value: "Nouvelle", label: "Nouvelle" },
    { value: "Retour Etudiant", label: "Retour Etudiant" },
    { value: "Vu", label: "Vu" },
    { value: "Traité", label: "Traité" },
  ]

  phaseComplementaire = [
    { value: "Aucune" },
    { value: "Changement de campus" },
    { value: "Orientation E2E par Eduhorizons" },
    { value: "Choix de formation" },
    { value: "Document Manquant" },
    { value: "Ajouté sur la base ILTS" },
    { value: "En attente retour ILTS" },
    { value: "Sous Dossier" },
    { value: "En attente retour dep bim" },
    { value: "En attente retour Peda" },
    //{ value: "Demande équivalence envoyée" },
  ]

  statutPayement = [
    { value: "Aucun" },
    { value: "Pré-inscription" },
    { value: "Inscription" },
    { value: "Inscription définitive" },
  ]

  listAgent = [
    { value: "Aucun" },
    { value: "Haitham ELKADHI" },
    { value: "Dhekra Ben HAMIDA" },
    { value: "Moez BEN JABALLAH" },
    { value: "Dhouha KOBROSLY" },
    { value: "Maroua NOURI" },
    { value: "Malek KOBROSLY" },
    { value: "Feryel" },
    { value: "Elyes HAJJI" },
    { value: "Rania WARDENI" },
    { value: "Asma NJAH" },
    { value: "Islem DRIDI" },
    { value: "SLIM" },
    { value: "Achraf" },
  ]

  stat_cf = [
    { label: "Oui", value: true },
    { label: "Non", value: false }
  ]

  payementList = []
  filterCampus = [
    { value: null, label: "Tous les campus" },
  ]

  filterPays = [
    { value: null, label: "Tous les pays" }
  ]

  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })
  filterEcole = [{ value: null, label: "Toutes les écoles" },];


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

  addNewPayment() {
    this.admissionService.addNewPayment(this.showPayement._id, { payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Le paiement a été ajouté" })
      this.prospects.forEach((p, index) => {
        if (p._id == data._id)
          this.prospects[index].payement = data.payement
      })
      this.showPayement = null
      this.payementList = null
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur" })
    })
  }
  closeformUpdate() {

    this.socket.emit("CloseUpdProspect", this.inscriptionSelected);
    this.inscriptionSelected = null;
  }
  constructor(private ActiveRoute: ActivatedRoute, private userService: AuthService, private formBuilder: FormBuilder,
    private admissionService: AdmissionService, private router: Router, private messageService: MessageService, private commercialService: CommercialPartenaireService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.commercialService.getByUserId(this.token.id).subscribe(data => {
      if (data && data.code_commercial_partenaire) {
        this.dataCommercial = data
        localStorage.setItem("CommercialCode", data.code_commercial_partenaire)
      }
      this.refreshProspect()
      this.socket.on("TraitementProspect", (prospect) => {

        this.prospects.forEach((pros) => {

          if (pros.user_id._id == prospect.user_id._id) {
            this.prospects[this.prospects.indexOf(pros)].enTraitement = prospect.enTraitement;
          }
        })

      })
      this.socket.on("UpdatedProspect", (prospect) => {
        this.prospects.forEach((pros) => {
          if (pros.user_id._id == prospect.user_id._id) {
            this.prospects[this.prospects.indexOf(pros)].enTraitement = prospect.enTraitement;
          }
        })

      })
      this.socket.on("CloseUpdProspect", (prospect) => {
        this.prospects.forEach((pros) => {
          if (pros.user_id._id == prospect.user_id._id) {
            this.prospects[this.prospects.indexOf(pros)].enTraitement = prospect.enTraitement;
          }
        })
      })
      this.admissionService.getAllProspectsIntuns().subscribe(tempIntuns => {
        this.prospectsIntuns = tempIntuns
      })
    })

  }

  onRowSelect(event) {
    this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event });
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
    this.messageService.add({ severity: "info", summary: "Chargement des données ..." })
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user) => {
          this.users[user._id] = user;
        });
        if (this.code) {
          //Si il y a un code de Commercial
          if (this.code.length > 20) {
            //Si il est considéré comme Admin dans son Partenaire
            console.log("Admin Commercial")
            this.admissionService.getAllByCodeAdmin(this.code).subscribe(
              ((responseAdmission) => this.afterProspectload(responseAdmission)),
              ((error) => { console.error(error); })
            );
          } else {
            console.log("Agent Commercial")
            //Si il n'est pas considéré Admin dans son partenaire
            this.admissionService.getAllCodeCommercial(this.code).subscribe(
              ((responseAdmission) => this.afterProspectload(responseAdmission)),
              ((error) => { console.error(error); })
            );
          }

        } else {
          console.log("Admission")
          this.userService.getPopulate(this.token.id).subscribe(dataU => {
            let service: any = dataU.service_id
            if (dataU.role == "Admin" || (dataU.role != "user" && service && service.label.includes('Admission'))) {
              this.admissionService.getAll().subscribe(
                ((responseAdmission) => this.afterProspectload(responseAdmission)),
                ((error) => { console.error(error); })
              );
            }
          })
        }
      }),
      ((error) => { console.error(error); })
    );
    this.onGetProspectAlternance()
  }

  afterProspectload(data: Prospect[]) {
    this.prospects = data
    this.messageService.add({ severity: "success", summary: "Chargement des données terminé" })
    let tempList = []
    let tempType = []
    let tempPays = []
    data.forEach(p => {
      if (tempList.includes(p.campus_choix_1) == false) {
        tempList.push(p.campus_choix_1)
        this.filterCampus.push({ label: p.campus_choix_1, value: p.campus_choix_1 })
      }
      if (tempType.includes(p.type_form) == false) {
        tempType.push(p.type_form)
        this.filterEcole.push({ label: p.type_form, value: p.type_form })
      }
      let u: any = p.user_id
      if (u && u.pays_adresse && tempPays.includes(u.pays_adresse) == false) {
        tempPays.push(u.pays_adresse)
        this.filterPays.push({ label: u.pays_adresse, value: u.pays_adresse })
      }
    })
  }

  changeStateForm: FormGroup = new FormGroup({
    statut: new FormControl(this.statutList[0], Validators.required),
    statut_fr: new FormControl(this.listFR[0]),
    decision_admission: new FormControl(this.decisionList[0]),
    phase_complementaire: new FormControl(this.phaseComplementaire[0]),
    statut_payement: new FormControl(this.statutPayement[0]),
    traited_by: new FormControl(this.listAgent[0]),
    validated_cf: new FormControl(false),
    avancement_visa: new FormControl(false),
    dossier_traited_by: new FormControl(this.listAgent[0]),
    remarque: new FormControl(""),
    document_present: new FormControl(""),
    document_manquant: new FormControl(""),
  })


  initStatutForm(prospect: Prospect) {

    this.socket.emit("TraitementProspect", this.inscriptionSelected)


    this.changeStateForm.patchValue({
      statut: { value: prospect.statut_dossier },
      statut_fr: { value: prospect.tcf },
      decision_admission: { value: prospect.decision_admission },
      phase_complementaire: { value: prospect.phase_complementaire },
      statut_payement: { value: prospect.statut_payement },
      customid: prospect.customid,
      traited_by: { value: prospect.traited_by },
      validated_cf: prospect.validated_cf,
      avancement_visa: prospect.avancement_visa,
      remarque: prospect.remarque,
      dossier_traited_by: { value: prospect.dossier_traited_by },
      document_present: prospect.document_present,
      document_manquant: prospect.document_manquant
    })
  }

  generateCode(prospect: Prospect) {
    let user: any = prospect.user_id
    let code_pays = user.nationnalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[user.nationnalite] && code[user.nationnalite] != undefined) {
        code_pays = code[user.nationnalite]
      }
    })
    let prenom = user.firstname.substring(0, 1)
    let nom = user.lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(prospect.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = this.prospects.length.toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r

  }

  changeStateBtn() {
    let p = {
      _id: this.inscriptionSelected._id,
      dossier_traited_by: this.changeStateForm.value.dossier_traited_by.value,
      document_present: this.changeStateForm.value.document_present,
      statut_dossier: this.changeStateForm.value.statut.value,
      tcf: this.changeStateForm.value.statut_fr.value,
      document_manquant: this.changeStateForm.value.document_manquant,
      agent_id: this.token.id,
      decision_admission: this.changeStateForm.value.decision_admission.value,
      phase_complementaire: this.changeStateForm.value.phase_complementaire.value,
      statut_payement: this.changeStateForm.value.statut_payement.value,
      customid: this.generateCode(this.inscriptionSelected),
      traited_by: this.changeStateForm.value.traited_by.value,
      validated_cf: this.changeStateForm.value.validated_cf,
      avancement_visa: this.changeStateForm.value.avancement_visa,
      etat_traitement: "Traité",
      remarque: this.changeStateForm.value.remarque
    }
    this.admissionService.updateStatut(this.inscriptionSelected._id, p).subscribe((dataUpdated) => {

      this.messageService.add({ severity: "success", summary: "Le statut du prospect a été mis à jour" })
      this.socket.emit("UpdatedProspect", this.inscriptionSelected);
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

  onGetFormAdmissionEDUHORIZONS() {
    this.router.navigate(['formulaire-admission', 'eduhorizons']);
  }

  openNewForm(namedRoute: string) {
    let newRelativeUrl = namedRoute
    let baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }

  downloadFile(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

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
        this.prospects.forEach(p => {
          if (p._id == this.showUploadFile._id) {
            this.prospects[this.prospects.indexOf(p)].haveDoc = true
            this.socket.emit("UpdatedProspect", this.prospects[this.prospects.indexOf(p)]);
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

  deleteProspect(p: Prospect) {
    let bypass: any = p.user_id
    if (confirm("Est ce que vous êtes sûr de vouloir supprimer " + bypass.firstname + " " + bypass.lastname + " ?"))
      this.admissionService.delete(p._id, bypass._id).subscribe(d => {
        this.messageService.add({ severity: 'success', summary: 'Suppression de ' + bypass.firstname + " " + bypass.lastname, detail: 'Le prospect a bien été supprimé' });
        this.prospects.splice(this.prospects.indexOf(p), 1)
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Suppression de ' + bypass.firstname + " " + bypass.lastname, detail: 'Une erreur est arrivé\n' + error.error });
      });
  }

  showDossier(p: Prospect) {
    let bypass: any = p.user_id
    this.router.navigate(['suivi-preinscription', bypass._id]);
  }


  filtedTable: any[] = []

  onFilter(event, dt) {
    this.filtedTable = event.filteredValue;
  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
    if (this.filtedTable.length < 1)
      this.filtedTable = this.prospects
    this.filtedTable.forEach(p => {
      let t = {}
      t['NOM'] = p?.user_id?.lastname
      t['Prenom'] = p?.user_id?.firstname
      t['Date de la demande'] = p?.date_creation
      t['Date de naissance'] = p.date_naissance
      t['Pays de residence'] = p['pays_de_residence']
      t['Nationalite'] = p?.user_id?.nationnalite
      t['Email'] = p?.user_id?.email
      t['Telephone'] = p?.user_id?.indicatif + p?.user_id?.phone
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
      t['Nom du garant'] = p?.nomGarant?.toUpperCase()
      t['Prenom du garant'] = p?.prenomGarant
      t['Nom de l\'agence'] = p?.nomAgence
      t['Code du commercial'] = p?.code_commercial
      t['Autre'] = p.other
      t['A des documents'] = (p.haveDoc) ? "Oui" : "Non"
      t['Decision Admission'] = p.decision_admission
      t['Phase complémentaire'] = p.phase_complementaire
      t['Statut Paiement'] = p.statut_payement
      t['ID Etudiant'] = p.customid
      t['Att Traité par'] = p.traited_by
      t['Rentrée Scolaire'] = p.rentree_scolaire
      t['Confirmation CF'] = (p.validated_cf) ? "Oui" : "Non"
      if (p.agent_id && this.users[p.agent_id] && this.users[p.agent_id].lastname) {
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

  onGetProspectAlternance() {
    this.admissionService.getByAllAlternance().subscribe(
      ((response) => { this.alternants = response; console.log(response) }),
      ((error) => { console.error(error); })
    )
  }

}
