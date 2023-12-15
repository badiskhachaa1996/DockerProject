import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoTicket } from 'src/app/models/AutoTicket';
import { Sujet } from 'src/app/models/Sujet';
import { AutoTicketService } from 'src/app/services/auto-ticket.service';
import { RhService } from 'src/app/services/rh.service';
import { SujetService } from 'src/app/services/sujet.service';
import jwt_decode from 'jwt-decode';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-automatisation-ticketing',
  templateUrl: './automatisation-ticketing.component.html',
  styleUrls: ['./automatisation-ticketing.component.scss']
})
export class AutomatisationTicketingComponent implements OnInit {
  autoTickets = []
  sujetDropdown = []
  sujetDic = {}
  serviceDropdown: any[] = [];
  serviceDicTrue = {}
  serviceDic = {}
  userDropdown = []
  constructor(private AutoTicketService: AutoTicketService, private ServService: ServService, private AuthService: AuthService,
    private ToastService: MessageService, private CollaborateurService: RhService, private FiliereService: FormulaireAdmissionService,
    private SujetService: SujetService) { }
  formAdd = new UntypedFormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    module: new FormControl(''),
    campus: new FormControl(''),
    filiere: new FormControl(''),
    type: new FormControl(''),
    demande: new FormControl(''),
    site: new FormControl(''),
    assigned_to: new FormControl(''),
  })
  token: any;

  YpareoDropdown: any[] = [
    { label: 'Accés', value: "Acces" },
    { label: "Ajout d'un étudiant", value: "Ajout" },
    { label: 'Autre', value: "Autre" },
  ];
  MicrosoftDropdown: any[] = [
    { label: 'Réinitialisation du mot de passe', value: "Réinitialisation du mot de passe" },
    { label: 'Création du compte Microsoft 365', value: "Création du compte Microsoft 365" },
    { label: "Problème d'accès à Microsoft 365", value: "Problème d'accès à Microsoft 365" },
    { label: "Problème TEAMS", value: "Problème TEAMS" },
    { label: "Problème Outlook", value: "Problème Outlook" },
    { label: "Problème OneDrive", value: "Problème OneDrive" },
  ];
  SiteinternetDropdown: any[] = [
    { label: 'Contenu', value: "Contenu" },
    { label: "Formulaire d'admission", value: "Formulaire d'admission" },
    { label: 'Beug', value: "Beug" },
    { label: 'Autre', value: "Autre" },
  ];

  moduleDropdown: any[] = [
    { label: 'Espace Personnel', value: "Espace Personnel" },
    { label: 'Module Ressources humaines', value: "Module Ressources humaines" },
    { label: 'Module Pédagogie', value: "Module Pédagogie" },
    { label: 'Module Administration', value: "Module Administration" },
    { label: 'Module Admission', value: "Module Admission" },
    { label: 'Module Commerciale', value: "Module Commerciale" },
    { label: 'Module Partenaires', value: "Module Partenaires" },
    { label: 'Module iMatch', value: "Module iMatch" },
    { label: 'Module Booking', value: "Module Booking" },
    { label: 'Module Questionnaire', value: "Module Questionnaire" },
    { label: 'Module International', value: "Module International" },
    { label: 'Module CRM', value: "Module CRM" },
    { label: 'Module Intuns', value: "Module Intuns" },
    { label: 'Module Gestions des emails', value: "Module Gestions des emails" },
    { label: 'Module Admin IMS', value: "Module Admin IMS" },
    { label: 'Module Générateur Docs', value: "Module Générateur Docs" },
    { label: 'Module Ticketing', value: "Module Ticketing" },
    { label: 'Module CRA', value: "Module CRA" },
    { label: 'Accès/Connexion', value: "Accès/Connexion" },
    { label: 'Autre', value: "Autre" },
  ];
  IMS_Type_Dropdown: any[] = [
    { label: 'Création', value: "Création" },
    { label: 'Evolution', value: "Evolution" },
    { label: 'Correction', value: "Correction" },
  ]
  campusDropdown: any[] = [
    { value: 'Paris', label: "Paris" },
    { value: "Marne", label: "Marne" },
    { value: 'Montpelier', label: "Montpelier" },
  ];

  siteDropdown: any[] = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];
  filiereDropdown: any[] = [];
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.AutoTicketService.getAll().subscribe(r => {
      this.autoTickets = r
    })

    this.SujetService.getAll().subscribe(r => {
      r.forEach((element: Sujet) => {
        this.sujetDropdown.push({ label: element.label, value: element._id })
        this.sujetDic[element._id] = element.label
      });
    })

    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.serviceDropdown.push({ label: val.label, value: val._id })
        this.serviceDicTrue[val._id] = val
        this.serviceDic[val._id] = val.label
      })
    })

    this.CollaborateurService.getCollaborateurs().then(r => {
      r.forEach(c => {
        if (c.user_id)
          this.userDropdown.push({ label: `${c.user_id.firstname} ${c.user_id.lastname}`, value: c.user_id._id })
      })
    })

    this.FiliereService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filiereDropdown.push({ value: d._id, label: d.nom })
      })
    })
  }
  serviceSelected: Service
  onSelectService() {

    let service_id = this.formAdd.value.service_id

    this.serviceSelected = this.serviceDicTrue[service_id]
    this.SujetService.getAllByServiceID(service_id).subscribe(data => {
      this.sujetDropdown = []
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
    })
    this.AuthService.getAllByServiceFromList(service_id).subscribe(data => {
      this.userDropdown = []
      data.forEach(u => {
        this.userDropdown.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }
  displayDropdown = {
    module: false,
    campus: false,
    filiere: false,
    type: false,
    demande: false,
    site: false,
    extra_1: false,
    extra_2: false,
  }

  demandeDropdown = []
  onSubjectChange() {
    const selectedSubject = this.sujetDic[this.formAdd.get('sujet_id').value];
    const service = this.serviceDic[this.formAdd.get('service_id').value]

    this.displayDropdown = {
      module: false,
      campus: false,
      filiere: false,
      type: false,
      demande: false,
      site: false,
      extra_1: false,
      extra_2: false,
    }
    this.displayDropdown.campus = (service == 'Pédagogie' || service === "Administration")
    this.displayDropdown.site = (service === 'Ressources Humaines')
    this.displayDropdown.filiere = (service === "Pédagogie")

    if (selectedSubject === "IMS") {
      this.displayDropdown.type = true
      this.displayDropdown.module = true
    } else if (selectedSubject === "Ypareo") {
      this.displayDropdown.demande = true
      this.demandeDropdown = this.YpareoDropdown;
    } else if (selectedSubject === "Microsoft") {
      this.displayDropdown.demande = true
      this.demandeDropdown = this.MicrosoftDropdown
    } else if (selectedSubject === "Site internet") {
      this.displayDropdown.demande = true
      this.demandeDropdown = this.SiteinternetDropdown;
    }

    if (this.displayDropdown.module) {
      this.formAdd.get('module').setValidators([Validators.required]);
      this.formAdd.get('module').updateValueAndValidity();
    } else {
      this.formAdd.get('module').clearValidators();
      this.formAdd.get('module').updateValueAndValidity();
      this.formAdd.get('module').reset();
    }
  };

  showAdd = false
  onSave() {
    this.AutoTicketService.create({ ...this.formAdd.value, custom_id: Math.random().toString(36).substring(5).toUpperCase(), created_by: this.token.id, created_date: new Date() }).subscribe(r => {
      this.autoTickets.push(r)
      this.showAdd = false
      this.ToastService.add({ severity: 'success', summary: 'Création avec succès' })
    })
  }

  autoToUpdate: AutoTicket
  onUpdate(auto: AutoTicket) {
    this.autoToUpdate = auto
    this.showAdd = true
    this.formAdd.patchValue({ ...auto, sujet_id: auto.sujet_id._id, service_id: auto.sujet_id.service_id, assigned_to: auto.assigned_to._id })
    this.onSelectService()
    this.onSubjectChange()
  }

  updateSubmit() {
    this.AutoTicketService.update({ _id: this.autoToUpdate._id, ...this.formAdd.value }).subscribe(r => {
      this.autoTickets.splice(this.autoTickets.indexOf(this.autoToUpdate), 1, r)
      this.autoToUpdate = null
      this.showAdd = false
      this.ToastService.add({ severity: 'success', summary: 'Modification avec succès' })
    })
  }

  delete(auto: AutoTicket, idx: number) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cette automatisation #${auto.custom_id} ?`))
      this.AutoTicketService.delete(auto._id).subscribe(r => {
        this.autoTickets.splice(this.autoTickets.indexOf(auto), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression avec succès' })
      })
  }

}
