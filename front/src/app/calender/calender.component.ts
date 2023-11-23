import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import frLocale from '@fullcalendar/core/locales/fr';
import { saveAs as importedSaveAs } from "file-saver";
import { EtudiantService } from 'src/app/services/etudiant.service';
import { FullCalendar } from 'primeng/fullcalendar';
import { Seance } from 'src/app/models/Seance';
import { Matiere } from 'src/app/models/Matiere';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { environment } from 'src/environments/environment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridMonth from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/models/Note';
import { NoteService } from 'src/app/services/note.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { Formateur } from 'src/app/models/Formateur';
import { PaymentService } from 'src/app/services/payment.service';
import { Dashboard } from 'src/app/models/Dashboard';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { info } from 'console';
import { ProjectService } from 'src/app/services/project.service';
import { Task } from 'src/app/models/project/Task';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { EtudiantIntuns } from 'src/app/models/intuns/EtudiantIntuns';
import { EtudiantsIntunsService } from 'src/app/services/intuns/etudiants-intuns.service';
import { DailyCheck } from 'src/app/models/DailyCheck';
import { DailyCheckService } from 'src/app/services/daily-check.service';
import * as moment from 'moment';
import { TabView } from 'primeng/tabview';
import { RhService } from 'src/app/services/rh.service';
import { CongeService } from 'src/app/services/conge.service';
import { Conge } from 'src/app/models/Conge';
import { saveAs } from 'file-saver';
import { ActualiteInt } from 'src/app/models/ActualiteInt';
import { ActualiteRH } from 'src/app/models/ActualiteRH';
import { ActualiteRHService } from 'src/app/services/actualite-rh.service';
import { TicketService } from 'src/app/services/ticket.service';
import { ServService } from 'src/app/services/service.service';
import { Ticket } from 'src/app/models/Ticket';
import { EventCalendarRH } from 'src/app/models/EventCalendarRH';
import { CalendrierRhService } from 'src/app/services/calendrier-rh.service';
import { ro } from 'date-fns/locale';
import { PointageData } from 'src/app/models/PointageData';
import { PointageService } from 'src/app/services/pointage.service';
import { PointeuseData } from 'src/app/models/PointeuseData';
import { PointeuseService } from 'src/app/services/pointeuse.service';
import { Collaborateur } from '../models/Collaborateur';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  paysList = environment.pays;
  user: User;
  classe: Classe[] = [];
  paimentS1 = false
  paimentAn = false
  items: MenuItem[];
  itemsCra: MenuItem[] = [];
  seances: Seance[] = [];
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  formateurs: Formateur[] = [];
  searchCampus = [
    { label: 'IEG', value: 'IEG' },
    { label: 'Marne', value: 'Marne' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'UK', value: 'UK' },
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Intuns', value: 'Intuns' }
  ]
  @ViewChild('calendar') private calendar: FullCalendar;

  token: any;
  isAdmin = false
  isAgent = false
  isAdmission = false
  isPedagogie = false
  isEtudiant = false
  isFormateur = false
  isCommercial = false
  isCEO = false
  isReinscrit = false
  isUnknow = false;
  isVisitor = false;
  isIntuns = false
  isProspect = false

  dashboard: Dashboard = null
  dataEtudiant: Etudiant = null
  dataFormateur: Formateur = null
  dataIntuns: EtudiantIntuns;
  visible: boolean = false;
  visibleA: boolean = false;
  visibleC: boolean = false;

  dropdownNote: any[] = [{ libelle: '', value: '' }];
  notes = []

  date: Date = new Date();

  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    minTime: '08:00:00',
    firstDay: 1
  }

  //Options du calendrier etudiant
  optionsetu = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      left: "title",
      right: 'prev,next'
      // left: 'prev,next'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    eventClick: this.eventClickFC.bind(this),
    events: [],
    defaultView: "timeGridDay",
    minTime: '08:00:00',
    firstDay: 1
  }

  dernotes: Note[] = [];
  classbutonchekin: String = "p-button-warning mb-2"
  //Options du calendrier formateur
  optionsforma = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      left: "title",
      right: 'prev,next'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    eventClick: this.eventClickFC.bind(this),
    events: [],
    defaultView: "timeGridDay",
    minTime: '08:00:00',
    firstDay: 1
  }

  seanceNow: Seance[] = [];
  CommercialExterne: CommercialPartenaire;
  PartenaireInfo: Partenaire
  events: any[];

  addLinkForm: FormGroup = new FormGroup({
    libelle: new FormControl('', [Validators.required]),
    link: new FormControl('', Validators.required),
  });

  eventClickFC(col) {
    this.router.navigate(['/emergement/' + col.event.id])
  }

  ID = this.route.snapshot.paramMap.get('id');
  type = this.route.snapshot.paramMap.get('type');


  galleriaResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '960px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  carousselImages: any = [
    {
      "previewImageSrc": "assets/logement/original/accueil4.jpg",
      "thumbnailImageSrc": "assets/logement/original/accueil4.jpg",
      "alt": "Restaurant",
      "title": "Accueil 1"
    },
    {
      "previewImageSrc": "assets/logement/original/accueil2.jpg",
      "thumbnailImageSrc": "assets/logement/original/accueil2.jpg",
      "alt": "Description for Image 2",
      "title": "Accueil 2"
    },
    {
      "previewImageSrc": "assets/logement/original/ch-1.png",
      "thumbnailImageSrc": "assets/logement/original/ch-1.png",
      "alt": "Description for Image 2",
      "title": "Chambre 1"
    },
    {
      "previewImageSrc": "assets/logement/original/gym4.jpg",
      "thumbnailImageSrc": "assets/logement/original/gym4.jpg",
      "alt": "Description for Image 2",
      "title": "Chillroom 2"
    },
    {
      "previewImageSrc": "assets/logement/original/ch-2.png",
      "thumbnailImageSrc": "assets/logement/original/ch-2.png",
      "alt": "Description for Image 2",
      "title": "Chambre 2"
    },
    {
      "previewImageSrc": "assets/logement/original/cinebox.jpg",
      "thumbnailImageSrc": "assets/logement/original/cinebox.jpg",
      "alt": "Description for Image 2",
      "title": "Chillroom 2"
    },
    {
      "previewImageSrc": "assets/logement/original/ch-3.png",
      "thumbnailImageSrc": "assets/logement/original/ch-3.png",
      "alt": "Description for Image 2",
      "title": "Chambre 3"
    },
    {
      "previewImageSrc": "assets/logement/original/chillroom2.jpg",
      "thumbnailImageSrc": "assets/logement/original/chillroom2.jpg",
      "alt": "Description for Image 2",
      "title": "Chillroom 2"
    },
  ];

  //* Check in variables
  userConnected: User;
  dailyCheck: DailyCheck;
  today: Date = new Date();
  workingTiming: number; // temps passé au travail en minute
  workingHour: number = 0; // temps passé au travail
  workingMinute: number = 0; // temps passé au travail
  pauseTiming: number; // temps passé en pause en minute
  selectedTabIndex: number = 0; // Index actuel du tableau d'affichage des données RH
  showFormUpdateStatut: boolean; // permet d'afficher la boîte de dialogue pour modifier le statut
  formUpdateStatut: FormGroup;
  statutList: any[] = [
    { label: 'En congé', value: 'En congé' },
    { label: 'Disponible', value: 'Disponible' },
    { label: 'En réunion', value: 'En réunion' },
    { label: 'Ecole', value: 'Ecole' },
    { label: 'Occupé', value: 'Occupé' },
    { label: 'Absent', value: 'Absent' },
    { label: 'En pause', value: 'En pause' },
  ];
  formAddCra: FormGroup;
  formAddCraTicket: FormGroup;
  showFormAddCra: boolean = false;
  showFormAddCraTicket: boolean = false;
  ticketListe: any[] = [];
  clonedCras: { [s: string]: any } = {};
  craPercent: number = 0;
  historiqueCra: DailyCheck[] = [];
  lastCras: any;
  historiqueCraSelected: DailyCheck;
  showDailySelectedCra: boolean = false;
  showDailySelectedCra1: boolean = false
  showDailySelectedCra2: boolean = false
  congeStatutList: any[] = [
    { label: 'Congé payé', value: 'Congé payé' },
    { label: 'Congé sans solde', value: 'Congé sans solde' },
    { label: 'Absence maladie', value: 'Absence maladie' },
    { label: 'Télétravail', value: 'Télétravail' },
    { label: 'Départ anticipé', value: 'Départ anticipé' },
    { label: 'Autorisation', value: 'Autorisation' },
    { label: 'Autre motif', value: 'Autre motif' },
  ];
  showAddCongeForm: boolean = false;
  showUpdateCongeForm: boolean = false;
  congeToUpdate: Conge;
  formAddConge: FormGroup;
  formUpdateConge: FormGroup;
  conges: Conge[] = [];
  expandedRows = {};
  showOtherTextArea: boolean = false;
  congeJustifile: any;
  paramValue: number;
  //* end check in variables

  constructor(
    private UserService: AuthService, private EtuService: EtudiantService,
    private classeService: ClasseService, private matiereService: MatiereService,
    private seanceService: SeanceService, private diplomeService: DiplomeService,
    private router: Router, private route: ActivatedRoute, private noteService: NoteService,
    private formateurService: FormateurService, private paySer: PaymentService,
    private dashboardService: DashboardService, private http: HttpClient,
    private messageService: MessageService,
    private formBuilder: FormBuilder, private projectService: ProjectService,
    private CService: CommercialPartenaireService, private PartenaireService: PartenaireService,
    private EIService: EtudiantsIntunsService, private dailyCheckService: DailyCheckService,
    private rhService: RhService, private congeService: CongeService,
    private ActuRHService: ActualiteRHService, private TicketService: TicketService,
    private ServiceServ: ServService, private CalendrierRHService: CalendrierRhService,
    private ticketService: TicketService,
    private PointageService: PointageService, private PoiService: PointeuseService
  ) { }
  histoPointage: PointageData[];
  reader: FileReader = new FileReader();
  machineDic = {}
  collaborateurList = []
  userSelected: Collaborateur
  collaborateurDic = {}
  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
    this.token = jwt_decode(localStorage.getItem('token'));
    this.PointageService.getAllWithUserID().subscribe(r => {
      this.dataMachine = r
      let UID = this.dataMachine.UserToUID[this.token.id]
      if (this.dataMachine.DataDic[UID])
        this.histoPointage = this.dataMachine.DataDic[UID]
    })
    this.PoiService.getAll().subscribe(ps => {
      ps.forEach(m => {
        this.machineDic[m.serial_number] = m
      })
    })
    this.UserService.getProfilePicture(this.token.id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          this.reader.readAsDataURL(blob);
        }
      }
    })
    this.rhService.getCollaborateurs()
      .then((response) => {
        response.forEach(c => {
          if (c.user_id) {
            this.collaborateurList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c })
            if (c.user_id._id == this.token.id) {
              this.userSelected = c
              this.getUsersEvents()
            }

          }

        })
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
    this.dashboardService.getByUserID(this.token.id).subscribe(dataDashboard => {
      this.dashboard = dataDashboard
    })
    this.rhService.getCollaborateurs()
      .then((response) => {
        response.forEach(c => {
          if (c.user_id) {
            this.collaborateurList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c })
            this.collaborateurDic[c.user_id._id] = c
          }

        })
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
    this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
      if (dataUser) {
        this.user = dataUser;
        this.isAdmin = dataUser.role == "Admin"
        this.isAgent = dataUser.role == "Agent" || dataUser.role == "Responsable"
        let service: any = dataUser.service_id
        if (this.isAgent && service != null) {
          this.isAdmission = service.label.includes('Admission')
          this.isPedagogie = service.label.includes('dagogie')
        }
        this.isEtudiant = dataUser.type == "Initial" || dataUser.type == "Alternant"
        this.isFormateur = dataUser.type == "Formateur"
        this.isCommercial = dataUser.type == "Commercial"
        this.isCEO = dataUser.type == "CEO Entreprise";
        this.isVisitor = dataUser.type == "Visitor" && dataUser.role == "Watcher";
        this.isIntuns = dataUser.type == "EtudiantsIntuns"
        this.isProspect = dataUser.type == "Prospect"

        this.EtuService.getPopulateByUserid(this.token.id).subscribe(dataEtu => {
          if (dataEtu) {
            this.dataEtudiant = dataEtu

            this.paimentAn = dataEtu.isAlternant
            this.paimentS1 = dataEtu.isAlternant

            if (!dataEtu.isAlternant && dataEtu.statut_dossier) {
              this.paimentAn = dataEtu.statut_dossier?.includes("Paiement finalisé")
              this.paimentS1 = (dataEtu.statut_dossier?.includes("Paiement Semestre 1 finalisé") || dataEtu.statut_dossier?.includes("Paiement finalisé"))
            }

            this.isEtudiant = true
            this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
            if (dataEtu.classe_id)
              this.refreshEvent(dataEtu)
            this.isEtudiant = !this.isReinscrit;
            this.noteService.getAllByEtudiantId(dataEtu._id).subscribe(
              ((responseNote) => {
                this.notes = responseNote;
                this.dernotes = []
                this.notes.forEach(n => {
                  if (n.matiere_id && this.dernotes.length != 10)
                    this.dernotes.push(n)
                })
              }));
          } else {
            this.isEtudiant = false
          }
        })
        if (this.isFormateur) {
          this.seanceService.getAllbyFormateur(this.token.id).subscribe(
            ((resSea) => {
              this.showEvents(resSea)
            }));
          this.formateurService.getByUserId(this.token.id).subscribe(data => {
            this.dataFormateur = data
          })
        }
        this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial || this.isCEO || this.isVisitor || this.isIntuns);
        if (this.isCommercial) {
          this.CService.getByUserId(this.token.id).subscribe(cData => {
            this.CommercialExterne = cData
            this.PartenaireService.getById(cData.partenaire_id).subscribe(pData => {
              this.PartenaireInfo = pData
              this.dashboard = null
              this.loadPP(this.PartenaireInfo)
            })
          })
        }
        if (this.isIntuns)
          this.EIService.EIgetByUSERID(this.token.id).subscribe(data => {
            this.dataIntuns = data
          })
      }
    })

    //Recupereation des matières
    this.matiereService.getAll().subscribe(
      (response) => {
        response.forEach(matiere => {
          this.matieres[matiere._id] = matiere;
        })
      }
    );

    //* Partie dédié au check
    // recuperation de l'utilisateur connecté
    this.onGetUserConnectedInformation();

    // initialisation du formulaire de mise à jour du statut
    this.formUpdateStatut = this.formBuilder.group({
      statut: ['', Validators.required],
    });

    // initialisation du formulaire d'ajout de cra
    this.formAddCra = this.formBuilder.group({
      number_minutes: [null, Validators.required],
      task: [null, Validators.required],
      mode_type: ['/min', Validators.required]
    });
    //initialisation du formulaire d'ajout de cra ticket
    this.formAddCraTicket = this.formBuilder.group({
      ticket: ['', Validators.required],
      duration: ['', Validators.required],
    })

    // recuperation de l'historique de pointage d'un collaborateur
    this.dailyCheckService.getUserChecks(this.token.id)
      .then((response) => {
        this.historiqueCra = response;
        this.lastCras = response[response.length - 1];
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); });

    //Recuperation des actus
    this.ActuRHService.getAll().subscribe((response) => {
      this.actualites = response;
    })

    // initialisation du formulaire d'ajout de congé
    this.formAddConge = this.formBuilder.group({
      type: ['', Validators.required],
      other: [''],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
      nb_jour: ['', Validators.required],
      motif: ['', Validators.required],
      urgent: [false]
    });

    // initialisation du formulaire de modification de congé
    this.formUpdateConge = this.formBuilder.group({
      type: ['', Validators.required],
      other: [''],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
      nb_jour: ['', Validators.required],
      motif: ['', Validators.required],
      urgent: [false]
    });

    this.route.queryParams.subscribe(params => {
      // Convertissez la valeur du paramètre en nombre en utilisant parseInt ou parseFloat
      this.paramValue = parseInt(params['param'], 10); // 10 est la base (base 10 pour les nombres)

      // Assurez-vous que la conversion s'est bien passée
      if (this.paramValue) {
        this.selectedTabIndex = this.paramValue;
        this.paramValue = 0;
      } else {
        this.selectedTabIndex = 0
      }
    });
    this.items = [
      {
        label: "Aujourd'hui",
        command: () => {
          this.showAssiduite()
        }
      },
      {
        label: 'Historique',
        command: () => {
          this.showHistorique()
        }
      }];
    this.itemsCra = [
      {
        label: "Ticket",
        command: () => {
          this.showFormAddCraTicket = true

        }
      },
      {
        label: 'Saisir',
        command: () => {
          this.showFormAddCra = true;
        }
      }];
  }
  dateFilterHistorique = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString()
  showHistorique() {
    if (this.visible == false) {
      this.visible = true
      this.dateFilterHistorique = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString()
      this.getHistoPointage(this.dateFilterHistorique)
    }
    else { this.visible = false }
  }
  showAssiduite() {
    let craLast: DailyCheck = this.historiqueCra[this.historiqueCra.length - 1]
    if (this.visibleA == false) {
      this.visibleA = true
    }
    else { this.visibleA = false }
    if (craLast?.today != new Date().toLocaleDateString('en-US')) {
      console.error({ severity: 'error', summary: 'Vous n\'avez pas encore fait votre CheckIn', detail: `Affichage du CRA du ${this.dateParseur(craLast?.today)}` }, new Date().toLocaleDateString('en-US'), craLast?.today)
    }

  }
  showConge() {
    this.visibleC = true
  }

  refreshEvent(etu: any) {
    this.seanceService.getAllByClasseId(etu.classe_id._id).subscribe(
      (data) => {
        this.showEvents(data)
      },
    );
  }

  showEvents(data) {
    this.seances = []
    let seancesCal = [];
    let classeID = [{}];
    let index = 0
    let diplomeList = {}

    let dicClasse = {}
    let dicDiplome = {}
    this.classeService.getAll().subscribe(datac => {
      datac.forEach(classe => {
        diplomeList[classe._id] = classe.diplome_id
        dicClasse[classe._id] = classe
      })
      this.diplomeService.getAll().subscribe(camp => {
        camp.forEach(ca => {
          dicDiplome[ca._id] = ca
        })
        data.forEach(d => {
          if (dicDiplome[dicClasse[d.classe_id[0]]?.diplome_id] && dicClasse[d.classe_id[0]]) {
            d.diplome_titre = dicDiplome[dicClasse[d.classe_id[0]].diplome_id].titre
            d.classe_abbrv = dicClasse[d.classe_id[0]].abbrv
            this.seances.push(d)
          }
        })
        for (let d of this.seances) {
          if (classeID[diplomeList[d.classe_id[0]]] == null) {
            classeID[diplomeList[d.classe_id[0]]] = environment.colorPaletteGreen[index]
            index++
            if (index > environment.colorPaletteGreen.length - 1) {
              index = 0
            }
          }

          seancesCal.push({
            "id": d._id,
            "title": d.libelle,
            "start": d.date_debut,
            "end": d.date_fin,
            "extendedProps": {
              "description": d.infos
            },
            "color": classeID[diplomeList[d.classe_id[0]]]
          });
        }

        this.options.events = seancesCal;
        this.events = seancesCal;
      })
    })

  }
  showForm = false
  saveLink() {
    let label = this.addLinkForm.value.libelle
    let link = this.addLinkForm.value.link
    if (link.includes("http") == false)
      link = "https://" + link
    this.dashboard.links.push({ label, link })
    this.dashboardService.addLinks(this.dashboard._id, this.dashboard.links).subscribe(newDashboard => {
      this.dashboard = newDashboard
      this.showForm = false
    }, err => {
      console.error(err)
    })
  }
  deleteLink(i) {
    if (confirm("Est ce que vous êtes sûr de vouloir supprimer le lien " + this.dashboard.links[i].label + " ?")) {
      this.dashboard.links.splice(i, 1)
      this.dashboardService.addLinks(this.dashboard._id, this.dashboard.links).subscribe(newDashboard => {
        this.dashboard = newDashboard
      })
    }

  }

  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    if (event && event.length > 0 && this.PartenaireInfo != null) {
      const formData = new FormData();

      formData.append('id', this.PartenaireInfo._id)
      formData.append('file', event[0])
      this.CService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de la photo de profil avec succès' });
        this.loadPP(this.PartenaireInfo)
      }, (error) => {
        console.error(error)
      })
    }
  }
  imageToShow: any = "../assets/images/avatar.PNG"
  commissions: any[] = []
  loadPP(rowData) {
    this.imageToShow = "../assets/images/avatar.PNG"
    this.CService.getProfilePicture(rowData._id).subscribe((data) => {
      if (data.error) {
        console.error(data.error)
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        let reader: FileReader = new FileReader();
        reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
        }, false);
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          reader.readAsDataURL(blob);
        }
      }

    })
  }
  editInfoCommercial = false
  editInfoCommercialForm: FormGroup = new FormGroup({
    indicatifPhone: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    indicatifWhatsapp: new FormControl(''),
    WhatsApp: new FormControl(''),
    site_web: new FormControl(''),
    facebook: new FormControl(''),
    Pays: new FormControl([], Validators.required),
    Services: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })
  initEditCommercialForm() {
    this.editInfoCommercial = true
    this.editInfoCommercialForm.setValue({
      indicatifPhone: this.PartenaireInfo.indicatifPhone,
      phone: this.PartenaireInfo.phone,
      indicatifWhatsapp: this.PartenaireInfo.indicatifWhatsapp,
      WhatsApp: this.PartenaireInfo.WhatsApp,
      site_web: this.PartenaireInfo.site_web,
      facebook: this.PartenaireInfo.facebook,
      Pays: this.PartenaireInfo.Pays.split(','),
      Services: this.PartenaireInfo.Services,
      description: this.PartenaireInfo.description,
    })
  }

  navigateToEmployabilite() {
    this.router.navigate(['/intuns/employabilite'])
  }

  downloadContrat() {
    this.PartenaireService.downloadContrat(this.PartenaireInfo._id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        importedSaveAs(downloadUrl, this.PartenaireInfo.pathEtatContrat);
        this.messageService.add({ severity: "success", summary: "Contrat", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Calendrier", detail: `Impossible de télécharger le fichier` }); });
  }

  saveEditCommercialInfo() {

    let data = { ...this.editInfoCommercialForm.value }
    data._id = this.PartenaireInfo._id
    data.Pays = data.Pays.join(',')
    this.PartenaireService.newUpdate(data).subscribe(partenaire => {
      this.PartenaireInfo = partenaire
      this.messageService.add({ severity: 'success', summary: 'Informations Partenaires', detail: 'Mise à jour des informations avec succès' });
      this.editInfoCommercial = false
    })
  }

  //Méthode de test pour LW deprecated
  test() {
    const xhr = new XMLHttpRequest();
    const url = 'https://sandbox-api.lemonway.fr/mb/eduhorizons/dev/directkitrest/v2/accounts/123456789212345';


    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
    xhr.onload = () => {
      console.log(xhr.responseURL); // http://example.com/test
      console.error(xhr.response)
    };
    xhr.send();
    const optionRequete = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer f3b0723d-9739-467b-8cb5-5c8855fc1e66',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      })
    };

    this.http.get(url, optionRequete).subscribe(r => {
      console.log(r)
    }, err => {
      console.error(err)
    })

  }
  onCreateSujetLabel(ticket: Ticket) {
    let r = ''
    if (ticket?.sujet_id?.label)
      r = ticket?.sujet_id?.label
    if (ticket.module)
      r = r + " - " + ticket.module
    if (ticket.type)
      r = r + " - " + ticket.type
    if (ticket.campus)
      r = r + " - " + ticket.campus
    if (ticket.filiere)
      r = r + " - " + ticket.filiere
    if (ticket.demande)
      r = r + " - " + ticket.demande
    return r
  }
  //* Check methods
  // recuperation de l'utilisateur connecté
  onGetUserConnectedInformation(): void {
    this.UserService.getPopulate(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        this.ticketService.getAccAff(this.userConnected._id)
          .subscribe(datatache => {
            this.ticketListe = datatache.map(ticket => ({
              ...ticket,
              label: `${ticket.customid} ${this.onCreateSujetLabel(ticket)} ${ticket.statut}`,
              value: `${ticket.customid} ${this.onCreateSujetLabel(ticket)} ${ticket.statut}`
            }))
          });
        // recupere la liste des congés
        this.onGetConges(this.userConnected._id);
        // verification du check in journalier
        this.onCheckDailyCheck(response._id);
        // Charger les tickets
        this.onGetTicketsRH()
        // Charger l'assiduité
        this.OnCalcAssiduite()
        //charger les events du Calendar
        this.loadCalendar()
      },
      error: (error) => { console.error(error) },
    });
  }

  // méthode de mise à jour du statut
  onUpdateStatus(statut = this.formUpdateStatut.value.statut): void {
    this.UserService.pathUserStatut(statut, this.userConnected._id)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Statut', detail: 'Votre statut à bien été mis à jour' });
        this.onGetUserConnectedInformation();
        this.showFormUpdateStatut = false;
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Statut', detail: 'Impossible de mettre à jour votre statut' }); });
  }

  // verification et recuperation du dailyCheck
  onCheckDailyCheck(id): void {
    this.dailyCheckService.verifCheckByUserId(this.token.id)
      .then((response) => {
        if (response == null) {
          console.error({ severity: 'error', summary: 'Check In', detail: "Vous n'avez toujours pas effectué votre Check In" }, this.token.id)
        } else {
          this.dailyCheck = response;
          // verifie s'il y'a eu un checkout
          if (response?.check_out != null) {
            // remise à zero des temps de travail
            this.pauseTiming = 0;
            this.craPercent = 0;
            this.workingTiming = 0;
            this.workingHour = 0;
            this.workingMinute = 0;
            //this.dailyCheck.check_in = null;
            //this.dailyCheck.cra = [];
          }
          // calcule du temps passé en pause
          this.pauseTiming = 0;
          this.dailyCheck?.pause.forEach((p) => {
            if (p.out) {
              this.pauseTiming = this.pauseTiming + (moment(new Date(p.out)).diff(moment(new Date(p.in)), 'minutes'));
            } else {
              this.pauseTiming = this.pauseTiming + (moment(new Date()).diff(moment(new Date(p.in)), 'minutes'));
            }
          })

          // calcule du temps passé au travail
          this.workingTiming = (moment(new Date()).diff(moment(new Date(this.dailyCheck?.check_in)), 'minutes'));
          if (this.dailyCheck?.check_out)
            this.workingTiming = (moment(new Date(this.dailyCheck?.check_out)).diff(moment(new Date(this.dailyCheck?.check_in)), 'minutes'));
          // Retrait du temps passé en pause
          this.workingTiming = this.workingTiming - this.pauseTiming;
          if (this.workingTiming < 60) {
            this.workingHour = 0;
            this.workingMinute = this.workingTiming;
          } else {
            this.workingHour = Math.floor(this.workingTiming / 60);
            this.workingMinute = this.workingTiming % 60;
          }
          //Calcul CRA Version Morgan
          let max = this.workingTiming
          let worked = 0
          this.dailyCheck?.cra.map((cra) => {
            worked += cra.number_minutes;
          });
          this.craPercent = ((worked * 100) / max)
          this.dailyCheck.taux_cra = this.craPercent
          /* calcul du pourcentage de remplissage du CRA */
          // recuperation du collaborateur
          this.rhService.getCollaborateurByUserId(this.userConnected._id)
            .then((collaborateur) => {
              let totalTimeCra = 0;

              this.dailyCheck?.cra.map((cra) => {
                totalTimeCra += cra.number_minutes;
              });

              if (!collaborateur || !collaborateur.h_cra) {
                collaborateur.h_cra = 7
              }
              // conversion du taux cra du collaborateur en minutes
              collaborateur.h_cra *= 60;
              // partie calcule du pourcentage en fonction du totalTimeCra
              let percent = (totalTimeCra * 100) / collaborateur.h_cra;
              this.craPercent = percent
            })
            .catch((error) => { console.error(error); });

        }
      })
      .catch((error) => { console.error(error) });
  }
  calculTravail() {
    let timeP = 0
    if (this.dailyCheck && this.dailyCheck.pause && this.dailyCheck.pause.length != 0) {
      this.dailyCheck.pause.forEach(val => {
        let ds2 = new Date(val.in).getTime()
        let df2 = new Date().getTime()
        if (val.out)
          df2 = new Date(val.out).getTime()
        timeP = timeP + (df2 - ds2)
      })
    }
    this.pauseTiming = Math.trunc(timeP / 60000)
    if (this.dailyCheck) {
      let ds = new Date(this.dailyCheck.check_in).getTime()
      let df = new Date().getTime()
      if (this.dailyCheck.check_out)
        df = new Date(this.dailyCheck.check_out).getTime()
      let calc = (df - ds) - timeP
      let hours = Math.trunc(calc / 3600000)
      let minutes = Math.trunc((calc - (hours * 3600000)) / 60000)
      return `${hours}H ${minutes}min`
    } else {
      return "Pas de CheckIn"
    }
  }
  calculPause() {
    if (this.dailyCheck && this.dailyCheck.pause && this.dailyCheck.pause.length != 0) {
      let p = 0
      console.log(this.dailyCheck.pause)
      this.dailyCheck.pause.forEach(val => {
        let ds = new Date(val.in).getTime()
        let df = new Date().getTime()
        if (val.out)
          df = new Date(val.out).getTime()
        p = p + (df - ds)
      })
      let hours = Math.trunc(p / 3600000)
      let minutes = Math.trunc((p - hours * 3600000) / 60000)
      return `${hours}H ${minutes}min`
    } else {
      return "Pas de Pause"
    }
  }
  // méthode de checkin
  onCheckIn(): void {

    const check = new DailyCheck();
    check.platform_in = this.getDeviceType()
    check.user_id = this.user._id;
    check.check_in = new Date();
    check.isInPause = false;
    this.classbutonchekin = "p-button-secondary mb-2"
    this.getIP().then(txt => {
      //check.localisation_in = txt
      this.dailyCheckService.postCheckIn(check)
        .then((response) => {
          this.messageService.add({ severity: 'success', summary: 'Check in', detail: "Votre journée de travail commence" });
          this.onCheckDailyCheck(response.user_id);
          this.onUpdateStatus('Disponible')
        })
        .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Check in', detail: "Impossible d’effectuer votre check in" }); });
    })

  }

  motifStr = ''
  displayMotif = false

  motifDropdown = [
    { label: 'Déjeuner', value: 'Déjeuner' },
    { label: 'Autre', value: 'Autre' }
  ]

  // méthode de pause
  onPause(): void {

    this.dailyCheck.pause.push({ in: new Date(), motif: this.motifStr });
    this.dailyCheck.isInPause = true;

    this.dailyCheckService.patchCheckIn({ _id: this.dailyCheck._id, pause: this.dailyCheck.pause, isInPause: true })
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Pause', detail: 'Bonne pause' });

        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
        this.onUpdateStatus('En pause')
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Pause', detail: 'Impossible de prendre en compte votre départ en pause' }); });
  }
  historiqueCraHisto = []
  // méthode de fin de la pause
  onStopPause(): void {
    // taille du tableau de check
    const pLength = this.dailyCheck.pause.length;
    this.dailyCheck.pause[pLength - 1].out = new Date();
    this.dailyCheck.isInPause = false;
    this.dailyCheck.pause_timing = this.pauseTiming + this.dailyCheck.pause_timing;

    this.dailyCheckService.patchCheckIn({ _id: this.dailyCheck._id, pause: this.dailyCheck.pause, isInPause: false, pause_timing: this.dailyCheck.pause_timing })
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Pause', detail: 'Bon retour au travail' });

        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
        this.onUpdateStatus('Disponible')
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Pause', detail: 'Impossible de prendre en compte votre retour de pause' }); });
    this.dailyCheckService.getUserChecks(this.token.id)
      .then((response) => {
        this.historiqueCra = response
        this.lastCras = response[response.length - 1];
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); });

  }

  // methôde de checkout
  onCheckOut(): void {
    this.pauseTiming = 0;
    this.dailyCheck?.pause.forEach((p) => {
      if (p.out) {
        this.pauseTiming = this.pauseTiming + (moment(new Date(p.out)).diff(moment(new Date(p.in)), 'minutes'));
      } else {
        this.pauseTiming = this.pauseTiming + (moment(new Date()).diff(moment(new Date(p.in)), 'minutes'));
      }
    })
    // calcule du temps passé au travail
    this.workingTiming = (moment(new Date()).diff(moment(new Date(this.dailyCheck?.check_in)), 'minutes'));
    if (this.dailyCheck?.check_out)
      this.workingTiming = (moment(new Date(this.dailyCheck?.check_out)).diff(moment(new Date(this.dailyCheck?.check_in)), 'minutes'));
    // Retrait du temps passé en pause
    this.workingTiming = this.workingTiming - this.pauseTiming;
    if (this.workingTiming < 60) {
      this.workingHour = 0;
      this.workingMinute = this.workingTiming;
    } else {
      this.workingHour = Math.floor(this.workingTiming / 60);
      this.workingMinute = this.workingTiming % 60;
    }
    //Calcul CRA Version Morgan
    let max = this.workingTiming
    let worked = 0
    this.dailyCheck?.cra.map((cra) => {
      worked += cra.number_minutes;
    });
    this.dailyCheck.check_out = new Date();
    this.dailyCheck.platform_out = this.getDeviceType()

    this.dailyCheck.pause_timing = this.pauseTiming;
    this.rhService.getCollaborateurByUserId(this.userConnected._id)
      .then((collaborateur) => {
        let totalTimeCra = 0;

        this.dailyCheck?.cra.map((cra) => {
          totalTimeCra += cra.number_minutes;
        });

        if (!collaborateur || !collaborateur.h_cra) {
          collaborateur.h_cra = 7
        }
        // conversion du taux cra du collaborateur en minutes
        collaborateur.h_cra *= 60;
        // partie calcule du pourcentage en fonction du totalTimeCra
        let percent = (totalTimeCra * 100) / collaborateur.h_cra;
        this.craPercent = percent
        this.dailyCheck.taux_cra = this.craPercent;
        this.getIP().then(txt => {
          //this.dailyCheck.localisation_out = txt
          this.dailyCheckService.patchCheckIn(this.dailyCheck)
            .then((response) => {
              this.messageService.add({ severity: 'success', summary: 'Check Out', detail: 'Merci pour cette journée de travail. À très bientôt!' });
              // recuperation du check journalier
              this.onCheckDailyCheck(response.user_id);
              this.onUpdateStatus('Absent')
              // recuperation de l'historique du cra
              this.dailyCheckService.getUserChecks(this.token.id)
                .then((response) => {
                  this.historiqueCra = response
                  this.lastCras = response[response.length - 1];
                })
                .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })
            })
            .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Check Out', detail: 'Impossible de prendre en compte votre checkout' }); });
        })

      })
      .catch((error) => { console.error(error); });

  }

  // pour créer des champs de formulaires à la volée pour la partie CRA
  onCreateCraField(): FormGroup {
    return (
      this.formBuilder.group({
        tache: ['', Validators.required],
        duration: ['', Validators.required],
      })
    );
  }
  // ajout de CRA
  onAddCra(): void {
    // ajout des données formulaire au dailycheck
    let number_minutes = this.formAddCra.value.number_minutes
    if (this.formAddCra.value.mode_type == '/H')
      number_minutes = number_minutes * 60

    if (this.dailyCheck.cra)
      this.dailyCheck.cra.push({ ... this.formAddCra.value, number_minutes });
    else
      this.dailyCheck.cra = [{ ... this.formAddCra.value, number_minutes }]

    this.dailyCheckService.patchCheckIn({ _id: this.dailyCheck._id, cra: this.dailyCheck.cra })
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Cra', detail: 'Votre CRA à été mis à jour' });
        this.formAddCra.reset();
        this.formAddCra.patchValue({ mode_type: '/min' })
        this.showFormAddCra = false;
        this.onCheckDailyCheck(response.user_id)
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Cra', detail: 'Impossible de mettre à jour votre CRA' }); });
  }
  onAddCraTicket(): void {
    const formValue = this.formAddCraTicket.value;
    // ajout des données formulaire au dailycheck

    this.dailyCheck.cra.push({ task: this.formAddCraTicket.get('ticket').value.label, number_minutes: this.formAddCraTicket.get('duration').value });


    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Cra', detail: 'Votre CRA à été mis à jour' });

        this.formAddCraTicket.reset();
        this.showFormAddCraTicket = false;
        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Cra', detail: 'Impossible de mettre à jour votre CRA' }); });
  }

  // partie modification d'un cra
  onRowEditInit(cra: any) {
    this.clonedCras[cra._id as string] = { ...cra };
  }

  onRowEditSave(cra: any) {

    this.dailyCheck.cra.forEach((dCra) => {
      if (dCra._id === cra._id) {
        dCra.task = cra.task;
        dCra.number_minutes = cra.number_minutes;
      }
    });

    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Cra', detail: 'Votre CRA à été mis à jour' });
        delete this.clonedCras[cra._id as string];
        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Cra', detail: 'Impossible de mettre à jour votre CRA' }); });
  }

  onRowEditCancel(cra: any, index: number) {
    delete this.clonedCras[cra._id as string];
  }

  // suppression d'un cra
  onDeleteCra(id: string): void {
    if (confirm("Voulez-vous retirer ce compte rendu")) {
      this.dailyCheck.cra = this.dailyCheck.cra.filter((cra) => cra._id != id);

      this.dailyCheckService.patchCheckIn(this.dailyCheck)
        .then((response) => {
          this.messageService.add({ severity: 'success', summary: 'Cra', detail: 'Votre CRA à été mis à jour' });
          // recuperation du check journalier
          this.onCheckDailyCheck(response.user_id);
        })
        .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Cra', detail: 'Impossible de mettre à jour votre CRA' }); });
    }
  }
  //selection du cra
  selectCra(cra: any) {
    this.historiqueCraSelected = cra;
  }
  // recuperation des demandes de congé du user
  onGetConges(id: string): void {
    this.congeService.getAllByUserId(id)
      .then((response) => { this.conges = response; })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Liste des congés', detail: "Impossible de recuprer vos demande de congé, veuillez contacter un admin via le service ticketing" }) });
  }

  tickets: Ticket[] = []
  // Recuperation des tickets RH
  onGetTicketsRH() {
    this.ServiceServ.getAServiceByLabel('Ressources Humaines').subscribe(r => {
      this.TicketService.getAllByServiceAndCreateurID(r?.dataService?._id, this.token.id).subscribe(tickets => {
        this.tickets = tickets
      })
    })
  }

  //AddTicket
  AddTicket() {
    this.ServiceServ.getAServiceByLabel('Ressources Humaines').subscribe(r => {
      this.router.navigate(['ticketing/gestion/ajout/', r.dataService._id])
    })
  }

  // methode qui affiche ou non le cgamps de saisie pour autres motif
  onShowOtherTextArea(event: any) {
    event.value == 'Autre motif' ? this.showOtherTextArea = true : this.showOtherTextArea = false;
  }

  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      this.congeJustifile = event.target.files[0];
    }
  }

  // demande de congé
  onAskConge(): void {
    // donnée congés
    const formValue = this.formAddConge.value;

    const conge = new Conge();
    conge.user_id = this.user._id;
    conge.date_demande = new Date();

    conge.type_conge = formValue.type;
    conge.other_motif = formValue.other;

    conge.date_debut = formValue.debut;
    conge.date_fin = formValue.fin;
    conge.nombre_jours = formValue.nb_jour;
    conge.motif = formValue.motif;
    conge.urgent = formValue.urgent;
    conge.statut = 'En attente';

    // envoi des données en bd
    this.congeService.postConge(conge)
      .then((response: Conge) => {
        if (this.congeJustifile != null) {
          // fichier justificatif
          let formData = new FormData();
          formData.append('id', response._id);
          formData.append('file', this.congeJustifile);

          this.congeService.uploadJustificatif(formData)
            .then(() => {
              this.formAddConge.reset();
              this.showAddCongeForm = false;
              this.congeJustifile = null;
              this.showOtherTextArea = false;

              this.messageService.add({ severity: 'success', summary: 'Demande de congé', detail: "Votre demande avec justificatif à bien été transmis, vous serez notifier d'une réponse très bientôt" });
              this.onGetConges(response.user_id);
            })
            .catch((error) => { this.messageService.add({ severity: 'warning', summary: 'Justificatif', detail: error.error }) });
        } else {
          this.formAddConge.reset();
          this.showAddCongeForm = false;
          this.congeJustifile = null;
          this.showOtherTextArea = false;
          this.messageService.add({ severity: 'success', summary: 'Demande de congé', detail: "Votre demande à bien été transmis, vous serez notifier d'une réponse très bientôt" });
          this.onGetConges(response.user_id);
        }
      })
      .catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Demande de congé', detail: "Impossible de transmettre votre demande, veuillez contacter un admin via le service ticketing" });
      });
  }

  onDonwloadJustificatif(id: string): void {
    this.congeService.donwloadJustificatif(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `jusiticatif.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Justificatif", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Justificatif", detail: `Impossible de télécharger le fichier` }); });
  }

  onDeleteConge(id: string): void {
    this.congeService.deleteConge(id)
      .then((response) => {
        this.messageService.add({ severity: "success", summary: "Congé", detail: "Démandé retirée" });
        this.onGetConges(this.userConnected._id);
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Congé", detail: "Impossible de de retiter votre demande" }) });
  }

  // methode pour pre-remplir le formulaire de modification de congé
  onPachCongeData(conge: Conge): void {
    this.congeToUpdate = conge;
    if (conge.type_conge === "Autre motif") {
      this.showOtherTextArea = true;
    }

    this.formUpdateConge.patchValue({
      type: conge.type_conge,
      other: conge.other_motif,
      debut: new Date(conge.date_debut),
      fin: new Date(conge.date_fin),
      nb_jour: conge.nombre_jours,
      motif: conge.motif,
      urgent: conge.urgent
    });

    this.showUpdateCongeForm = true;
  }

  onUpdateConge(): void {
    // recuperation des valeurs du formulaire
    const formValue = this.formUpdateConge.value;

    this.congeToUpdate.type_conge = formValue.type;
    this.congeToUpdate.other_motif = formValue.other;

    this.congeToUpdate.date_debut = formValue.debut;
    this.congeToUpdate.date_fin = formValue.fin;
    this.congeToUpdate.nombre_jours = formValue.nb_jour;
    this.congeToUpdate.motif = formValue.motif;
    this.congeToUpdate.urgent = formValue.urgent;
    this.congeService.putConge(this.congeToUpdate)
      .then(() => {
        this.formUpdateConge.reset();
        this.showUpdateCongeForm = false;
        this.showOtherTextArea = false;
        this.messageService.add({ severity: 'success', summary: 'Demande de congé', detail: "Votre demande à bien été modifié" });
        this.onGetConges(this.congeToUpdate.user_id);
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Congé', detail: 'Impossible de prendre en compte vos modifications' }); });
  }
  calculCra(dc: DailyCheck) {
    let totalTimeCra = 0;
    //console.log(dc?.cra)
    dc?.cra.map((cra) => {
      totalTimeCra += cra.number_minutes;
    });

    if (!this.userSelected || !this.userSelected.h_cra) {
      this.userSelected.h_cra = 7
    }
    // conversion du taux cra du collaborateur en minutes
    let nb = this.userSelected.h_cra * 60;
    // partie calcule du pourcentage en fonction du totalTimeCra
    return (Math.floor((totalTimeCra * 100) / nb)).toString();
  }
  getHistoPointage(value) {

    if (!value)
      value = new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString()
    this.dailyCheckService.getUserChecksByDate(this.token.id, value)
      .then((response) => {
        this.historiqueCraHisto = response.reverse();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })

  }

  actualites: ActualiteRH[]
  downloadRHFile(doc) {
    this.UserService.downloadRH(this.token.id, doc._id, doc.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  //* end

  getDelaiTraitrement(ticket: Ticket) {
    let date1 = new Date()
    if (ticket.statut == 'Traité' && ticket.date_fin_traitement)
      date1 = new Date(ticket.date_fin_traitement)
    let date2 = new Date(ticket.date_ajout)

    var diff = {
      sec: 0,
      min: null,
      hour: 0,
      day: 0
    }							// Initialisation du retour
    var tmp = date1.getTime() - date2.getTime();

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;					// Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);	// Nombre de minutes (partie entière)
    diff.min = tmp % 60;					// Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);	// Nombre d'heures (entières)
    diff.hour = tmp % 24;					// Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);	// Nombre de jours restants
    diff.day = tmp;
    if (diff.min < 10)
      diff.min = "0" + diff.min.toString()

    return `${diff.day}J ${diff.hour}H${diff.min}`;
  }

  downloadFile(index, ri: Ticket) {
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }
  deleteFile(index, ri: Ticket) {
    ri.documents.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents: ri.documents }).subscribe(data => {

      this.messageService.add({ severity: 'success', summary: 'Documents supprimé' })
    })
  }

  downloadFileService(index, ri: Ticket) {
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

  deleteFileService(index, ri: Ticket) {
    ri.documents_service.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents_service: ri.documents_service }).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Documents supprimé' })
    })
  }

  dateChoose = ''
  stats = {
    assiduite: 22,
    conges_pay: 0,
    conges_ss: 0,
    absence_non_justifie: 0,
    absence_justifie: 0,
    maladie: 0
  }
  OnCalcAssiduite() {
    if (this.dateChoose) {
      this.dailyCheckService.getUserChecksByDate(this.token.id, this.dateChoose)
        .then((response) => {
          this.stats.assiduite = response.length
        })
        .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })
      this.congeService.getUserCongesByDate(this.token.id, this.dateChoose)
        .then((response) => {
          response.forEach(c => {
            let dd = new Date(c.date_debut)
            if (dd > new Date(this.dateChoose + '-31'))
              dd = new Date(this.dateChoose + '-31')
            if (dd < new Date(this.dateChoose + '-01'))
              dd = new Date(this.dateChoose + '-01')
            let df = new Date(c.date_fin)
            if (df < new Date(this.dateChoose + '-01'))
              df = new Date(this.dateChoose + '-01')
            if (df > new Date(this.dateChoose + '-31'))
              df = new Date(this.dateChoose + '-31')
            var Difference_In_Time = dd.getTime() - df.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Math.abs(Difference_In_Time / (1000 * 3600 * 24)) + 1;
            if (c.type_conge == "Congé payé")
              this.stats.conges_pay += Difference_In_Days
            else if (c.type_conge == "Congé sans solde")
              this.stats.conges_ss += Difference_In_Days
            else if (c.type_conge == "Absence maladie")
              this.stats.maladie += Difference_In_Days
            else
              this.stats.absence_justifie += Difference_In_Days

          })
        })
        .catch((error) => {
          if (this.dateChoose)
            this.messageService.add({ severity: 'error', summary: 'Liste des congés', detail: "Impossible de recuprer vos demande de congé, veuillez contacter un admin via le service ticketing" })
        });
    }
  }

  onCalcNumberDay() {
    if (this.formAddConge.value.debut && this.formAddConge.value.fin) {
      var Difference_In_Time = new Date(this.formAddConge.value.debut).getTime() - new Date(this.formAddConge.value.fin).getTime();
      var Difference_In_Days = Math.abs(Difference_In_Time / (1000 * 3600 * 24)) + 1;
      this.formAddConge.patchValue({ nb_jour: Difference_In_Days })
    }
  }
  eventsRH = []
  displayData = false
  dataEvent: EventCalendarRH

  addEvent(event: EventCalendarRH) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.type == 'Jour férié France') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.type == 'Autre événement') {
      backgroundColor = '#9B59B6'
      borderColor = '#8E44AD'
    } else if (event.type == "Congé Validé") {
      backgroundColor = '#1ABC9C'
      borderColor = '#186A3B'
    } else if (event.type == "Absence Non Justifié") {
      backgroundColor = '#E74C3C'
      borderColor = '#7B241C'
    } else if (event.type == "Cours") {
      backgroundColor = '#c82df7'
      borderColor = '#9300bf'
    }
    this.eventsRH.push({ title: event.type, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } })
    //  this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.eventsRH
    this.eventsRH = Object.assign([], this.eventsRH) //Parceque Angular est trop c*n pour voir le changement de la variable autrement
    //this.cd.detectChanges();

  }

  loadCalendar() {
    this.eventsRH = []
    this.CalendrierRHService.getAll().subscribe(events => {
      events.forEach(ev => { this.addEvent(ev) })
      this.dailyCheckService.getUserChecks(this.token.id).then(dcs => {
        this.congeService.getAllByUserId(this.token.id).then(conges => {
          //Si conge Vert Si Check Rien Si Weekend Rien Si Absence de check hors Weekend alors Rouge
          let congesList: Date[] = []
          let absencesList: Date[] = []
          let presencesList: Date[] = []
          conges.forEach(c => {
            if (c.statut == 'Validé') {
              let dateC = new Date(c.date_debut)
              dateC.setDate(dateC.getDate() - 1)
              while (dateC < new Date(c.date_fin)) {
                congesList.push(new Date(dateC))
                this.addEvent(new EventCalendarRH(null, dateC, "Congé Validé", "Nous vous souhaitons de bonnes congés, couper votre téléphone, ne pensez pas au travail et reposez-vous bien!", null, c.type_conge))
                dateC.setDate(dateC.getDate() + 1)
              }
            }

          })
          dcs.forEach(dc => {
            presencesList.push(new Date(dc.check_in))
          })
          let dateDebut = new Date()
          let dateEnd = new Date()
          dateEnd.setFullYear(dateEnd.getFullYear() - 1)
          while (dateEnd < dateDebut) {
            if (dateDebut.getDay() != 0 && dateDebut.getDay() != 6) {
              //Vérifier si il a été présent ou si il a été en congé 
              if (presencesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                congesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                events.find(d => (new Date(d.date).getDate() == dateDebut.getDate() && new Date(d.date).getMonth() == dateDebut.getMonth())) == undefined) {
                absencesList.push(dateDebut)
                this.addEvent(new EventCalendarRH(null, dateDebut, "Absence Non Justifié", "Contacté la RH pour régulariser votre Absence ou via l'onglet 'Demande de congé / autorisation' de votre dashboard", null))
              }
            }
            dateDebut.setDate(dateDebut.getDate() - 1)
          }
        })
      })
    })

  }
  dataMachine

  getCheckIn(user_id) {
    let UID = this.dataMachine.UserToUID[user_id]
    if (this.dataMachine.DataDic[UID]) {
      let listCheck: PointageData[] = this.dataMachine.DataDic[UID]
      let date = new Date(listCheck[0].date)
      listCheck.forEach(element => {
        if (new Date(element.date) < date)
          date = new Date(element.date)
      });
      return date
    } else {
      return null
    }

  }
  displayPointeuse = false
  onSeePointeuse() {
    this.displayPointeuse = true
  }
  seeDescriptionActu = false
  seeActu: ActualiteRH
  seeMore(act: ActualiteRH) {
    this.seeActu = act
    this.seeDescriptionActu = true
  }
  eventUsers = []
  optionsUsers = {
    plugins: [dayGridPlugin, dayGridMonth, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      right: 'prev,next',
      center: 'title',
      left: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    events: [],
    eventClick: this.eventClickUser.bind(this),
    dateClick: this.dateClickFC.bind(this),
    //eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
    views: {
      dayGridMonth: { // name of view
        titleFormat: { year: 'numeric', month: 'long' }
        // other view-specific options here
      }
    }
  };
  defaultEventUsers = []
  filter_value = ['Absence Non Justifié', 'Absence', 'Autorisation', 'Jour férié Tunis', 'Jour férié France', 'Autre événement', 'Présent', 'Cours']
  //Calendrier RH
  onFilter() {
    this.eventUsers = []
    this.defaultEventUsers.forEach(r => {
      if (this.filter_value.includes(r.extendedProps.type)) {
        this.eventUsers.push(r)
      }
    })
    /*if (this.siteSelected.length != 0) {
      let keys = Object.keys(this.CongeDic)
      keys.forEach(k => {
        let r = []
        this.CongeDic[k].forEach((value: Conge) => {
          if (value.user_id) {
            let c: Collaborateur = this.collaborateurDic[value.user_id._id]
            if (this.atleastOne(c.localisation, this.siteSelected))
              r.push(c)
          }
        })
        this.CongeDic[k] = r
      })
    }*/

  }
  PresentDicUser = {}
  getUsersEvents() {
    this.eventUsers = []
    this.defaultEventUsers = []
    this.PresentDicUser = {}
    this.CalendrierRHService.getAll().subscribe(events => {
      //events.forEach(ev => { this.addEventUser(ev) })
      this.dailyCheckService.getUserChecks(this.userSelected.user_id._id).then(dcs => {
        this.congeService.getAllByUserId(this.userSelected.user_id._id).then(conges => {
          //Si conge Vert Si Check Rien Si Weekend Rien Si Absence de check hors Weekend alors Rouge
          let congesList: Date[] = []
          let absencesList: Date[] = []
          let presencesList: Date[] = []
          conges.forEach(c => {
            if (c.statut == 'Validé') {
              let dateC = new Date(c.date_debut)
              let dateF = new Date(c.date_fin)
              dateF.setDate(dateF.getDate() + 1)
              while (dateC < dateF) {
                congesList.push(new Date(dateC))
                this.addEventUser(new EventCalendarRH(null, dateC, "Autorisation", "Nous vous souhaitons de bonnes congés, couper votre téléphone, ne pensez pas au travail et reposez-vous bien!", null, c.type_conge))
                dateC.setDate(dateC.getDate() + 1)
              }
            }
          })
          dcs.forEach(dc => {
            presencesList.push(new Date(dc.check_in))
            if (this.PresentDicUser[new Date(dc.check_in).toDateString()]) {
              this.PresentDicUser[new Date(dc.check_in).toDateString()].push(dc)
            } else {
              this.PresentDicUser[new Date(dc.check_in).toDateString()] = [dc]
              this.addEventUser(new EventCalendarRH(null, new Date(dc.check_in), "Présent", "", null, "Activité"))
            }

          })
          //Charger les Réunions Teams

          let dateDebut = new Date()
          let dateEnd = new Date()
          dateEnd.setFullYear(dateEnd.getFullYear() - 1)
          while (dateEnd < dateDebut) {
            if (dateDebut.getDay() != 0 && dateDebut.getDay() != 6) {
              //Vérifier si il a été présent ou si il a été en congé 
              if (presencesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                congesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                events.find(d => (new Date(d.date).getDate() == dateDebut.getDate() && new Date(d.date).getMonth() == dateDebut.getMonth())) == undefined) {
                absencesList.push(dateDebut)
                this.addEventUser(new EventCalendarRH(null, dateDebut, "Absence Non Justifié", "Contacté la RH pour régulariser votre Absence ou via l'onglet 'Demande de congé / autorisation' de votre dashboard", null))
              }
            }
            dateDebut.setDate(dateDebut.getDate() - 1)
          }
          events.forEach(ev => {
            if (ev.type == 'Cours' && ev?.personal == this.token.id) {
              this.addEventUser(new EventCalendarRH(ev?._id, new Date(ev.date), "Cours", null, null))
            }

          })
          this.defaultEventUsers = this.eventUsers
          this.onFilter()
        })
      })
    })
    this.onFilter()
  }
  addEventUser(event: EventCalendarRH) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.type == 'Jour férié France') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.type == 'Autre événement') {
      backgroundColor = '#9B59B6'
      borderColor = '#8E44AD'
    } else if (event.type == "Autorisation") {
      backgroundColor = '#1ABC9C'
      borderColor = '#186A3B'
    } else if (event.type == "Absence Non Justifié") {
      backgroundColor = '#E74C3C'
      borderColor = '#7B241C'
    } else if (event.type == "Cours") {
      backgroundColor = '#c82df7'
      borderColor = '#9300bf'
    } else if (event.type == "Présent") {
      backgroundColor = '#37BAD4'
      borderColor = '#2fa2b9'
    }
    let title = event.type
    if (event.name)
      title = event.name
    if (event.campus)
      title = title + ", " + event.campus
    this.eventUsers.push({ title, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } })
    this.optionsUsers.events = this.eventUsers
    this.eventUsers = Object.assign([], this.eventUsers)

  }
  DataCRA = []
  displayCRA
  dateCRA: string;
  displayCRACheck = false
  dataCHECK: DailyCheck
  onValidateCRA(check: DailyCheck) {
    this.displayCRACheck = true
    this.dataCHECK = check
  }
  eventClickUser(event) {
    if (event.event.extendedProps.type == "Présent") {
      this.dateCRA = new Date(event.event.start).toDateString()
      this.DataCRA = this.PresentDicUser[this.dateCRA]
      this.displayCRA = true
    } else if (event.event.extendedProps.type == "Cours") {
      this.displayData = true
      this.dataEvent = event.event.extendedProps
    }
  }
  dateClickFC(event) {
    let r = true

    this.eventUsers.forEach(ev => {
      if (ev.extendedProps.type == 'Cours' && new Date(event.date).toString() == new Date(ev.extendedProps.date).toString()) {
        r = false
      }
    })
    if (r) {
      this.displayCours = true
      this.DataDay = event
    }
  }
  DataDay: any
  displayCours = false
  onAddJourDeCours() {
    this.CalendrierRHService.create({ type: 'Cours', created_by: this.token.id, date: this.DataDay.date, personal: this.token.id }).subscribe(newEvent => {
      this.addEventUser(newEvent)
      this.displayCours = false
      this.DataDay = null
      this.messageService.add({ severity: 'success', summary: 'Ajout d\'un événement avec succès' })
    })
  }
  isNaN(nb: number) { return isNaN(nb) }
  isInfinity(nb: number) { return nb == Infinity }


  getCheckOut(user_id) {
    if (this.dataMachine) {
      let UID = this.dataMachine.UserToUID[user_id]
      if (this.dataMachine.DataDic[UID]) {
        let listCheck: PointageData[] = this.dataMachine.DataDic[UID]
        let date = new Date(listCheck[0].date)
        listCheck.forEach(element => {
          if (new Date(element.date) > date)
            date = new Date(element.date)
        });
        return date
      } else {
        return null
      }
    }

  }

  saveCheck(check: DailyCheck) {
    this.dailyCheckService.patchCheckIn(check).then(r => {
      this.messageService.add({ severity: 'success', summary: "L'activité a été mis à jour" })

    }, error => { console.error(error) })
  }
  getDeviceType() {

    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Mobile";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "Mob";
    }
    return "PC";
  };
  getIP() {
    return fetch("https://checkip.amazonaws.com/").then(res => res.text()).then(data => {
      console.log(data)
      //return data
      return 'Refus de partage'
    }, error => {
      return "Inconnu (Error)"
    })
  }
  dateParseur(date_str: string) {
    if (date_str) {
      let pos1 = date_str.indexOf('/')
      let day = date_str.substring(0, pos1)
      let month = date_str.substring(pos1 + 1, date_str.length - 5)
      let year = date_str.substring(date_str.length - 4)
      return `${day}/${month}/${year}`
    } else {
      console.log(date_str)
      return 'Inconnu'
    }


  }
  totalCalc(cra: any[]) {
    let r = 0
    if (cra)
      cra.forEach(c => { r += c.number_minutes })
    if (r != 0) {
      let h = Math.trunc(r / 60)
      let m = r - (h * 60)
      return `${h}H ${m}min`
    } else
      return '0 min'
  }
  onDelete() {
    this.CalendrierRHService.delete(this.dataEvent._id).subscribe(d => {
      this.getUsersEvents()
      this.displayData = false
      this.dataEvent = null
    })
  }
  modeType = [
    { label: '/min', value: '/min' },
    { label: '/H', value: '/H' }
  ]
}



