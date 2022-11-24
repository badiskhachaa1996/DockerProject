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

  //Variables de filtre
  diplomeFilter: [{ label: string, value: string }];
  groupeFilter: [{ label: string, value: string }];

  //variables du calendrier
  @ViewChild('calendar') private calendar: FullCalendar;
  mobilecheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  };
  //Options du calendrier
  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: this.mobilecheck() ? '':'prev,next',
      center: 'title',
      right: this.mobilecheck() ? '':'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    footer: {
      left: 'prev,next',
      right: this.mobilecheck() ? 'today,timeGridWeek,timeGridDay':'today,dayGridMonth,timeGridWeek,timeGridDay'
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
    defaultView: this.mobilecheck() ? "timeGridDay" : "timeGridWeek",
    events: [],
    minTime:'08:00:00',
    firstDay:1

  }

  eventClickFC(col) {
    if (this.type == null) {
      this.seanceService.getById(col.event.id).subscribe(rowData => {
        let classeList = [];
        rowData.classe_id.forEach(classeID => {
          classeList.push({ nom: this.classes[classeID]?.nom, value: this.classes[classeID]?._id });
        });
        this.seanceFormUpdate = new FormGroup({
          classe: new FormControl(classeList),
          matiere: new FormControl({ nom: this.matieres[rowData.matiere_id].nom, value: rowData.matiere_id }, Validators.required),
          libelle: new FormControl(rowData.libelle),
          date_debut: new FormControl(new Date(rowData.date_debut).toISOString().slice(0, 16), Validators.required),
          date_fin: new FormControl(new Date(rowData.date_fin).toISOString().slice(0, 16), Validators.required),
          formateur: new FormControl({ nom: this.formateurs[rowData.formateur_id].firstname + " " + this.formateurs[rowData.formateur_id].lastname, value: rowData.formateur_id }, Validators.required),
          isPresentiel: new FormControl(rowData.isPresentiel),
          salle_name: new FormControl({ value: rowData.salle_name }),
          campus_id: new FormControl({ libelle: this.dicCampus[rowData.campus_id]?.nom, value: this.dicCampus[rowData.campus_id]?._id }),
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
          this.dropdownClasse.push({ nom: response[classeID].abbrv, value: response[classeID]._id });
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

  customIncludes(l: [{ label: string, value: string }], d: { label: string, value: string }) {
    let r = false
    l.forEach(e => {
      if (e.label == d.label && e.value == d.value) {
        r = true
      }
    })
    return r
  }

  filiereFilter(value) {
    //set groupeFilter
    //getAllByFiliereID()
    //this.seanceService.getAllByClasseId()
    if (value)
      this.seanceService.getAllByDiplomeID(value).subscribe(data => {
        this.showEvents(data, false)
      })
    else
      this.showPlanifiedSeance(this.btnPlan)

  }

  classeFilter(value) {
    if (value)
      this.seanceService.getAllByClasseId(value).subscribe(data => {
        this.showEvents(data, false)
      })
    else
      this.showPlanifiedSeance(this.btnPlan)
  }

  showEvents(data, refreshFilter = true) {
    this.seances = []
    let seancesCal = [];
    let classeID = [{}];
    let index = 0
    let diplomeList = {}
    if (refreshFilter) {
      this.diplomeFilter = [{ label: "Toutes les filières", value: null }]
      this.groupeFilter = [{ label: "Tout les groupes", value: null }]
    }


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
            if (refreshFilter) {
              let v = { label: d.diplome_titre, value: dicClasse[d.classe_id[0]].diplome_id }
              if (this.customIncludes(this.diplomeFilter, v) == false) {
                this.diplomeFilter.push(v)
              }
              let v2 = { label: d.classe_abbrv, value: d.classe_id[0] }
              if (this.customIncludes(this.groupeFilter, v2) == false) {
                this.groupeFilter.push(v2)
              }
            }

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
      console.log(this.ID)
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
      if (!this.seanceFormUpdate.value.isPlanified && confirm("Voulez-vous avertir le formateur de cette modification ?")) {
        this.formateurService.sendEDT(this.seanceFormUpdate.value.formateur.value, "/YES").subscribe(data => {
          this.messageService.add({ severity: "success", summary: "Envoi du mail avec succès", detail: "Nous vous conseillons d'envoyer un mail au groupe via la liste des groupes pour les notifier du changement" })
        }, err => {
          console.error(err)
          this.messageService.add({ severity: "error", summary: "Le mail ne s'est pas envoyé", detail: err.error })
        })
        //this.EtudiantService.sendEDT(this.seanceFormUpdate.value.classe.value, "/YES")

      }
      this.seanceFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }



}
