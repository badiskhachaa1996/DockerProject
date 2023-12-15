
import { Component, EventEmitter, OnInit, Output, ViewChild,Input } from '@angular/core';
import { FormControl,  FormGroup,  UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { saveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServService } from 'src/app/services/service.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-mes-leads',
  templateUrl: './mes-leads.component.html',
  styleUrls: ['./mes-leads.component.scss']
})
export class MesLeadsComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() myLead: Observable<LeadCRM>;


  // la propriété displayDialog pour contrôler l'affichage du pop-up
  displayDialog: boolean = false;


  // la méthode showDialog() pour activer le pop-up.
showDialog() {
  this.displayDialog = true;
}


//une méthode addTask() qui sera appelée lorsque le bouton "Ajouter" du formulaire est cliqué. Cette méthode peut traiter les données du formulaire et les ajouter à un tableau de tâches
    
description : string;

rappel: {
  id: number,
  dueDate: any,  // Ajustez le type au besoin (par exemple, Date ou string)
  description: string
} = {
  id: 0,
  dueDate: null,
  description: ''
};


rappels: Array<{ id: number, dueDate: any, description: string }> = [];
editingRappelIndex: number | null = null;

  generateNewId(): number {
    // Generate a random number between 1000 and 9999
    return Math.floor(1000 + Math.random() * 9000);
  }

  saveRappelChanges() {
    if (this.editingRappelIndex !== null) {
      this.rappels[this.editingRappelIndex] = { ...this.rappel };
      this.editingRappelIndex = null;
      this.rappel = { id: 0, dueDate: null, description: '' };
      this.saveRappels();
    }
  }

  addRappel() {
    if (this.editingRappelIndex !== null) {
      // Mise à jour d'un rappel existant
      this.rappels[this.editingRappelIndex] = { ...this.rappel };
      this.editingRappelIndex = null;
    } else {
      // Ajout d'un nouveau rappel avec un ID généré
      const newId = this.generateNewId();
      this.rappels.push({ ...this.rappel, id: newId });
      // Trier les rappels ici si nécessaire
      this.rappels.sort((a, b) => b.dueDate - a.dueDate);
    }
    this.rappel = { id: 0, description: '', dueDate: null }; // Réinitialiser le rappel
    this.saveRappels(); // Sauvegarder les rappels
  }

  editRappel(index: number) {
    this.editingRappelIndex = index;  // Store the index of the rappel being edited
    this.rappel = this.cloneRappel(this.rappels[index]);  // Clone the rappel for editing
console.log(this.cloneRappel(this.rappels[index]))
this.description = this.rappels[index].description
console.log(this.description)
this.Updatetache.patchValue({
  description:this.description
})
  }
  


  confirmDelete(rappelIndex: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.deleteRappel(rappelIndex);
    }
  }

  deleteRappel(index: number) {
    this.rappels.splice(index, 1);
    this.saveRappels();
  }

  saveRappels() {
    localStorage.setItem('rappels', JSON.stringify(this.rappels));
  }
 
  private generateUniqueId(): number {
    // Replace this with your own logic for generating unique IDs
    return new Date().getTime();
  }

  private cloneRappel(rappel: any): any {
    // Ici, nous clonons explicitement chaque propriété pour éviter les erreurs
    return {
      id: rappel.id,
      dueDate: rappel.dueDate,
      description: rappel.description,
      // Ajoutez toutes les autres propriétés nécessaires ici
    };
  }



  token;

  filterPays = [
    { label: 'Tous les pays', value: null }
  ]

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

  filterQualification = [
    { label: 'Tous les qualifications', value: null },
    
    { label: 'Non traitée', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'traitée', value: 'Qualifié' },
  ]

  filterAvancement = [
    { label: 'Tous les avancements', value: null },
    
    { label: 'Non traiée', value: 'Non traiée' },
    { label: 'En cours ', value: 'en cours' },
    { label: 'Traitée', value: 'traitée' },
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

  ID = this.route.snapshot.paramMap.get('id');

  constructor(private confirmationService: ConfirmationService,private LCS: LeadcrmService,private datePipe: DatePipe, private ToastService: MessageService, private UserService: AuthService, private ServiceServ: ServService, private FAService: FormulaireAdmissionService, private route: ActivatedRoute) { }
  leads: LeadCRM[] = []
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.LCS.getAllByID(this.token.id).subscribe(data => {
      this.leads = data
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
    this.filterPays = this.filterPays.concat(environment.pays)
    this.ServiceServ.getAServiceByLabel('Commercial').subscribe(dataS => {
      if (dataS)
        this.UserService.getAllByService(dataS.dataService._id).subscribe(data => {
          data.forEach(val => {
            this.memberList.push({ label: `${val.firstname} ${val.lastname.toUpperCase()}`, value: val._id })
            this.filterAffecte.push({ label: `${val.firstname} ${val.lastname.toUpperCase()}`, value: val._id })
          })
        })
      else
        console.error('Pas de service Commercial')
    })

    //taches
    this.token = jwt_decode(localStorage.getItem('token'));
     // Charger les tâches sauvegardées
     this.rappels = JSON.parse(localStorage.getItem('rappels')) || [];
     
     this.rappels.reverse();
     this.eventsSubscription = this.myLead.subscribe((lead) => {
      this.leads.push(lead)
    });
    
  }




  //Follow Form
  showFollow: LeadCRM = null
  followForm = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    operation: new FormControl(''),
    produit: new FormControl(''),
    rythme: new FormControl(''),
    ecole: new FormControl(''),
    formation: new FormControl(''),
    campus: new FormControl(''),
    eduhorizon: new FormControl(''),
    note_choix: new FormControl(''),
    criteres_qualification: new FormControl(''),
    decision_qualification: new FormControl(''),
    decision_avancement: new FormControl(''),

    note_qualification: new FormControl(''),
  })
