import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { saveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-leads-qualifies',
  templateUrl: './leads-qualifies.component.html',
  styleUrls: ['./leads-qualifies.component.scss']
})
export class LeadsQualifiesComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  civiliteList: any = [
    { label: 'Monsieur', value: 'Monsieur' },
    { label: 'Madame', value: 'Monsieur' },
    { label: 'Autre', value: 'Monsieur' },
  ];
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
  ]
  filterPays = [
    { label: 'Tous les pays', value: null }
  ]
  nationaliteDropdown = environment.nationalites
  paysDropdown = environment.pays
  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];
  niveauFR =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
      { label: "Aucun de ces choix", value: "Aucun de ces choix" },
    ]
  niveauEN =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "Avancé", value: "Avancé" },
      { label: "Intermédiaire", value: "Intermédiaire" },
      { label: "Basique", value: "Basique" },
      { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
    ]
  nivDropdown = [
    { label: 'Pré-bac', value: 'Pré-bac' },
    { label: 'Bac +1', value: 'Bac +1' },
    { label: 'Bac +2', value: 'Bac +2' },
    { label: 'Bac +3', value: 'Bac +3' },
    { label: 'Bac +4', value: 'Bac +4' },
    { label: 'Bac +5', value: 'Bac +5' },
  ];
  filterSource = [
    { label: 'Toutes les sources', value: null },
    { label: 'Facebook', value: 'Facebook' },
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Appel Telephonique', value: 'Appel Telephonique' },
    { label: 'Mail', value: 'Mail' },
    { label: 'Visite au site', value: 'Visite au site' },
    { label: 'Online Meeting', value: 'Online Meeting' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Recyclage', value: 'Recyclage' },
  ]

  filterOperation = [
    { label: 'Toutes les operations', value: null },
    { label: 'Prospection FRP', value: 'Prospection FRP' },
    { label: 'Prospection ENP', value: 'Prospection ENP' },
    { label: 'Prospection ICBS Malte', value: 'Prospection ICBS Malte' },
    { label: 'Prospection ICBS Dubai', value: 'Prospection ICBS Dubai' },
  ]

  filterAffecte = [
    { label: 'Tous les membres', value: null }
  ]
  filterProduit = [
    { label: 'Tous les produits', value: null },
    { label: 'WIP', value: 'WIP' },
    { label: 'WIP2', value: 'WIP2' },
    { label: 'WIP3', value: 'WIP3' },
  ]
  filterQualification = [
    { label: 'Tous les qualifications', value: null },
    { label: 'En attente de traitement', value: 'En attente de traitement' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]

  filterPaiement = [
    { label: 'Tous les modalités de paiements', value: null },
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

  filterEcole = [
    { label: 'Toutes les écoles', value: null }

  ]

  filterCampus = [
    { label: 'Toutes les campus', value: null },
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Congo Brazzaville', value: 'Congo Brazzaville' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Malte', value: 'Malte' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'En ligne', value: 'En ligne' }
  ]

  filterFormation = [
    { label: 'Toutes les formations', value: null }
  ]


  constructor(private LCS: LeadcrmService, private ToastService: MessageService, private FAService: FormulaireAdmissionService,
    private ProspectService: AdmissionService, private TeamCRMService: TeamsCrmService, private route: ActivatedRoute) { }
  leads: LeadCRM[] = []
  ngOnInit(): void {
    if (!this.ID)
      this.LCS.getAllQualifies().subscribe(data => {
        this.leads = data
      })
    else
      this.LCS.getAllQualifiesByID(this.ID).subscribe(data => {
        this.leads = data
      })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(f => {
        this.ecoleList.push({ label: f.titre, value: f._id })
        this.filterEcole.push({ label: f.titre, value: f._id })
      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.formationList.push({ label: d.nom, value: d._id })
        this.filterFormation.push({ label: d.nom, value: d._id })
      })
    })
    this.filterPays = this.filterPays.concat(environment.pays)
    this.TeamCRMService.MIgetAll().subscribe(data => {
      data.forEach(val => {
        this.filterAffecte.push({ label: `${val.user_id.firstname} ${val.user_id.lastname.toUpperCase()}`, value: val._id })
      })

    })

  }

  //Follow Form
  showFollow: LeadCRM = null
  followForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    rythme: new FormControl(''),
    ecole: new FormControl(''),
    formation: new FormControl(''),
    campus: new FormControl(''),
    eduhorizon: new FormControl(''),
    note_choix: new FormControl(''),

    produit: new FormControl(''),
    criteres_qualification: new FormControl(''),
    decision_qualification: new FormControl(''),
    note_qualification: new FormControl(''),
  })


  initFollow(lead: LeadCRM) {
    this.followForm.patchValue({ ...lead })
    this.showFollow = lead
  }

  onUpdateFollow() {
    this.LCS.update({ ...this.followForm.value, contacts: this.showFollow.contacts, ventes: this.showFollow.ventes, mailing: this.showFollow.mailing, documents: this.showFollow.documents }).subscribe(data => {
      this.leads.splice(this.leads.indexOf(this.showFollow), 1, data)
      this.followForm.reset()
      this.showFollow = null
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    })
  }

  onUpdateDate(listname, index, varname, value) {
    this.followForm[listname][index][varname] = new Date(value)
  }

  //Contact
  memberList = [{ label: "Jean Pierre Test", value: new mongoose.Types.ObjectId("6474bd8044e14520f9dd5f38").toString() }]
  canalList = [
    { label: "Facebook", value: "Facebook" },
    { label: "WhatsApp", value: "WhatsApp" },
    { label: "Appel Téléphonique", value: "Appel Téléphonique" },
    { label: "Mail", value: "Mail" },
    { label: "Visite au Site", value: "Visite au Site" },
    { label: "Online meeting", value: "Online meeting" },
  ]

  suiteContactList = [
    { label: "Joignable", value: "Joignable" },
    { label: "Non Joignable", value: "Non Joignable" },
  ]
  onAddContact() {
    this.showFollow.contacts.push({ canal: '', contact_by: null, date_contact: null, note: '', suite_contact: '' })
  }

  deleteContact(index) {
    this.showFollow.contacts.splice(index, 1)
  }

  //Documents
  indexDocuments = 0
  onAddDocuments() {
    this.showFollow.documents.push({ nom: '', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }
  downloadFile(index) {
    this.indexDocuments = index
    this.LCS.downloadFile(this.showFollow._id, this.showFollow.documents[index]._id, this.showFollow.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), this.showFollow.documents[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }
  uploadFile(index) {
    this.indexDocuments = index
    document.getElementById('selectedFile').click();
  }
  deleteFile(index) {
    this.showFollow.documents.splice(index, 1)
  }

  FileUpload(event: { target: { files: File[] } }) {
    if (event.target.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('document_id', this.showFollow.documents[this.indexDocuments]._id)
      formData.append('lead_id', this.showFollow._id)
      formData.append('file', event.target.files[0])
      this.LCS.uploadFile(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        event.target.files = null;
        this.showFollow.documents[this.indexDocuments].path = event.target.files[0].name
        //this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  //Mail
  onAddMail() {
    this.showFollow.mailing.push({ date_envoie: new Date(), objet_mail: "", note: "" })
  }
  deleteMail(index) {
    this.showFollow.mailing.splice(index, 1)
  }
  //Paiements

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
  onAddPaiement() {
    this.showFollow.ventes.push({ date_paiement: new Date(), montant_paye: "", modalite_paiement: "", note: "" })
  }
  deletePaiement(index) {
    this.showFollow.ventes.splice(index, 1)
  }
  //Choix Prospect
  rythmeList = [
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
  ]

  ecoleList = [
  ]

  formationList = [
  ]

  campusList = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Congo Brazzaville', value: 'Congo Brazzaville' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Malte', value: 'Malte' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  ehList = [
    { label: 'Attestation sans blocage', value: 'Attestation sans blocage' },
    { label: 'Contrat de bail', value: 'Contrat de bail' },
    { label: 'Attestation avec blocage', value: 'Attestation avec blocage' },
  ]
  //Qualification
  produitList = [
    { label: 'WIP', value: 'WIP' },
    { label: 'WIP2', value: 'WIP2' },
    { label: 'WIP3', value: 'WIP3' },
  ]
  critereList = [
    { label: 'Langue', value: 'Langue' },
    { label: 'Volet Financier', value: 'Volet Financier' },
    { label: 'Age', value: 'Age' },
    { label: 'Motivation', value: 'Motivation' },
    { label: 'Dossier admission cohérant ', value: 'Dossier admission cohérant ' },
  ]
  //En attente de traitement ;Non qualifié, Pré-qualifié, Qualifié
  decisionList = [
    { label: 'En attente de traitement', value: 'En attente de traitement' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]

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
  //Envoyer à l'admission
  formTransfertUser = new FormGroup({
    civilite: new FormControl(''),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl(''),
    indicatif: new FormControl(''),
    email_perso: new FormControl('', Validators.required),
    role: new FormControl('user'),
    pays_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl(''),
    nationnalite: new FormControl('', Validators.required),
    _id: new FormControl('')
  })
  formTransfertProspect = new FormGroup({
    user_id: new FormControl(''),
    date_naissance: new FormControl(''),
    numero_whatsapp: new FormControl(''),
    validated_academic_level: new FormControl(''),
    statut_actuel: new FormControl(''),
    campus_choix_1: new FormControl(''),
    formation: new FormControl(''),
    rythme_formation: new FormControl(''),
    date_creation: new FormControl(''),
    type_form: new FormControl(''),
    indicatif_whatsapp: new FormControl(''),
    customid: new FormControl(''),
    payement: new FormControl(''), // TODO
    origin: new FormControl('CRM'),
    source: new FormControl(''),
    rentree_scolaire: new FormControl(''), //TODO
    languages_fr: new FormControl(''),
    languages_en: new FormControl(''),
    numero_telegram: new FormControl(''),
    indicatif_telegram: new FormControl(''),
    documents_administrative: new FormControl(''), //TODO
  })
  showTransfer: LeadCRM = null
  initTransferToSM(lead: LeadCRM) {
    this.showTransfer = lead
    let id_string = new mongoose.Types.ObjectId().toString()
    this.formTransfertProspect.patchValue({
      date_naissance: new Date(lead.date_naissance),
      numero_whatsapp: lead.numero_whatsapp,
      validated_academic_level: lead.dernier_niveau_academique,
      statut_actuel: lead.statut,
      campus_choix_1: lead.campus,
      formation: lead.formation,
      rythme_formation: lead.rythme,
      date_creation: new Date(lead.date_creation),
      type_form: lead.ecole,
      indicatif_whatsapp: lead.indicatif_whatsapp,
      customid: "CRM" + lead.custom_id,
      origin: 'CRM',
      source: lead.source,
      languages_fr: lead.niveau_fr,
      languages_en: lead.niveau_en,
      numero_telegram: lead.numero_telegram,
      indicatif_telegram: lead.indicatif_telegram,
      documents_administrative: lead.documents, //TODO
      user_id: id_string
    })
    this.formTransfertUser.patchValue({
      civilite: lead.civilite,
      firstname: lead.prenom,
      lastname: lead.nom,
      phone: lead.numero_phone,
      indicatif: lead.indicatif_phone,
      email_perso: lead.email,
      role: 'user',
      pays_adresse: lead.pays_residence,
      nationnalite: lead.nationalite,
      _id: id_string
    })
  }
  TransferToSM() {
    let payement = []
    let documents_administrative = []
    this.showTransfer.documents.forEach(val => {
      documents_administrative.push({ date: new Date(), nom: val.nom, path: val.path })
    })
    this.showTransfer.ventes.forEach(val => {
      let date = new Date()
      let id = (payement.length + 1).toString() + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
      payement.push({ type: val.modalite_paiement, montant: val.montant_paye, date: val.date_paiement, ID: id })
    })
    console.log({ newProspect: { ...this.formTransfertProspect.value, payement, documents_administrative }, newUser: { ...this.formTransfertUser.value } })
    this.ProspectService.create({ newProspect: { ...this.formTransfertProspect.value }, newUser: { ...this.formTransfertUser.value } }).subscribe(data => {
      //Déplacer les documents
      console.log(data)
      this.LCS.moveFiles({ prospect_id: data.prospect._id, lead_id: this.showTransfer._id }).subscribe(data=>{
        this.ToastService.add({ severity: 'success', summary: "Transfert des fichiers vers le module international" })
      })
      this.ToastService.add({ severity: 'success', summary: "Transfert vers le module international" })
      this.showTransfer = null
    })
  }

}
