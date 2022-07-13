import { Component, OnInit, ViewChild } from '@angular/core';
import { Seance } from 'src/app/models/Seance';
import { ClasseService } from 'src/app/services/classe.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

//plugins du calendrier
import { FullCalendar } from 'primeng/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Classe } from 'src/app/models/Classe';
import { Formateur } from 'src/app/models/Formateur';
import { Matiere } from 'src/app/models/Matiere';

@Component({
  selector: 'app-emploi-du-temps',
  templateUrl: './emploi-du-temps.component.html',
  styleUrls: ['./emploi-du-temps.component.scss']
})
export class EmploiDuTempsComponent implements OnInit {

  seances: Seance[] = [];
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  formateurs: Formateur[] = [];

  //variables du calendrier
  @ViewChild('calendar') private calendar: FullCalendar;

  //Options du calendrier
  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    footer: {
      left: 'prev,next',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: this.eventClickFC.bind(this),
    eventMouseEnter: function (col) {
      // changement de couleur
      col.el.style.borderColor = 'red';
    },
    eventMouseLeave: function (col) {
      // changement de couleur
      col.el.style.borderColor = 'white';
    },
    locale: 'fr',
    timeZone: 'local',
    contentHeight: 500,
    defaultView: "timeGridWeek",
    events: []

  }

  eventClickFC(col) {
    if (this.type == null) {
      this.seanceService.getById(col.event.id).subscribe(rowData => {
        let classeList = [];
        rowData.classe_id.forEach(classeID => {
          classeList.push({ nom: this.classes[classeID]?.nom, value: this.classes[classeID]?._id });
        });
        let c = []
        rowData.campus_id.forEach(cid => {
          c.push({ libelle: this.dicCampus[cid]?.nom, value: this.dicCampus[cid]?._id })
        })
        this.seanceFormUpdate.patchValue({ campus_id: c })
        this.seanceFormUpdate = new FormGroup({
          classe: new FormControl(classeList),
          matiere: new FormControl({ nom: this.matieres[rowData.matiere_id].nom, value: rowData.matiere_id }, Validators.required),
          libelle: new FormControl(rowData.libelle),
          date_debut: new FormControl(new Date(rowData.date_debut).toISOString().slice(0, 16), Validators.required),
          date_fin: new FormControl(new Date(rowData.date_fin).toISOString().slice(0, 16), Validators.required),
          formateur: new FormControl({ nom: this.formateurs[rowData.formateur_id].firstname + " " + this.formateurs[rowData.formateur_id].lastname, value: rowData.formateur_id }, Validators.required),
          isPresentiel: new FormControl(rowData.isPresentiel),
          salle_name: new FormControl({ value: rowData.salle_name }),
          campus_id: new FormControl(c),
          isPlanified: new FormControl(rowData.isPlanified),
          nbseance: new FormControl(rowData.nbseance)
        });
      })
    } else {
      this.router.navigate(['/emergement/' + col.event.id])
    }

  }

  get isPresentielUpdated() { return this.seanceFormUpdate.get('isPresentiel'); }

  events: any[];

  ID = this.route.snapshot.paramMap.get('id');
  type = this.route.snapshot.paramMap.get('type');

  planOptions = [
    { label: "Planifié", value: true },
    { label: "Vérifié", value: false }
  ]

  salleNames = [
    { value: "Salle 1 RDC" },
    { value: "Salle 2 RDC" },
    { value: "Salle 1" },
    { value: "Salle 2" },
    { value: "Salle 3" },
    { value: "Salle 4" },
    { value: "Salle 5" }
  ]

  btnPlan = this.planOptions[1].value

  SeanceToUpdate: Seance;
  seanceFormUpdate: FormGroup;

  dropdownFormateur: any[] = [{ nom: '', value: '' }];
  dropdownMatiere: any[] = [{ nom: '', value: '' }];
  dropdownCampus: any[] = [{ libelle: 'Choissisez un campus', value: null }]
  dropdownClasse: any[] = [];
  dicCampus: any = {}