Updatetache=new FormGroup({
  date:new FormControl('',Validators.required),
  description:new FormControl(''),
});

  @Output() suivreLead = new EventEmitter<LeadCRM>();

  initFollow(lead: LeadCRM) {
    this.suivreLead.emit(lead)
  }

  onDropdownChange() {
    this.saveRappels();
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
 /* decisionList = [
    
    { label: 'Non traitée', value: 'Non qualifié' },
    //{ label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'traitée', value: 'Qualifié' },
  ]*/
  decisionList = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]

  avancementList = [
    
    { label: 'Non traiée', value: 'Non traiée' },
    { label: 'en cours', value: 'en cours' },
    { label: 'traitée', value: 'traitée' },
  ]
  statutDossierList = [
    { label: 'Tous les status', value: null },
    { label: 'Non contacté', value: 'Non contacté' },
    { label: 'Intéressé', value: 'Intéressé' },
    { label: 'Non intéressé', value: 'Non intéressé' },
    { label: 'En réflexion', value: 'En réflexion' },
  ]

  //Affect Form
  showAffect: LeadCRM = null
  affectForm = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    affected_date: new FormControl(''),
    affected_to_member: new FormControl(''),
    affected_to_team: new FormControl(''),
  })

  initAffect(lead: LeadCRM) {
    this.affectForm.patchValue({ ...lead })
    this.showAffect = lead
  }

  onUpdateAffect() {
    this.LCS.update({ ...this.affectForm.value }).subscribe(data => {
      this.leads.splice(this.leads.indexOf(this.showAffect), 1, data)
      this.affectForm.reset()
      this.showAffect = null
      this.ToastService.add({ severity: "success", summary: "Affectation du lead avec succès" })
    })
  }

  onUpdateStatutDossier(event
    :
    any, lead
      :
      LeadCRM
  ) {
    //mettre à jour le champs qualification du lead
    lead.statut_dossier = event.value
    this.LCS.update(lead).subscribe(data => {
      this.leads.splice(this.leads.indexOf(lead), 1, data)
      this.ToastService.add({ severity: "success", summary: "Mis à jour du statut du dossier avec succès" })
    })
  }
  onUpdateQualification(event
    :
    any, lead
      :
      LeadCRM
  ) {
    //mettre à jour le champs qualification du lead

    lead.decision_qualification = event.value
    this.LCS.update(lead).subscribe(data => {
      this.leads.splice(this.leads.indexOf(lead), 1, data)
      this.ToastService.add({ severity: "success", summary: "Mis à jour de la qualification avec succès" })
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


  showAddEmailInput = false
  showAddNumberlInput = false
  showAddWhatNumberlInput = false


  onInitAddEmailInput(type: string) {

    if (!type) {
      return
    }
    if (type == "email") {
      this.showAddEmailInput = true
    }
    if (type == "number") {
      this.showAddNumberlInput = true
    }
    if (type == "whatsapp") {
      this.showAddWhatNumberlInput = true
    }
  }

  onAddElseContact(event: any, lead: LeadCRM, type: string) {
    // ajouter une adresse email ou le numero de telephone ou le numéro whatsapp selon le type au lead en plus de celle existante
    if (!type) {
      return
    }
    if (type == "email") {
      lead.email = lead.email + " ;" + event.target.value
    }
    if (type == "number") {
      lead.numero_phone = lead.numero_phone + "; " + event.target.value
    }
    if (type == "whatsapp") {
      lead.numero_whatsapp = lead.numero_whatsapp + " ;" + event.target.value
    }
    this.LCS.update(lead).subscribe(data => {
      this.leads.splice(this.leads.indexOf(lead), 1, data)
      this.ToastService.add({ severity: "success", summary: "Mise à jour avec succès" })
    })
  }

  onHideAddEmailInput(type: string) {
    if (!type) {
      return
    }
    if (type == "email") {
      this.showAddEmailInput = false
    }
    if (type == "number") {
      this.showAddNumberlInput = false
    }
    if (type == "whatsapp") {
      this.showAddWhatNumberlInput = false
    }
  }

}
