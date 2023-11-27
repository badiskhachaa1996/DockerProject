import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { saveAs } from "file-saver";
import mongoose from 'mongoose';
import { AuthService } from 'src/app/services/auth.service';
import { GestionProduitsService } from '../../gestion-produits/gestion-produits.service';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-suivre-lead',
  templateUrl: './suivre-lead.component.html',
  styleUrls: ['./suivre-lead.component.scss']
})
export class SuivreLeadComponent implements OnInit {
  showFollow: LeadCRM = null;
  token: any;
  userConnected :User;
  docAdded:boolean=false
  buttonName:string="Ajouter";
  Actuelle_lead:LeadCRM = null
  followForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    rythme: new FormControl(''),
    ecole: new FormControl(''),
    formation: new FormControl(''),
    campus: new FormControl(''),
    note_choix: new FormControl(''),

    produit: new FormControl(''),
    criteres_qualification: new FormControl(''),
    decision_qualification: new FormControl(''),
    note_qualification: new FormControl(''),
  })
  formAddHistorique=new FormGroup({
    canal: new FormControl(''),
    note: new FormControl(''),
    suite_contact: new FormControl('')
  })
  memberList = []
  produitList = [];
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
  critereList = [
    { label: 'Langue', value: 'Langue' },
    { label: 'Volet Financier', value: 'Volet Financier' },
    { label: 'Age', value: 'Age' },
    { label: 'Motivation', value: 'Motivation' },
    { label: 'Dossier admission cohérant ', value: 'Dossier admission cohérant ' },
  ]
  decisionList = [
    { label: 'En attente de traitement', value: 'En attente de traitement' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]
  constructor(private UserService: AuthService,private LCS: LeadcrmService, private ToastService: MessageService, private Products: GestionProduitsService,
    private TeamCRMService: TeamsCrmService, private FAService: FormulaireAdmissionService) { }
  @Input() LEAD_ID
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe({
        next: (response) => {
          this.userConnected = response;
         
        }
      })
    
    this.LCS.getOneByID(this.LEAD_ID).subscribe(lead => {
      this.followForm.patchValue({ ...lead })
      this.showFollow = lead
    })
    this.TeamCRMService.MIgetAll().subscribe(data => {
      data.forEach(val => {
        this.memberList.push({ label: `${val.user_id.firstname} ${val.user_id.lastname.toUpperCase()}`, value: val._id })
      })

    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(f => {
        this.ecoleList.push({ label: f.titre, value: f._id })
      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.formationList.push({ label: d.nom, value: d._id })
      })
    })
    this.Products.GetAllProduit().subscribe(data => {
      data.forEach(val => {
        this.produitList.push({ label: val.nom, value: val._id })
      })
    })

  }
  //Follow Form
  initFollow(lead: LeadCRM) {
    this.followForm.patchValue({ ...lead })
    this.showFollow = lead
    
  }

  onUpdateFollow() {
    console.log(this.showFollow);
    this.LCS.update({ ...this.followForm.value, contacts: this.showFollow.contacts, ventes: this.showFollow.ventes, mailing: this.showFollow.mailing, documents: this.showFollow.documents }).subscribe(data => {
      this.followForm.reset()
      this.showFollow = null
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    })
  }
  onAddHistorique() {
    console.log(this.showFollow);
    
    this.showFollow.contacts.push({contact_by:this.userConnected?.firstname+" "+this.userConnected?.lastname, date_contact:new Date(),...this.formAddHistorique.value})
    this.LCS.update(this.showFollow).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
    
    
  }
  onAddDocumment(){
    if (!this.docAdded){
      this.docAdded = true;
      this.onAddDocuments();
      this.buttonName="Enregistrer"

    }else{
      this.docAdded = false;
      this.onUpdateFollow();
      this.buttonName="Ajouter"
    }

  }
  onAddContact() {
    this.showFollow.contacts.push({ canal: '', contact_by: null, date_contact: null, note: '', suite_contact: '' })
  }

  deleteContact(index) {
    this.showFollow.contacts.splice(index, 1)
    this.showFollow.contacts[index] = null;
    this.LCS.update(this.showFollow).subscribe(data => {
      
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
    
  }
  onUpdateDate(listname, index, varname, value) {
    this.followForm[listname][index][varname] = new Date(value)
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
    document.getElementById('selectedFilesuivre').click();
  }
  deleteFile(index) {
    this.showFollow.documents.splice(index, 1)
  }

  FileUpload(event: { target: { files: File[] } }) {
    console.log(event)
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
}
