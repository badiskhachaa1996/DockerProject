import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import mongoose from 'mongoose';
import { FileUpload } from 'primeng/fileupload';
import { SocketService } from 'src/app/services/socket.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/project/Task';
import { ProjectService } from 'src/app/services/projectv2.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Service } from 'src/app/models/Service';
import { RhService } from 'src/app/services/rh.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-ajout-ticket',
  templateUrl: './ajout-ticket.component.html',
  styleUrls: ['./ajout-ticket.component.scss']
})
export class AjoutTicketComponent implements OnInit {
  @Output() ADD = new EventEmitter()
  receivedTask: Task;
  itsTask: boolean = false;
  taskID: string;
  demandeDropdown: any;
  showDemandeDropdown: boolean = false;
  showCampusDropdown: boolean = false;
  showFiliereDropdown: boolean = false;
  filiereDropdown: any[] = [];
  campusDropdown: any[] = [
    { value: 'Paris', label: "Paris" },
    { value: "Marne", label: "Marne" },
    { value: 'Montpelier', label: "Montpelier" },
  ];
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
  serviceSelected: Service
  service_ID = this.route.snapshot.paramMap.get('service_id');
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('',),
    resum: new FormControl('', Validators.required),
    priorite: new FormControl("false"),
    module: new FormControl(null,),
    type: new FormControl(null,),
    demande: new FormControl(null,),
    campus: new FormControl(null,),
    filiere: new FormControl(null,),
    site: new FormControl(null)
  })
  token;
  sujetDropdown: any[] = [
  ];
  serviceDropdown: any[] = [
  ];
  // Haute priorité / Moyenne priorité / Basse priorité / Priorité normale
  prioriteDropdown: any[] = [
    { label: 'Urgent', value: "Urgent" },
    { label: 'Très urgent', value: "Très urgent" },
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
  showModuleDropdown: boolean = false;
  showTypeDropdown: boolean = false;
  onAdd() {
    let documents = []
    this.uploadedFiles.forEach(element => {
      documents.push({ path: element.name, name: element.name, _id: new mongoose.Types.ObjectId().toString() })
    });
    let serviceSelected: Service = this.serviceDicTrue[this.TicketForm.value.service_id]
    if (serviceSelected.label != 'Ressources Humaines')
      this.TicketForm.patchValue({ site: null })
    this.TicketService.create({ ...this.TicketForm.value, documents, id: this.token.id, priorite: this.TicketForm.value?.priorite?.includes("true") }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: 'Création du ticket avec succès' })

      let d = new Date()
      this.Socket.NewNotifV2('Ticketing - Super-Admin', `Un nouveau ticket a été crée pour le service ${this.serviceDic[this.TicketForm.value.service_id]}, dont le ${this.sujetDic[this.TicketForm.value.sujet_id]} le ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} par ${this.USER.lastname} ${this.USER.firstname}`)
      this.NotificationService.createV2(new Notification(null, null, false, `Un nouveau ticket a été crée pour le service ${this.serviceDic[this.TicketForm.value.service_id]}, dont le ${this.sujetDic[this.TicketForm.value.sujet_id]} le ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} par ${this.USER.lastname} ${this.USER.firstname}`, new Date(), null, this.TicketForm.value.service_id), 'Ticketing', "Super-Admin").subscribe(test => { console.log(test) })
      this.TicketForm.reset()
      this.uploadedFiles.forEach((element, idx) => {
        let formData = new FormData()
        formData.append('ticket_id', data.doc._id)
        formData.append('document_id', documents[idx]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
      this.ADD.emit(data)
      if (this.itsTask) {

        this.projectService.getTask(this.taskID).then((datat) => {
          datat.ticketId = data.doc._id;
          this.projectService.putTask(datat);

        })
        this.router.navigate(['/gestion-project'])
      }
    })
  }
  onSelectService() {
    this.sujetDropdown = []
    this.serviceSelected = this.serviceDicTrue[this.TicketForm.value.service_id]
    this.SujetService.getAllByServiceID(this.TicketForm.value.service_id).subscribe(data => {
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
    })
  }
  uploadedFiles: File[] = []
  onUpload(event: { files: File[] }, fileUpload: FileUpload) {
    this.uploadedFiles.push(event.files[0])
    fileUpload.clear()
  }
  constructor(private TicketService: TicketService, private ToastService: MessageService, private ServService: ServService,
    private router: Router, private route: ActivatedRoute, private diplomeService: DiplomeService,
    private SujetService: SujetService, private Socket: SocketService, private CollaborateurService: RhService,
    private AuthService: AuthService, private NotificationService: NotificationService, private projectService: ProjectService, private FiliereService: FormulaireAdmissionService) { }
  serviceDic = {}
  serviceDicTrue = {}
  sujetDic = {}
  USER: User

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(data => {
      this.USER = data
    })
    this.CollaborateurService.getCollaborateurByUserId(this.token.id).then(r => {
      if (r) {
        let site = null
        if (Array.isArray(r.localisation) && r.localisation.length != 0)
          site = r.localisation[0]
        else if (!Array.isArray(r.localisation)) {
          let buffer: any = r.localisation
          site = buffer
        }
        this.TicketForm.patchValue({ site })
      }
    })
    this.SujetService.getAll().subscribe(data => {
      data.forEach(element => {
        this.sujetDic[element._id] = element.label
      });
    })
    if (this.router.url.startsWith('/ticketing-igs')) {
      //Charger les sujets et services IGS
      this.ServService.getAll().subscribe(data => {
        data.forEach(val => {
          if (val.label.startsWith('IGS')) {
            this.serviceDropdown.push({ label: val.label, value: val._id })
            this.serviceDic[val._id] = val.label
            this.serviceDicTrue[val._id] = val
          }
        })
      })
    } else if (this.service_ID) {
      this.ServService.getAServiceByid(this.service_ID).subscribe(data => {
        this.serviceDropdown.push({ label: data.dataService.label, value: data.dataService._id })
        this.TicketForm.patchValue({ service_id: this.service_ID })
        this.sujetDropdown = []
        this.SujetService.getAllByServiceID(this.service_ID).subscribe(data => {
          data.forEach(val => {
            this.sujetDropdown.push({ label: val.label, value: val._id })
          })
        })
      })
    } else {
      this.ServService.getAll().subscribe(data => {
        data.forEach(val => {
          this.serviceDropdown.push({ label: val.label, value: val._id })
          this.serviceDic[val._id] = val.label
          this.serviceDicTrue[val._id] = val
        })
      })
    }
    this.route.queryParams.subscribe(params => {
      if (params && params.data) {
        this.receivedTask = JSON.parse(params.data);
        this.itsTask = true;
        this.taskID = this.receivedTask._id;
        this.TicketForm.patchValue({
          description: this.receivedTask.libelle + ' :' + this.receivedTask.description_task,
          priorite: this.receivedTask.priorite,

        })

      }
    });
    this.FiliereService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filiereDropdown.push({ value: d._id, label: d.nom })
      })
    })

  }
  showSite = false
  onSubjectChange() {
    const selectedSubject = this.sujetDic[this.TicketForm.get('sujet_id').value];
    const service = this.serviceDic[this.TicketForm.get('service_id').value]

    this.showTypeDropdown = false;
    this.showCampusDropdown = false;
    this.showModuleDropdown = false;
    this.showFiliereDropdown = false;
    this.showDemandeDropdown = false;
    this.showSite = false

    if (service === "Pédagogie") {
      this.showCampusDropdown = true;
      this.showFiliereDropdown = true;
    } else if (service === "Administration") {
      this.showCampusDropdown = true;
    } else if (service === 'Ressources Humaines')
      this.showSite = true
    if (selectedSubject === "IMS") {
      this.showTypeDropdown = true;
      this.showModuleDropdown = true;
      this.showTypeDropdown = true;
    } else if (selectedSubject === "Ypareo") {
      this.showDemandeDropdown = true;
      this.demandeDropdown = this.YpareoDropdown;
    } else if (selectedSubject === "Microsoft") {
      this.showDemandeDropdown = true;
      this.demandeDropdown = this.MicrosoftDropdown
    } else if (selectedSubject === "Site internet") {
      this.showDemandeDropdown = true;
      this.demandeDropdown = this.SiteinternetDropdown;
    }

    if (this.showModuleDropdown) {
      this.TicketForm.get('module').setValidators([Validators.required]);
      this.TicketForm.get('module').updateValueAndValidity();
    } else {
      this.TicketForm.get('module').clearValidators();
      this.TicketForm.get('module').updateValueAndValidity();
      this.TicketForm.get('module').reset();
    }
  };

}
