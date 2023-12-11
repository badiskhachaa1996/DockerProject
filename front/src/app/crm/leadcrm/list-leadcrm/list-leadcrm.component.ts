

import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core'

import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { saveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from "../../../dev-components/service-template/productservice";
import { GestionProduitsService } from "../../gestion-produits/gestion-produits.service";
import { ProduitCRM } from "../../../models/produitCRM";
import { ActivatedRoute, Router } from "@angular/router";
import { Prospect } from "../../../models/Prospect";
import { EmailTypeService } from "../../../services/email-type.service";
import { MailType } from "../../../models/MailType";
import { HistoriqueEmail } from "../../../models/HistoriqueEmail";
import { HistoriqueLead } from "../../../models/HistoriqueLead";
import { FileUpload } from 'primeng/fileupload';
import { AdmissionService } from "../../../services/admission.service";
import { SourceCRM } from "../../../models/sourceCRM";
import { GestionSourcesServices } from "../../gestion-srources/gestion-sources.services";
import { OperationCRM } from "../../../models/operationCRM";
import { GestionOperationService } from "../../gestion-operation/gestion-operation.service";
import { ServService } from 'src/app/services/service.service';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { Ticket } from 'src/app/models/Ticket';
import { Observable, Subscription } from 'rxjs';
import { RhService } from 'src/app/services/rh.service';
import {BadgeModule} from 'primeng/badge';


@Component({
  selector: 'app-list-leadcrm',
  templateUrl: './list-leadcrm.component.html',
  styleUrls: ['./list-leadcrm.component.scss']
})
export class ListLeadcrmComponent implements OnInit {
  token;
  equipe: string;
  filterPays = [
    { label: 'Tous les pays', value: null }
  ]
  AccessLevel = "Spectateur"
  filterSource = [{ label: 'Toutes les sources', value: null }]

  filterOperation = []
  filterEquipe=[
    { label: 'Toutes les équipe', value: null }
  ]
  filteredLeadsCount:number

  filterAffecte = [
    { label: 'Tous les membres', value: null }
  ]

  filterQualification = [
    { label: 'Tous les qualifications', value: null },
    { label: 'En attente de traitement', value: 'En attente de traitement' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
  ]

  filterAuteur = [
    { label: 'Tous les auteurs', value: null }
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


  //Qualification
  produitList = [];
  private selectedLead: LeadCRM;

  constructor(private LCS: LeadcrmService, private ToastService: MessageService, private FAService: FormulaireAdmissionService,
    private TeamCRMService: TeamsCrmService, private UserService: AuthService, private Products: GestionProduitsService, private EmailTypeS: EmailTypeService,
    private router: Router, private ServiceServ: ServService, private TicketService: TicketService, private SujetService: SujetService,
    private admissionService: AdmissionService, private OperationService: GestionOperationService,private sourceService:GestionSourcesServices,private rhService:RhService) { }
  leads: LeadCRM[] = []
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.rhService.getAgents().then(data => {
      data.forEach(user => {
        if(user.type ==="Collaborateur" ){
this.memberList.push({ label: `${user.firstname} ${user.lastname} | ${user.type}`, value: user._id })
} })
    })
  
    this.LCS.getAll().subscribe(data => {
      this.leads = data
      console.log(this.leads);
      this.filteredLeadsCount = this.leads.length;
      let ids = []
      data.forEach(l => {
        if (l.created_by && !ids.includes(l.created_by._id)) {
          this.filterAuteur.push({ label: `${l.created_by.firstname} ${l.created_by.lastname}`, value: l.created_by._id })
          ids.push(l.created_by._id)
        }
      })
    })
    
    this.eventsSubscription = this.newLead.subscribe((lead) => {
      this.leads.push(lead)
    });
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
    this.filterPays = this.filterPays.concat(environment.pays)
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe(data => {
      if (data.roles_list)
        data.roles_list.forEach(role => {
          if (role.module == "CRM")
            this.AccessLevel = role.role
        })
      this.OperationService.GetAllOperation().subscribe(data => {
        console.log(data)
      })
      this.LCS.getAll().subscribe(data => {
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
      this.TeamCRMService.MIgetAll().subscribe(data=>{
        data.forEach(membre=>{
          this.filterAffecte.push({ label: `${membre.user_id.firstname} ${membre.user_id.lastname} | ${membre.user_id?.type}`, value: membre.user_id._id })
        })
      })
      
      this.ServiceServ.getAServiceByLabel('Commercial').subscribe(dataS => {
        if (dataS)
          this.UserService.getAllByService(dataS.dataService._id).subscribe(data => {
            this.memberList = []
            this.filterAffecte = [{ label: 'Tous les commerciaux', value: null }]
            data.forEach(val => {
              this.memberList.push({ label: `${val.firstname} ${val.lastname.toUpperCase()}`, value: val._id })
              this.filterAffecte.push({ label: `${val.firstname} ${val.lastname.toUpperCase()}`, value: val._id })
            })
          })

        else
          console.error('Pas de service Commercial')
      })

      this.filterPays = this.filterPays.concat(environment.pays)
      this.token = jwt_decode(localStorage.getItem('token'));
      this.UserService.getPopulate(this.token.id).subscribe(data => {
        if (data.roles_list)
          data.roles_list.forEach(role => {
            if (role.module == "CRM")
              this.AccessLevel = role.role
          })
        if (data.role == "Admin")
          this.AccessLevel = "Super-Admin"
      })

      this.Products.GetAllProduit().subscribe(data => {
        data.forEach(val => {
          this.produitList.push({ label: val.nom, value: val._id })
        })
      })
    })
    this.sourceService.GetAllSource().subscribe(data => {
    data.forEach(val=>{
      this.filterSource.push({label:val.nom,value:val.nom});
      this.canalList.push({label:val.nom,value:val._id});
    })
    });
    this.TeamCRMService.TIgetAll().subscribe(data => {
      data.forEach(val=>{
this.filterEquipe.push({label:val.nom,value:val.nom});
      })
    })
    
  }

  //Follow Form
  showFollow: LeadCRM = null

  followForm = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    operation: new FormControl(''),
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
  private eventsSubscription: Subscription;
  @Input() newLead: Observable<LeadCRM>;
  @Output() suivreLead = new EventEmitter<LeadCRM>();
  @Output() myLead = new EventEmitter<LeadCRM>();
  initFollow(lead:LeadCRM
  ) {
    console.log(lead);
    this.suivreLead.emit(lead)
  }

  onUpdateFollow() {
    this.LCS.update({
      ...this.followForm.value,
      contacts: this.showFollow.contacts,
      ventes: this.showFollow.ventes,
      mailing: this.showFollow.mailing,
      documents: this.showFollow.documents
    }).subscribe(data => {
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
  memberList = []
  canalList = [
    
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
  downloadFile(index: number): void {
    this.indexDocuments = index;
    const document = this.showFollow.documents[index];

    if (!document) {
      this.ToastService.add({ severity: 'error', summary: 'Erreur', detail: 'Document non trouvé' });
      return;
    }

    this.LCS.downloadFile(this.showFollow._id, document._id, document.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), document.path);
    }, (error) => {
      console.error(error);
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenue' });
    });
  }


  uploadFile(index) {
    this.indexDocuments = index
    document.getElementById('selectedFile').click();
  }
  deleteFile(index: number): void {
    if (index >= 0 && index < this.showFollow.documents.length
    ) {
      this.showFollow.documents.splice(index, 1);
      
    }
    else {
      this.ToastService.add({ severity: 'error', summary: 'Erreur', detail: 'Index de document invalide' });
    }
  }

  onFilter(event: any): void {
    this.filteredLeadsCount = event.filteredValue ? event.filteredValue.length : 0;
}
  FileUpload(event: { target: { files: File[] } }): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.ToastService.add({
        severity: 'info',
        summary: 'Envoi de Fichier',
        detail: 'Envoi en cours, veuillez patienter ...'
      });
      const formData = new FormData();
      formData.append('document_id', this.showFollow.documents[this.indexDocuments]._id);
      formData.append('lead_id', this.showFollow._id);
      formData.append('file', selectedFile);

      this.LCS.uploadFile(formData).subscribe(res => {
        this.ToastService.add({
          severity: 'success',
          summary: 'Envoi de Fichier',
          detail: 'Le fichier a bien été envoyé'
        });
        this.showFollow.documents[this.indexDocuments].path = selectedFile.name;
      }, error => {
        console.error(error);
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est survenue' });
      });
    } else {
      this.ToastService.add({ severity: 'warn', summary: 'Envoi de Fichier', detail: 'Aucun fichier sélectionné' });
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

  ecoleList = []

  formationList = []

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


  critereList = [
    { label: 'Langue', value: 'Langue' },
    { label: 'Volet Financier', value: 'Volet Financier' },
    { label: 'Age', value: 'Age' },
    { label: 'Motivation', value: 'Motivation' },
    { label: 'Dossier admission cohérant ', value: 'Dossier admission cohérant ' },
  ]
  //En attente de traitement ;Non qualifié, Pré-qualifié, Qualifié
  decisionList = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Non qualifié', value: 'Non qualifié' },
    { label: 'Pré-qualifié', value: 'Pré-qualifié' },
    { label: 'Qualifié', value: 'Qualifié' },
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

  initAffect(lead
    :
    LeadCRM
  ) {
    this.affectForm.patchValue({ ...lead,produit:lead.produit[0] })
    this.showAffect = lead
  }

  generateID() {
    return "IGTP" + Math.floor(Math.random() * (9 - 0 + 1)) + Math.floor(Math.random() * (9 - 0 + 1)) + Math.floor(Math.random() * (9 - 0 + 1)) + Math.floor(Math.random() * (9 - 0 + 1)) + Math.floor(Math.random() * (9 - 0 + 1));
  }

  onAutoAffect(lead: LeadCRM) {
    this.TeamCRMService.MIgetByUSERID(this.token.id).subscribe(data => {
      this.equipe=data.team_id?.nom
    })
    setTimeout(() =>{
    this.LCS.update({ _id: lead._id, affected_to_member: this.token.id, affected_date: new Date(),equipe:this.equipe }).subscribe(data => {
      this.leads.splice(this.leads.indexOf(lead), 1, data)
      this.myLead.emit(data);
      this.UserService.getByEmailIMS('ims.app@intedgroup.com').subscribe(u => {
        this.SujetService.getByLabel('Prospection').subscribe(sujet => {
          let newTicket = new Ticket(
            null,
            u._id,
            sujet._id,
            new Date(),
            this.token.id,
            "En cours de traitement",
            new Date(),
          )
          newTicket.customid = this.generateID()
          newTicket.resum = "Contactez le lead"
          newTicket.description = `
          Nom: ${lead?.nom}\n
          Prénom: ${lead?.prenom}\n
          Email: ${lead?.email}\n
          Téléphone: ${lead?.indicatif_phone} ${lead?.numero_phone}\n
          Source: ${lead?.source}
          `
          this.TicketService.create(newTicket).subscribe(r => {
            this.ToastService.add({ severity: "success", summary: "Création du Ticket d'affectation avec succès" })
          }, error => {
            console.error(error)
          })
        })

      })
      this.ToastService.add({ severity: "success", summary: "Affectation du lead avec succès" })
    })},10);

  }
  findTeams(value){
    console.log(value)
    this.TeamCRMService.MIgetByUSERID(value).subscribe(r=>{
      this.equipe=r.team_id.nom
      console.log(this.equipe);
    })
  }
  onUpdateAffect() {
    
    this.LCS.update({ ...this.affectForm.value, affected_date: new Date() ,equipe:this.equipe}).subscribe(data => {
      this.leads.splice(this.leads.indexOf(this.showAffect), 1, data)
      this.affectForm.reset()
      this.SujetService.getByLabel('Prospection').subscribe(sujet => {
        let newTicket = new Ticket(
          null,
          this.token.id,
          sujet._id,
          new Date(),
          this.affectForm.value.affected_to_member,
          "En cours de traitement",
          new Date(),
        )
        newTicket.customid = this.generateID()
        newTicket.resum = "Contactez le lead"
        newTicket.description = `
        Nom: ${this.showAffect?.nom}\n
        Prénom: ${this.showAffect?.prenom}\n
        Email: ${this.showAffect?.email}\n
        Téléphone: ${this.showAffect?.indicatif_phone} ${this.showAffect?.numero_phone}\n
        Source: ${this.showAffect?.source}
        `
        this.TicketService.create(newTicket).subscribe(r => {
          this.ToastService.add({ severity: "success", summary: "Création du Ticket d'affectation avec succès" })
        }, error => {
          console.error(error)
        })
      })

      this.showAffect = null
      this.ToastService.add({ severity: "success", summary: "Affectation du lead avec succès" })
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



  // Nazif ajout des buttons de mise à jour et de suppression
  initUpdate(lead: LeadCRM) {
    this.selectedLead = lead
    this.followForm.patchValue({ ...lead,produit:lead.produit[0] })
  }
  delete(lead: LeadCRM) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"))
      this.LCS.delete(lead._id).subscribe(data => {
        this.leads.splice(this.leads.indexOf(lead), 1)
        this.ToastService.add({ severity: "success", summary: `Suppression du lead avec succès` })
      })
  }


  updateLead(id: string) {
    this.router.navigate(['/crm/leads/update', id]);
  }


  // Gestion des emails envoyé un email, afficher les emails envoyés et les emails types

  showEmail = false
  leadSendTo: LeadCRM = null
  emailTypeSelected: string = null
  mailDropdown = []
  mailTypeDropdown = []
  @ViewChild('fileInput')
  fileInput
    :
    FileUpload;

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
    this.EmailTypeS.sendPerso({
      ...this.formEmailPerso.value,
      send_by: this.token.id,
      send_to: this.leadSendTo.email,
      send_from: this.formEmailPerso.value.send_from._id,
      pieces_jointes: this.piece_jointes,
      mailTypeSelected: this.mailTypeSelected
    }).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({
        ...this.formEmailPerso.value,
        send_by: this.token.id,
        send_to: this.leadSendTo._id,
        send_from: this.formEmailPerso.value.send_from.email
      }).subscribe(data2 => {
        this.formEmailPerso.reset()
        this.historiqueEmails.push(data2)
        this.ToastService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  onEmailType() {
    this.EmailTypeS.sendPerso({
      ...this.formEmailType.value,
      send_by: this.token.id,
      send_to: this.leadSendTo.email,
      send_from: this.formEmailType.value.send_from._id,
      pieces_jointes: this.piece_jointes,
      mailTypeSelected: this.mailTypeSelected
    }).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({
        ...this.formEmailType.value,
        send_by: this.token.id,
        send_to: this.leadSendTo._id,
        send_from: this.formEmailType.value.send_from.email
      }).subscribe(data2 => {
        this.formEmailType.reset()
        this.historiqueEmails.push(data2)
        this.ToastService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  initSendEmail(lead
    :
    LeadCRM
  ) {
    this.showEmail = true
    this.leadSendTo = lead

    this.EmailTypeS.HEgetAllTo(this.leadSendTo._id).subscribe(data => {
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

  onMailType(event
    :
    MailType
  ) {
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
    nom
    :
    string,
    path
    :
    string,
    _id
    :
    string
  }
    = null

  onAddPj() {
    this.piece_jointes.push({
      date: new Date(),
      nom: "Téléverser le fichier s'il vous plaît",
      path: '',
      _id: new mongoose.Types.ObjectId().toString()
    })
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
      this.ToastService.add({
        severity: 'error',
        summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload'
      });
    }

  }


  FileUploadPJ(event
    :
    [File]
  ) {
    if (event != null) {
      this.ToastService.add({
        severity: 'info',
        summary: 'Envoi de Fichier',
        detail: 'Envoi en cours, veuillez patienter ...'
      });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.mailTypeSelected?._id)
      formData.append('file', event[0])
      this.EmailTypeS.uploadPJ(formData).subscribe(res => {
        this.ToastService.add({
          severity: 'success',
          summary: 'Envoi de Fichier',
          detail: 'Le fichier a bien été envoyé'
        });
        this.piece_jointes[this.piece_jointes.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  listHistorique: HistoriqueLead[] = []
  leadHistorique: Prospect
  initHistorique(lead
    :
    Prospect
  ) {
    this.leadHistorique = lead
    this.admissionService.getAllHistoriqueFromLeadID(lead._id).subscribe(data => {
      this.listHistorique = data
    })
  }

  onHideEmailForm() {
    this.showEmail = false
    this.leadSendTo = null
    this.mailDropdown = []
    this.mailTypeDropdown = []
    this.historiqueEmails = []
    this.piece_jointes = []
    this.formEmailPerso.reset()
    this.formEmailType.reset()
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


  showAddEmailInput = false
  showAddNumberlInput = false
  showAddWhatNumberlInput = false


  onInitAddEmailInput(type
    :
    string
  ) {

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

  onAddElseContact(event
    :
    any, lead
      :
      LeadCRM, type
      :
      string
  ) {
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

  onHideAddEmailInput(type
    :
    string
  ) {
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
