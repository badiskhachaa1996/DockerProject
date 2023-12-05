import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { GestionSourcesServices } from "../../gestion-srources/gestion-sources.services";
import {GestionOperationService} from "../../gestion-operation/gestion-operation.service";
import { CritereService } from 'src/app/services/crm/criteres-crm.service';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-suivre-lead',
  templateUrl: './suivre-lead.component.html',
  styleUrls: ['./suivre-lead.component.scss']
})
export class SuivreLeadComponent implements OnInit {
  showFollow: LeadCRM = null;
  token: any;
  userConnected :User;
  visible_contact:boolean=false;
  visible_qualification:boolean=false;
  visible_paiement:boolean=false;
  indexHistorique:number;
  indexQualification:number ;
  indexPaiement:number;
  docAdded:boolean=false;
  filterSource = [{ label: 'Toutes les sources', value: null }]
  buttonName:string="Ajouter";
  Actuelle_lead:LeadCRM = null
  followForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    operation:new FormControl(''),
    produit: new FormControl(''),
    rythme: new FormControl(''),
    ecole: new FormControl(''),
    formation: new FormControl(''),
    campus: new FormControl(''),
    note_choix: new FormControl(''),
    
    criteres_qualification: new FormControl(''),
    decision_qualification: new FormControl(''),
    note_qualification: new FormControl(''),
  })
  formAddHistorique = new FormGroup({
    canal: new FormControl(''),
    note: new FormControl(''),
    suite_contact: new FormControl('')
  })
  qualifiquationsForm=new FormGroup({
    criteres_qualification: new FormControl(''),
    decision_qualification: new FormControl(''),
    note_qualification: new FormControl(''),
  })
  paiementForm=new FormGroup({
    montant_paye: new FormControl(''),
    modalite_paiement: new FormControl(''),
    note: new FormControl(''),
  });
  formUpdatepaiementForm=new FormGroup({
    montant_paye: new FormControl(''),
    modalite_paiement: new FormControl(''),
    note: new FormControl(''),
  });
  formUpdateContact=new FormGroup({
    
    canal:new FormControl(''),
    note: new FormControl(''),
    suite_contact: new FormControl(''),
  })
  formUpdateQualification=new FormGroup({
    critere:new FormControl(''),
    commentaire:new FormControl(''),
  });
  memberList = []
  produitList = [];
  operationList = [];
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
  ]
  decisionList = [
    { label: 'En attente de traitement', value: 'En attente de traitement' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]
  constructor(private UserService: AuthService, private LCS: LeadcrmService, private ToastService: MessageService, private Products: GestionProduitsService,
    private TeamCRMService: TeamsCrmService, private FAService: FormulaireAdmissionService,private operationService:GestionOperationService,private sourceService:GestionSourcesServices,private critereService: CritereService,) { }
  @Input() LEAD_ID
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;

      }
    })

    this.LCS.getOneByID(this.LEAD_ID).subscribe(lead => {
      this.followForm.patchValue({ ...lead,produit:lead.produit[0],operation:lead.operation }); 
      setTimeout(() => {
        this.showFollow = lead;
      }, 10);
    });
      
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
        this.produitList.push({ label: val.nom, value: val.nom })
      })
    })
    this.operationService.GetAllOperation().subscribe(data => {
      data.forEach(val => {
        this.operationList.push({ label: val.nom, value: val.nom })
      })
    })
    this.sourceService.GetAllSource().subscribe(data => {
      data.forEach(val=>{
        this.filterSource.push({label:val.nom,value:val._id});
        this.canalList.push({label:val.nom,value:val._id});
      })
      });
    this.critereService.getAllCriteres().subscribe(data => {
      data.forEach(valc=>{
      this.critereList.push({label:valc.nom,value:valc.nom});})
      });
   }

  
  //Follow Form
  initFollow(lead: LeadCRM) {
    this.followForm.patchValue({...lead ,produit:lead.produit[0],operation:lead.operation})
    setTimeout(() => {
      this.showFollow = lead;
    }, 10);
    

  }

  onUpdateFollow() {
    console.log(this.showFollow);
    this.LCS.update({ ...this.followForm.value, contacts: this.showFollow.contacts, ventes: this.showFollow.ventes, mailing: this.showFollow.mailing, documents: this.showFollow.documents, }).subscribe(data => {
      
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
  onAddDocumment() {
    if (!this.docAdded) {
      this.docAdded = true;
      this.onAddDocuments();
      this.buttonName = "Enregistrer"

    } else {
      this.docAdded = false;
      this.onUpdateFollow();
      this.buttonName = "Ajouter"
    }

  }
  onAddQualifications(){
    this.showFollow.qualifications.push({...this.qualifiquationsForm.value})
    this.LCS.update(this.showFollow).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }
  onAddContact() {
    this.showFollow.contacts.push({ canal: '', contact_by: null, date_contact: null, note: '', suite_contact: '' })
  }

  deleteContact(index) {
    if (confirm("Voulez-vous vraiment supprimer ce contact  ?")){
    this.showFollow.contacts.splice(index, 1)
    
    this.LCS.update(this.showFollow).subscribe(data => {

      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }
  }
  onUpdateDate(listname, index, varname, value) {
    this.followForm[listname][index][varname] = new Date(value)
    this.showFollow.contacts[index][varname]=value;
    console.log(this.showFollow);
  }
  //Documents
  indexDocuments = 0
  onAddDocuments() {
    this.showFollow.documents.push({ nom: '', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }
  downloadFile(index) {
    this.indexDocuments = index
    console.log(this.showFollow._id, this.showFollow.documents[index]._id, this.showFollow.documents[index].path)
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
    if (confirm("Voulez-vous vraiment supprimer ce document  ?")){
    this.showFollow.documents.splice(index, 1)
    
    this.LCS.update(this.showFollow).subscribe(data => {
      
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });}
  }
  deletequalification(index){
    if (confirm("Voulez-vous vraiment supprimer cette qualification  ?")){
    this.showFollow.qualifications.splice(index, 1);
    this.LCS.update(this.showFollow).subscribe(data => {
      
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }}
  FileUpload(event) {
    console.log(event)
    if (event != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('document_id', this.showFollow.documents[this.indexDocuments]._id)
      formData.append('lead_id', this.showFollow._id)
      formData.append('file', event[0])
      this.LCS.uploadFile(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
     
        this.showFollow.documents[this.indexDocuments].path = event[0].name
        event = null;
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
    this.showFollow.ventes.push({ date_paiement: new Date(),...this.paiementForm.value});
    console.log(this.showFollow);
    this.LCS.update(this.showFollow).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }
  deletePaiement(index) {
    if (confirm("Voulez-vous vraiment supprimer ce paiement  ?")){
    this.showFollow.ventes.splice(index, 1)
    
    this.LCS.update(this.showFollow).subscribe(data => {
      
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
    }}
  onUpdatecontacte(index){
    this.indexHistorique=index
    console.log(this.showFollow.contacts[index].canal);
    this.formUpdateContact.patchValue({
    canal:this.showFollow.contacts[index].canal,
    note:this.showFollow.contacts[index].note, 
    suite_contact:this.showFollow.contacts[index].suite_contact,
    })
    setTimeout(() => {
      this.visible_contact=true
    }, 10);
  }
  updatequalification(index){
    this.indexQualification=index;
    this.formUpdateQualification.patchValue({
      critere:this.showFollow.qualifications[index].criteres_qualification,
      commentaire:this.showFollow.qualifications[index].note_qualification,
    })
    setTimeout(() => {
this.visible_qualification=true;
    },10);
  }
  Updatepaiement(index){
    this.indexPaiement=index;
    this.formUpdatepaiementForm.patchValue({
      montant_paye:this.showFollow.ventes[index].montant_paye,
      modalite_paiement:this.showFollow.ventes[index].modalite_paiement,
      note:this.showFollow.ventes[index].note
    })
    setTimeout(() => {
      this.visible_paiement=true
    }, 10);
  }

  onUpdateCon(){
    this.showFollow.contacts[this.indexHistorique].canal=this.formUpdateContact.value.canal;
    this.showFollow.contacts[this.indexHistorique].suite_contact=this.formUpdateContact.value.suite_contact;
    this.showFollow.contacts[this.indexHistorique].note=this.formUpdateContact.value.note;
    this.LCS.update(this.showFollow).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }
  onUpdatequalification(){
    this.showFollow.qualifications[this.indexQualification].criteres_qualification=this.formUpdateQualification.value.critere;
    this.showFollow.qualifications[this.indexQualification].note_qualification=this.formUpdateQualification.value.commentaire;
    this.LCS.update(this.showFollow).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
    });
  }
  onUpdatepaiement(){
this.showFollow.ventes[this.indexPaiement].modalite_paiement=this.formUpdatepaiementForm.value.modalite_paiement;
this.showFollow.ventes[this.indexPaiement].montant_paye=this.formUpdatepaiementForm.value.montant_paye;
this.showFollow.ventes[this.indexPaiement].note=this.formUpdatepaiementForm.value.note;
this.LCS.update(this.showFollow).subscribe(data => {
  this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
});

  }
  
}
