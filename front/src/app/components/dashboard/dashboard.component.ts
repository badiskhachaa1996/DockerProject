import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
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

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  user: User;
  classe: Classe[] = [];

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
  isReinscrit = false
  isUnknow = false

  dashboard: Dashboard = null
  dataEtudiant: Etudiant = null

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
    events: []
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
    defaultView: "timeGridDay"
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
    defaultView: "timeGridDay"
  }

  seanceNow: Seance[] = [];

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
  statut: string;
  dailyCheck: InTime;
  showFormDailyActivityDetails: boolean = false;
  formDailyActivityDetails: FormGroup;

  constructor(
    private UserService: AuthService, private EtuService: EtudiantService,
    private classeService: ClasseService, private matiereService: MatiereService,
    private seanceService: SeanceService, private diplomeService: DiplomeService,
    private router: Router, private route: ActivatedRoute, private noteService: NoteService,
    private formateurService: FormateurService, private paySer: PaymentService,
    private dashboardService: DashboardService, private http: HttpClient,
    private inTimeService: IntimeService, private messageService: MessageService,
    private formBuilder: FormBuilder,
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
        this.isEtudiant = dataUser.type == "Etudiant" || dataUser.type == "Initial" || dataUser.type == "Alternant"
        this.isFormateur = dataUser.type == "Formateur"
        this.isCommercial = dataUser.type == "Commercial"
        if (this.isEtudiant) {
          this.EtuService.getByUser_id(this.token.id).subscribe(dataEtu => {
            this.dataEtudiant = dataEtu
            if (dataEtu) {
              this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
              if (dataEtu.classe_id)
                this.refreshEvent(dataEtu)
              this.isEtudiant = !this.isReinscrit;
              this.noteService.getAllByEtudiantId(dataEtu._id).subscribe(
                ((responseNote) => {
                  this.notes = responseNote;
                  this.dernotes = this.notes.slice(1, 6)
                }));
            } else {
              this.isEtudiant = false
            }
          })
          // recuperation de la liste des notes par étudiant
          this.EtuService.getByUser_id(this.token.id).subscribe(
            (responseEtu) => {
              if (responseEtu) {

              }
            });
        }
        if (this.isFormateur) {
          this.seanceService.getAllbyFormateur(this.token.id).subscribe(
            ((resSea) => {
              this.showEvents(resSea)
            }));
        }
        this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial)
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

  refreshEvent(etu: Etudiant) {
    this.seanceService.getAllByClasseId(etu.classe_id).subscribe(
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

    this.inTimeService.getIpAdress()
      .then((response: any) => {
        const inTime = new InTime();

        inTime.user_id = this.token.id;
        inTime.in_ip_adress = response.ip;

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

        this.inTimeService.postJustArrived(inTime)
          .then((response) => {
            this.messageService.add({ severity: 'success', summary: 'Check in effectué' });
            this.onIsCheck();
          })
          .catch((error) => { console.log(error) })

      })
      .catch((error) => { console.log(error) })

  }


  //Initialiser le formulaire 
  onInitFormDailyActivityDetails()
  {
    this.formDailyActivityDetails = this.formBuilder.group({
      task: ['', Validators.required],
      tasks: this.formBuilder.array([]),
    });
  }

  getTasks()
  {
    return this.formDailyActivityDetails.get('tasks') as FormArray;
  }

  onAddTask()
  {
    const newTaskControl = this.formBuilder.control('', Validators.required);
    this.getTasks().push(newTaskControl); 
  }

  onRemoveTask(i: number)
  {
    this.getTasks().removeAt(i);
  }


  onCheckOut() {
    this.inTimeService.getIpAdress()
      .then((response: any) => {
        const today = new Date().toLocaleDateString();
        let todayReplaced = '';
        for (let i = 0; i < today.length; i++) {
          if (today[i] === '/') {
            todayReplaced += '-';
          }
          else {
            todayReplaced += today[i];
          }
        }

        const userId = this.token.id;
        const outDate = new Date();
        const dateOfToday = todayReplaced;
        const ipAdress = response.ip;
        const principaleActivityDetails = this.formDailyActivityDetails.get('task').value;
        const activityDetails = this.formDailyActivityDetails.get('tasks').value;

        console.log(activityDetails);

        this.inTimeService.patchJustGone({ user_id: userId, out_date: outDate, date_of_the_day: dateOfToday, ip_adress: ipAdress, principale_activity_details: principaleActivityDetails, activity_details: activityDetails })
          .then((response) => {
            this.messageService.add({ severity: 'success', summary: 'Check out effectué' });
            this.dailyCheck = response;
            this.formDailyActivityDetails.reset();
            this.showFormDailyActivityDetails = false;
            this.onIsCheck();
          })
          .catch((err) => { console.error(err); });

      })
      .catch((error) => { console.log(error) })

  }


  onGetBackgroundColor() {
    let color = undefined;
    switch (this.statut) {
      case 'Check in non effectué':
        color = '#ffcc00';
        break;
      case "Parti avant l'heure":
        color = 'red';
        break;
      case "présent toute la journée":
        color = 'green';
        break;
      case "Au travail":
        color = '#ff9966';
        break;
      default:
        color = 'green';
        break;
    }

    return color;
  }

  //Methode de test pour LW
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
