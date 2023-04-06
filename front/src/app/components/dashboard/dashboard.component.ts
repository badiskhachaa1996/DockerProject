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
import { IntimeService } from 'src/app/services/intime.service';
import { InTime } from 'src/app/models/InTime';
import { info } from 'console';
import { ProjectService } from 'src/app/services/project.service';
import { Tache } from 'src/app/models/project/Tache';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { PartenaireService } from 'src/app/services/partenaire.service';


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

  dashboard: Dashboard = null
  dataEtudiant: Etudiant = null
  dataFormateur: Formateur = null

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


  //Partie checkin checkout
  isCheck: boolean = false;
  isCheckOut: boolean = false;
  statut: string;
  dailyCheck: InTime;
  showFormDailyActivityDetails: boolean = false;
  formDailyActivityDetails: FormGroup;
  today: Date = new Date();
  showButtonsValidateCra: boolean = false; // permet d'afficher les boutons qui s'affiche au click pour remplir le cra
  taskForUser: Tache[] = [];
  showTaskForUser: boolean = false; // permet d'afficher les tâches de l'utilisateur qui sont en cours
  clonedTaches: { [s: string]: Tache; } = {}; // pour le tableau éditable des taches
  initialNumberOfHours: number; // Nombre d'heure d'une tâche avant modification

  constructor(
    private UserService: AuthService, private EtuService: EtudiantService,
    private classeService: ClasseService, private matiereService: MatiereService,
    private seanceService: SeanceService, private diplomeService: DiplomeService,
    private router: Router, private route: ActivatedRoute, private noteService: NoteService,
    private formateurService: FormateurService, private paySer: PaymentService,
    private dashboardService: DashboardService, private http: HttpClient,
    private inTimeService: IntimeService, private messageService: MessageService,
    private formBuilder: FormBuilder, private projectService: ProjectService,
    private CService: CommercialPartenaireService, private PartenaireService: PartenaireService
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
        this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial || this.isCEO || this.isVisitor);
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

    //Verification du checkin
    this.onIsCheck();

    //Initialisation du formulaire de tache
    this.onInitFormDailyActivityDetails()

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



  //Verification du checkin
  onIsCheck() {
    let today = new Date().toLocaleDateString();
    let todayReplaced = '';

    for (let i = 0; i < today.length; i++) {
      if (today[i] === '/') {
        todayReplaced += '-';
      }
      else {
        todayReplaced += today[i];
      }

    }

    this.inTimeService.getByDateByUserId(this.token.id, todayReplaced)
      .then((response: InTime) => {
        if (response) {
          this.dailyCheck = response;
          this.statut = this.dailyCheck.statut;
          this.isCheck = true;
          if (response.out_date != null) {
            this.isCheckOut = true;
          }
        }
        else {
          this.statut = 'Check in non effectué';
          this.isCheck = false;
        }
      })
      .catch((error) => { console.log(error) })
  }


  //Methode de check in
  onCheckIn() {
    const inTime = new InTime();

    inTime.user_id = this.token.id;
    inTime.in_ip_adress = null;

    let today = new Date().toLocaleDateString();
    let todayReplaced = '';

    for (let i = 0; i < today.length; i++) {
      if (today[i] === '/') {
        todayReplaced += '-';
      }
      else {
        todayReplaced += today[i];
      }

    }

    inTime.date_of_the_day = todayReplaced;
    inTime.in_date = new Date();
    inTime.out_date = null;
    inTime.statut = 'Au travail';
    inTime.isCheckable = true;
    inTime.craIsValidate = false;

    this.inTimeService.postJustArrived(inTime)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Check in effectué' });
        this.onIsCheck();
      })
      .catch((error) => { console.log(error) });
  }


  //Initialiser le formulaire 
  onInitFormDailyActivityDetails() {
    this.formDailyActivityDetails = this.formBuilder.group({
      task: ['', Validators.required],
      number_of_hour: ['', Validators.required],
    });
  }

  // toggle the form daily activity
  onToggleFormDailyActivityDetail(): void {
    this.showFormDailyActivityDetails = !this.showFormDailyActivityDetails;
  }

  // méthode de validation du cra via le formulaire
  onValidateCraByForm() {
    const formValue = this.formDailyActivityDetails.value;
    // ajout du nombre d'heure
    if (this.dailyCheck.number_of_hour == null) {
      this.dailyCheck.number_of_hour = 0;
      this.dailyCheck.number_of_hour += formValue.number_of_hour;
    } else {
      this.dailyCheck.number_of_hour += formValue.number_of_hour;
    }

    this.dailyCheck.activity_details.push(`${formValue.number_of_hour}h • ${formValue.task}`);
    this.dailyCheck.statut = `En attente du checkout`;
    this.dailyCheck.isCheckable = false;

    // mention Tunis
    if (this.user.pays_adresse != 'Tunisie') {
      this.dailyCheck.number_of_hour >= 7 ? this.dailyCheck.craIsValidate = true : this.dailyCheck.craIsValidate = false;
    }
    else {
      this.dailyCheck.number_of_hour >= 8 ? this.dailyCheck.craIsValidate = true : this.dailyCheck.craIsValidate = false;
    }


    // modification du dailycheck en bd
    this.inTimeService.patchCheck(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Check', detail: response.success });
        // this.showFormDailyActivityDetails = false;
        this.showTaskForUser = false;
        // this.showButtonsValidateCra = false;
        this.formDailyActivityDetails.reset();
        this.onIsCheck();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Check', detail: error.error }); })
  }

  // toggle sur l'affichage des tâches de l'utilisateur
  onToggleShowTaskForUser(): void {
    this.showTaskForUser = !this.showTaskForUser;
  }

  // méthode de recuperation de la liste des tâches en cours de l'utilisateur connecté
  onGetTaskInProgressForUser(): void {
    this.projectService.getTasksInProgressByIdUser(this.token.id)
      .then((response) => {
        this.taskForUser = [];
        this.taskForUser = response;
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  }

  // au clic du bouton de modification
  onRowEditInit(tache: Tache) {
    this.initialNumberOfHours = tache.number_of_hour;
    this.clonedTaches[tache._id] = { ...tache };
  }

  // méthode de validation du cra via la liste des tâches en cours
  onRowEditSave(tache: Tache) {
    // ajout du nombre d'heure passée sur la tâche au daily check
    let numberOfHourAfterValidation = this.initialNumberOfHours - tache.number_of_hour;

    if (this.dailyCheck.number_of_hour == null) {
      this.dailyCheck.number_of_hour = 0;
      this.dailyCheck.number_of_hour += numberOfHourAfterValidation;
    } else {
      this.dailyCheck.number_of_hour += numberOfHourAfterValidation;
    }

    // ajout de la tache au daily check
    this.dailyCheck.activity_details.push(`${numberOfHourAfterValidation}h - ${tache.percent}% • ${tache.libelle}`);

    // mention Tunis
    if (this.user.pays_adresse != 'Tunisie') {
      this.dailyCheck.number_of_hour >= 7 ? this.dailyCheck.craIsValidate = true : this.dailyCheck.craIsValidate = false;
    }
    else {
      this.dailyCheck.number_of_hour >= 8 ? this.dailyCheck.craIsValidate = true : this.dailyCheck.craIsValidate = false;
    }

    // envoi du projet modifié en base de données
    this.projectService.putTask(tache)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Activité', detail: response.success });

        this.dailyCheck.statut = `En attente du checkout`;
        // modification du daily check en bd
        this.inTimeService.patchCheck(this.dailyCheck)
          .then((response) => {
            this.messageService.add({ severity: 'success', summary: 'Check', detail: response.success });
            this.showFormDailyActivityDetails = false;
            // this.showTaskForUser = false;
            // this.showButtonsValidateCra = false;
            this.formDailyActivityDetails.reset();
            this.onIsCheck();
          })
          .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Check', detail: error.error }); })
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Tâche', detail: error.error }); });

    // après la validation
    delete this.clonedTaches[tache._id];
    // this.messageService.add({ severity: 'success', summary: 'Tâche', detail: 'Votre tâche a été mis à jour' });
  }

  // a l'annulation de la modif
  onRowEditCancel(tache: Tache, index: number) {
    // recuperation de la liste des taches en cours de l'utilisateur
    this.onGetTaskInProgressForUser();
    delete this.clonedTaches[tache._id];
  }


  // méthode checkout récupère l'heure du checkout
  onCheckOut(): void {
    this.dailyCheck.isCheckable = false;
    this.dailyCheck.craIsValidate = true;

    this.inTimeService.patchCheckOut(this.dailyCheck)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Check', detail: response.success });
        this.showButtonsValidateCra = false;
        this.showFormDailyActivityDetails = false;
        this.showTaskForUser = false;
        this.onIsCheck();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Check', detail: error.error }); })
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

  //Méthode de test pour LW
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
}
