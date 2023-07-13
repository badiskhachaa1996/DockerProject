import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../dev-components/api-template/product';
import { ProductService } from '../../dev-components/service-template/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../dev-components/service-template/app.config.service';
import { AppConfig } from '../../dev-components/api-template/appconfig';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { GalleriaModule } from 'primeng/galleria';
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
import { Tache } from 'src/app/models/project/Tache';
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


@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  paysList = environment.pays;
  user: User;
  classe: Classe[] = [];
  paimentS1 = false
  paimentAn = false

  seances: Seance[] = [];
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  formateurs: Formateur[] = [];

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

  dashboard: Dashboard = null
  dataEtudiant: Etudiant = null
  dataFormateur: Formateur = null
  dataIntuns: EtudiantIntuns;

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
    locale: 'fr',
    timeZone: 'local',
    contentHeight: 500,
    eventClick: this.eventClickFC.bind(this),
    events: [],
    defaultView: "timeGridDay",
    minTime: '08:00:00',
    firstDay: 1
  }

  dernotes: Note[] = [];

  //Options du calendrier formateur
  optionsforma = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      left: "title",
      right: 'prev,next'
    },
    locale: 'fr',
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
    { label: 'Occupé', value: 'Occupé' },
    { label: 'Absent', value: 'Absent' },
    { label: 'En pause', value: 'En pause' },
  ];
  formAddCra: FormGroup;
  showFormAddCra: boolean = false;
  clonedCras: { [s: string]: any } = {};
  craPercent: string = '0';
  historiqueCra: DailyCheck[] = [];
  historiqueCraSelected: DailyCheck;
  showDailySelectedCra: boolean = false;
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
    private rhService: RhService
  ) { }


  ngOnInit() {

    this.token = jwt_decode(localStorage.getItem('token'));
    this.dashboardService.getByUserID(this.token.id).subscribe(dataDashboard => {
      this.dashboard = dataDashboard
    })
    this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
      if (dataUser) {
        this.user = dataUser;
        // console.log(dataUser.type);
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
      cras: this.formBuilder.array([this.onCreateCraField()]),
    });

    // recuperation de l'historique de pointage d'un collaborateur
    this.dailyCheckService.getUserChecks(this.token.id)
      .then((response) => {
        this.historiqueCra = response;
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })
  }

  SCIENCE() {
    console.log("PAS TOUCHE")

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
      console.log(formData)
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
    console.log(rowData)
    this.CService.getProfilePicture(rowData._id).subscribe((data) => {
      if (data.error) {
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

  //* Check methods
  // recuperation de l'utilisateur connecté
  onGetUserConnectedInformation(): void {
    this.UserService.getPopulate(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        // verification du check in journalier
        this.onCheckDailyCheck(response._id);
      },
      error: (error) => { console.log(error) },
    });
  }

  // méthode de mise à jour du statut
  onUpdateStatus(): void {
    const statut = this.formUpdateStatut.value.statut;
    this.UserService.pathUserStatut(statut, this.userConnected._id)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Statut', detail: 'Votre statut à bien été mis à jour' });
        this.onGetUserConnectedInformation();
        this.showFormUpdateStatut = false;
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Statut', detail: 'Impossible de mettre à jour votre statut' }); });
  }

  // verification et recuperation du dailyCheck
  onCheckDailyCheck(id: string): void {
    this.dailyCheckService.verifCheckByUserId(id)
      .then((response) => {
        console.log(response);
        if (response == null) {
          this.messageService.add({ severity: 'error', summary: 'Check In', detail: "Vous n'avez toujours pas effectué votre Check In" })
        } else {
          this.dailyCheck = response;

          // verifie s'il y'a eu un checkout
          if (response?.check_out != null) {
            // remise à zero des temps de travail
            this.pauseTiming = 0;
            this.craPercent = '0';
            this.workingTiming = 0;
            this.workingHour = 0;
            this.workingMinute = 0;
            this.dailyCheck.check_in = null;
            this.dailyCheck.cra = [];
          } else {
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
            // Retrait du temps passé en pause
            this.workingTiming = this.workingTiming - this.pauseTiming;
            if (this.workingTiming < 60) {
              this.workingHour = 0;
              this.workingMinute = this.workingTiming;
            } else {
              this.workingHour = Math.floor(this.workingTiming / 60);
              this.workingMinute = this.workingTiming % 60;
            }

            /* calcul du pourcentage de remplissage du CRA */
            // recuperation du collaborateur
            this.rhService.getCollaborateurByUserId(this.userConnected._id)
              .then((collaborateur) => {
                let totalTimeCra = 0;

                this.dailyCheck?.cra.map((cra) => {
                  totalTimeCra += cra.number_minutes;
                });

                if (collaborateur != null) {
                  // conversion du taux cra du collaborateur en minutes
                  collaborateur.h_cra *= 60;
                  // partie calcule du pourcentage en fonction du totalTimeCra
                  let percent = (totalTimeCra * 100) / collaborateur.h_cra;

                  this.craPercent = percent.toString().substring(0, 4);
                } else {
                  this.craPercent = '0';
                  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Vous êtes pas renseigné en tant que collaborateur par le service RH, impossible de calculer votre taux de remplissage CRA' })
                }

              })
              .catch((error) => { console.log(error); });
          }
        }
      })
      .catch((error) => { console.error(error) });
  }

  // méthode de checkin
  onCheckIn(): void {
    const check = new DailyCheck();

    check.user_id = this.user._id;
    check.check_in = new Date();
    check.isInPause = false;

    this.dailyCheckService.postCheckIn(check)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Check in', detail: "Votre journée de travail commence" });
        this.onCheckDailyCheck(response.user_id);
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Check in', detail: "Impossible d’effectuer votre check in" }); });
  }

  // méthode de pause
  onPause(): void {
    this.dailyCheck.pause.push({ in: new Date() });
    this.dailyCheck.isInPause = true;

    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Pause', detail: 'Bonne pause' });

        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Pause', detail: 'Impossible de prendre en compte votre départ en pause' }); });
  }

  // méthode de fin de la pause
  onStopPause(): void {
    // taille du tableau de check
    const pLength = this.dailyCheck.pause.length;
    this.dailyCheck.pause[pLength - 1].out = new Date();
    this.dailyCheck.isInPause = false;

    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Pause', detail: 'Bon retour au travail' });

        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Pause', detail: 'Impossible de prendre en compte votre retour de pause' }); });
  }

  // methôde de checkout
  onCheckOut(): void {
    this.dailyCheck.check_out = new Date();
    this.dailyCheck.taux_cra = this.craPercent;
    this.dailyCheck.pause_timing = this.pauseTiming;

    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Check Out', detail: 'Merci pour cette journée de travail. À très bientôt!' });
        // recuperation du check journalier
        this.onCheckDailyCheck(response.user_id);
        // recuperation de l'historique du cra
        this.dailyCheckService.getUserChecks(this.token.id)
          .then((response) => {
            this.historiqueCra = response;
          })
          .catch((error) => { this.messageService.add({ severity: 'error', summary: 'CRA', detail: 'Impossible de récupérer votre historique de pointage' }); })
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Check Out', detail: 'Impossible de prendre en compte votre checkout' }); });
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

  // récupère les compétences
  getCras(): FormArray {
    return this.formAddCra.get('cras') as FormArray;
  }

  // ajoute de nouveaux champs au formulaire
  onAddCraField(): void {
    const newCraControl = this.onCreateCraField();
    this.getCras().push(newCraControl);
  }

  // suppression d'un champ de compétence
  onDeleteCraField(i: number): void {
    this.getCras().removeAt(i);
  }

  // ajout de CRA
  onAddCra(): void {
    const formValue = this.formAddCra.value;
    // ajout des données formulaire au dailycheck

    formValue.cras.forEach((cra) => {
      this.dailyCheck.cra.push({ task: cra.tache, number_minutes: cra.duration });
    });

    this.dailyCheckService.patchCheckIn(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Cra', detail: 'Votre CRA à été mis à jour' });
        this.formAddCra.reset();
        this.showFormAddCra = false;
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
  //* end
}