  constructor(public DiplomeService: DiplomeService, public seanceService: SeanceService, public matiereService: MatiereService, public classeService: ClasseService, private router: Router,
    public formateurService: FormateurService, public CampusService: CampusService, private route: ActivatedRoute, private EtudiantService: EtudiantService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.refreshEvent()
    //remplissage de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.matieres[item._id] = item;
          this.dropdownMatiere.push({ nom: item.nom, value: item._id });
        })
      }),
      ((error) => { console.error(error) })
    );

    this.classeService.getAll().subscribe(
      ((response) => {
        for (let classeID in response) {
          this.dropdownClasse.push({ nom: response[classeID].nom, value: response[classeID]._id });
          //this.dropdownClasse[response[classeID]._id] = response[classeID];
          this.classes[response[classeID]._id] = response[classeID];
        }
      }),
      ((error) => { console.error(error) })
    );

    this.CampusService.getAll().subscribe(
      data => {
        this.dropdownCampus = [{ libelle: 'Choissisez un campus', value: null }]
        this.dicCampus = []
        data.forEach(item => {
          this.dropdownCampus.push({ libelle: item.libelle, value: item._id });
          this.dicCampus[item._id] = item
        })
      }
    )
    //Remplissage de la liste des formateurs
    this.formateurService.getAllUser().subscribe(
      ((response) => {
        for (let formateurId in response) {
          this.dropdownFormateur.push({ nom: response[formateurId].firstname + ' ' + response[formateurId].lastname, value: response[formateurId]._id });
          this.formateurs[response[formateurId]._id] = response[formateurId];
        }
      }),
      ((error) => { console.error(error) })
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
      this.DiplomeService.getAll().subscribe(camp => {
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
  showPlanifiedSeance(value) {
    if (value) {
      this.seanceService.getPlanified().subscribe(
        (data) => {
          this.showEvents(data)
        },
      );
    } else {
      this.refreshEvent()
    }
  }

  refreshEvent() {
    if (this.type && this.type == "formateur" && this.ID) {
      this.seanceService.getAllbyFormateur(this.ID).subscribe(
        (datas) => {
          this.showEvents(datas)
        },
      );
    } else if (this.type && this.type == "classe" && this.ID) {
      this.seanceService.getAllByClasseId(this.ID).subscribe(
        (datas) => {
          this.showEvents(datas)
        },
      );
    }
    else {
      this.seanceService.getAll().subscribe(
        (data) => {
          this.showEvents(data)
        },
      );
    }
  }

  validPlanification() {
    if (confirm("Voulez-vous convertir TOUTES les séances planifié en séance validé ?")) {
      this.seanceService.convertAllPlanified().subscribe(data => {
        this.refreshEvent()
      }, error => {
        console.error(error)
      })
    }
  }

  modifySeance() {
    let seance: Seance

    let classeList = []
    this.seanceFormUpdate.value.classe.forEach(c => {
      classeList.push(c.value)
    })
    seance = new Seance(this.SeanceToUpdate._id, classeList, this.seanceFormUpdate.value.matiere.value, this.seanceFormUpdate.value.libelle, this.seanceFormUpdate.value.date_debut, this.seanceFormUpdate.value.date_fin, this.seanceFormUpdate.value.formateur.value, 'classe: ' + this.seanceFormUpdate.value.classe.nom + ' Formateur: ' + this.seanceFormUpdate.value.formateur.nom,
      this.seanceFormUpdate.value.isPresentiel, this.seanceFormUpdate.value.salle_name.value, this.seanceFormUpdate.value.isPlanified, this.seanceFormUpdate.value.campus_id.value);
    /*if (this.seanceFormUpdate.value.libelle == "" || this.seanceFormUpdate.value.libelle == null) {
      let classeStr = ""
      this.seanceFormUpdate.value.classe.forEach(c => {
        classeStr = classeStr + c.value.abbrv + ","
      })
      classeStr.slice(classeStr.lastIndexOf(','))
      this.seanceFormUpdate.value.libelle = classeStr + " - " + this.matieres[this.seanceFormUpdate.value.matiere.value].abbrv + " - " + this.seanceFormUpdate.value.formateur.nom + " (" + this.seanceFormUpdate.value.nbseance + "/" + this.matieres[this.seanceFormUpdate.value.matiere.value].seance_max + ")"
    }*/
    this.seanceService.update(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'Votre séance a bien été modifié!' });
      this.refreshEvent()
      this.SeanceToUpdate = null;
      if (!this.seanceFormUpdate.value.isPlanified && confirm("Voulez-vous avertir le formateur et le groupe de cette modification ?")) {
        this.formateurService.sendEDT(this.seanceFormUpdate.value.formateur.value, "/YES")
        this.EtudiantService.sendEDT(this.seanceFormUpdate.value.classe.value, "/YES")
      }
      this.seanceFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }



}
