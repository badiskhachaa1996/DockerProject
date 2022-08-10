import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

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

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];
  products: Product[];
  chartData: any;
  chartOptions: any;
  subscription: Subscription;
  config: AppConfig;

  user: User;
  etudiant: Etudiant;
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

  //Options du calendrier
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

  events: any[];
  dernotes: Note[] = [];

  eventClickFC(col) {
    this.router.navigate(['/emergement/' + col.event.id])
  }

  ID = this.route.snapshot.paramMap.get('id');
  type = this.route.snapshot.paramMap.get('type');

  constructor(private productService: ProductService, public configService: ConfigService,
    private UserService: AuthService, private EtuService: EtudiantService,
    private classeService: ClasseService, private matiereService: MatiereService,
    private seanceService: SeanceService, private diplomeService: DiplomeService,
    private router: Router, private route: ActivatedRoute, private noteService: NoteService) { }

  // ngOnInit() {

  //   console.log(this.ID)



  //   this.token = jwt_decode(localStorage.getItem('token'));
  //   this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
  //     if (dataUser) {
  //       this.isAdmin = dataUser.role == "Admin"
  //       this.isAgent = dataUser.role == "Agent" || dataUser.role == "Responsable"
  //       let service: any = dataUser.service_id
  //       if (this.isAgent && service != null) {
  //         this.isAdmission = service.label.includes('Admission')
  //         this.isPedagogie = service.label.includes('dagogie')
  //       }
  //       this.isEtudiant = dataUser.type == "Etudiant"
  //       this.isFormateur = dataUser.type == "Formateur"
  //       this.isCommercial = dataUser.type == "Commercial"
  //       if (this.isEtudiant) {
  //         this.EtuService.getByUser_id(this.token.id).subscribe(dataEtu => {
  //           this.refreshEvent(dataEtu)
  //           this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
  //           this.isEtudiant = !this.isReinscrit;
  //         })
  //       }
  //       this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial)
  //     }
  //   })


  //   /**  */
  //   //Recupereation des matières
  //   this.matiereService.getAll().subscribe(
  //     (response) => {
  //       console.log(response);
  //       response.forEach(matiere => {
  //         this.matieres[matiere._id] = matiere;
  //       })
  //     }
  //   );

  //   token;
  //   isAdmin = false
  //   isAgent = false
  //   isAdmission = false
  //   isPedagogie = false
  //   isEtudiant = false
  //   isFormateur = false
  //   isCommercial = false
  //   isReinscrit = false
  //   isUnknow = false

  //   constructor(private productService: ProductService, public configService: ConfigService, private UserService: AuthService, private EtuService: EtudiantService) { }

    ngOnInit() {
        this.token = jwt_decode(localStorage.getItem('token'));
        this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
            if (dataUser) {
                this.isAdmin = dataUser.role == "Admin"
                this.isAgent = dataUser.role == "Agent" || dataUser.role == "Responsable"
                let service: any = dataUser.service_id
                if (this.isAgent && service != null) {
                    this.isAdmission = service.label.includes('Admission')
                    this.isPedagogie = service.label.includes('dagogie')
                }
                this.isEtudiant = dataUser.type == "Etudiant"
                this.isFormateur = dataUser.type == "Formateur"
                this.isCommercial = dataUser.type == "Commercial"
                if (this.isEtudiant) {
                    this.EtuService.getByUser_id(this.token.id).subscribe(dataEtu => {
                      this.refreshEvent(dataEtu)
                      this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
                      this.isEtudiant = !this.isReinscrit;
                    })
                }
                this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial)
            }
        })

        //SAKAI Default
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });
        this.productService.getProductsSmall().then(data => this.products = data);

    //Recupereation des matières
      this.matiereService.getAll().subscribe(
        (response) => {
          console.log(response);
          response.forEach(matiere => {
            this.matieres[matiere._id] = matiere;
          })
        }
      );

    // recuperation de la liste des notes par étudiant
    this.EtuService.getByUser_id(this.token.id).subscribe(
      (responseEtu) => {
        this.etudiant = responseEtu;

        this.noteService.getAllByEtudiantId(this.etudiant._id).subscribe(
          ((responseNote) => {
            this.notes = responseNote;
            this.dernotes = this.notes.slice(1,6)
          }));


      });
      


    //SAKAI Default
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
      this.updateChartOptions();
    });
    this.productService.getProductsSmall().then(data => this.products = data);

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: '#2f4860',
          borderColor: '#2f4860',
          tension: .4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: '#00bb7e',
          borderColor: '#00bb7e',
          tension: .4
        }
      ]
    };
  }

  SCIENCE() {
    console.log("PAS TOUCHE")

  }

  updateChartOptions() {
    if (this.config.dark)
      this.applyDarkTheme();
    else
      this.applyLightTheme();

  }

  applyDarkTheme() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
        y: {
          ticks: {
            color: '#ebedef'
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          }
        },
      }
    };
  }

  applyLightTheme() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef',
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef',
          }
        },
      }
    };
  }

  refreshEvent(etu:Etudiant) {
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
}
