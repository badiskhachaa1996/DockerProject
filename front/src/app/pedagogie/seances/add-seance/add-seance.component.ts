import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Seance } from 'src/app/models/Seance';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { ClasseService } from 'src/app/services/classe.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { Classe } from 'src/app/models/Classe';
import { Formateur } from 'src/app/models/Formateur';
import { Matiere } from 'src/app/models/Matiere';
import { Campus } from 'src/app/models/Campus';
import { Diplome } from 'src/app/models/Diplome';


@Component({
  selector: 'app-add-seance',
  templateUrl: './add-seance.component.html',
  styleUrls: ['./add-seance.component.scss']
})
export class AddSeanceComponent implements OnInit {
  formateurs: Formateur[] = [];
  classes: Classe[] = [];
  matieres: Matiere[] = [];
  campus = {}
  dicClasse = {}

  salleNames = [
  ]
  dropdownFormateur: any[] = [];
  dropdownMatiere: any[] = [];
  dropdownCampus: any[] = []
  dropdownClasse: any[] = [];

  seanceForm: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    matiere: new FormControl('', Validators.required),
    libelle: new FormControl(''),
    date_debut: new FormControl('', Validators.required),
    date_fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
    isPresentiel: new FormControl("Distanciel", Validators.required),
    salle_name: new FormControl(this.salleNames[0]),
    isPlanified: new FormControl(false),
    campus_id: new FormControl([], Validators.required),
    nbseance: new FormControl(""),
    isUnique: new FormControl(true, Validators.required),
    date_fin_plannification: new FormControl(''),
  });

  get isPresentiel() { return this.seanceForm.get('isPresentiel'); }

  type = this.route.snapshot.paramMap.get('type');

  seanceOptions = [
    { name: 'Répéter sur plusieurs jours', value: false },
    { name: 'Séance unique', value: true },
  ]

  listMatiere: Matiere[] = []

  diplomeDic = {}

  display: boolean;
  constructor(private EtudiantService: EtudiantService, private matiereService: MatiereService, private formateurService: FormateurService, private seanceService: SeanceService, private classeService: ClasseService, private messageService: MessageService, private router: Router, private route: ActivatedRoute,
    private AuthService: AuthService, private CampusService: CampusService, private DiplomeService: DiplomeService) { }

  ngOnInit(): void {
    this.matiereService.getAll().subscribe(
      ((response) => {
        this.listMatiere = response
        response.forEach(item => {
          this.dropdownMatiere.push({ nom: item.nom, value: item._id });
          this.matieres[item._id] = item;
        })
      }),
      ((error) => { console.error(error) })
    );

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
    this.CampusService.getAll().subscribe(
      data => {
        this.dropdownCampus = []
        data.forEach(item => {
          this.campus[item._id] = item
          this.dropdownCampus.push({ label: item.libelle, value: item._id });
        })
        this.seanceForm.patchValue({ campus_id: [this.dropdownCampus[0].value] })
      }
    )
    this.classeService.getAll().subscribe(
      ((response) => {
        this.classes = response;
        response.forEach(c => {
          this.dicClasse[c._id] = c
        })
        let diplomeDic = {}
        let campusDic = {}
        this.DiplomeService.getAll().subscribe(diplomes => {
          diplomes.forEach(diplome => {
            diplomeDic[diplome._id] = diplome
          })
          this.diplomeDic = diplomeDic
          this.CampusService.getAll().subscribe(campus => {
            campus.forEach(campus => {
              campusDic[campus._id] = campus
            })
            for (let classeID in response) {
              let label = response[classeID].abbrv;
              this.dropdownClasse.push({ nom: label, value: response[classeID]._id, diplome_id: response[classeID]?.diplome_id });
              this.dropdownClasse[response[classeID]._id] = response[classeID];
            }
          })
        })

      }),
      ((error) => { console.error(error) })
    );
  }

  showSalles(value, def = false) {
    this.salleNames = []
    console.log(value)
    this.campus[value].salles.forEach(s => {
      console.log(s)
      this.salleNames.push({ value: s, label: s })
    })
    if (this.salleNames.length != 0)
      this.seanceForm.patchValue({ salle_name: this.salleNames[0].value })
    else if (this.isPresentiel.value != "Distanciel" && !def)
      this.messageService.add({ severity: "error", summary: "Choix des salles", detail: "Ces campus ne contiennent aucune salle." })

  }

  saveSeance() {
    //TODO get nbSeance

    let classeStr = this.dicClasse[this.seanceForm.value.classe[0].value].abbrv
    this.seanceForm.value.classe.forEach((c, index) => {
      if (index != 0)
        classeStr = classeStr + "," + this.dicClasse[c.value].abbrv
    })
    classeStr.slice(classeStr.lastIndexOf(',') - 1)

    let classeList = []
    this.seanceForm.value.classe.forEach(c => {
      classeList.push(c.value)
    })
    let seance = new Seance(null, classeList, this.seanceForm.value.matiere.value, this.seanceForm.value.libelle, this.seanceForm.value.date_debut, this.seanceForm.value.date_fin, this.seanceForm.value.formateur.value, 'classe: ' + this.seanceForm.value.classe[0].value + ' Formateur: ' + this.seanceForm.value.formateur.nom,
      this.seanceForm.value.isPresentiel, this.seanceForm.value.salle_name, this.seanceForm.value.isPlanified.value, this.seanceForm.value.campus_id, this.seanceForm.value.nbseance, null, this.seanceForm.value.libelle);
    seance.libelle = classeStr + " - " + this.matieres[this.seanceForm.value.matiere.value].abbrv + " - " + this.seanceForm.value.formateur.nom + " (" + this.seanceForm.value.nbseance + "/" + this.matieres[this.seanceForm.value.matiere.value].seance_max + ")" + this.seanceForm.value.libelle
    let calc = new Date(this.seanceForm.value.date_fin).getHours() - new Date(this.seanceForm.value.debut).getHours()
    let choice = true
    this.formateurService.getByUserId(this.seanceForm.value.formateur.value).subscribe(data => {
      /*if (!data.hasOwnProperty("volume_h") || data.volume_h == null || data.volume_h[this.seanceForm.value.matiere.value] == undefined || data.volume_h[this.seanceForm.value.matiere.value] != Number) {
        choice = confirm("Le formateur n'a pas de volume horaire pour ce module\nVoulez-vous quand même créer cette séance ?")
      } else {
        if (data.hasOwnProperty("volume_h_consomme") && data.volume_h_consomme[this.seanceForm.value.matiere.value] == Number && data.volume_h_consomme[this.seanceForm.value.matiere.value] + calc > data.volume_h[this.seanceForm.value.matiere.value]) {
          choice = confirm("Le volume horaire de ce formateur sera dépassé pour ce module.\nVoulez-vous quand même créer cette séance ?")
        }
      }*/
      if (choice && data.type_contrat == "Prestation et Vacation") {
        let date_debut = this.getScoreDate(new Date(this.seanceForm.value.date_debut))
        let date_fin = this.getScoreDate(new Date(this.seanceForm.value.date_fin))
        let score_debut = 0
        let score_fin = 10000
        //TODO if day_debut!=day_fin
        let available = true
        let rmq = ""
        let day = new Date(this.seanceForm.value.date_debut).getDay()
        if (day == 1 && data.monday_available && data.monday_available.state && data.monday_available.h_debut && data.monday_available.h_fin) {
          //Monday
          score_debut = this.getScoreString(data.monday_available.h_debut)
          score_fin = this.getScoreString(data.monday_available.h_fin)
          rmq = data.monday_available.remarque
        } else if (day == 2 && data.tuesday_available && data.tuesday_available.state && data.tuesday_available.h_debut && data.tuesday_available.h_fin) {
          //Tuesday
          score_debut = this.getScoreString(data.tuesday_available.h_debut)
          score_fin = this.getScoreString(data.tuesday_available.h_fin)
          rmq = data.tuesday_available.remarque
        } else if (day == 3 && data.wednesday_available && data.wednesday_available.state && data.wednesday_available.h_debut && data.wednesday_available.h_fin) {
          //Wednesday
          score_debut = this.getScoreString(data.wednesday_available.h_debut)
          score_fin = this.getScoreString(data.wednesday_available.h_fin)
          rmq = data.wednesday_available.remarque
        } else if (day == 4 && data.thursday_available && data.thursday_available.state && data.thursday_available.h_debut && data.thursday_available.h_fin) {
          //Thursday
          score_debut = this.getScoreString(data.thursday_available.h_debut)
          score_fin = this.getScoreString(data.thursday_available.h_fin)
          rmq = data.thursday_available.remarque
        } else if (day == 5 && data.friday_available && data.friday_available.state && data.friday_available.h_debut && data.friday_available.h_fin) {
          //Friday
          score_debut = this.getScoreString(data.friday_available.h_debut)
          score_fin = this.getScoreString(data.friday_available.h_fin)
          rmq = data.friday_available.remarque
        } else {
          available = false
        }
        if (!(score_debut < date_debut) || !(date_fin < score_fin)) {
          available = false
        }
        if (available) {
          let dd = new Date(this.seanceForm.value.date_debut)
          console.log(data.absences)
          if (data.absences && data.absences.length > 0)
            data.absences.forEach(d => {
              if (d)
                available = !(d.getDate() == dd.getDate() && d.getMonth() == dd.getMonth() && d.getFullYear() == dd.getFullYear())
            })
        }
        if (!available) {
          let txt = ""
          if (rmq != "") {
            txt = "\nRemarque: " + rmq
          }
          choice = confirm("Le formateur n'est pas disponible pour toute la séance à cause de ses jours de disponibilité\nVoulez-vous quand même créer cette séance ?" + txt)
        }
      } else if (choice) {
        if (this.matieres[seance.matiere_id].seance_max < seance.nbseance) {
          choice = confirm("Le nombre de séance prévu pour ce module va être depassé\nVoulez-vous quand même créer cette séance ?")
        }
      }
      if (choice) {
        console.log(seance)
        this.seanceService.create(seance).subscribe((data) => {
          console.log(data)
          this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'La séance a bien été ajouté!' });
        }, (error) => {
          console.error(error)
          let serror: Seance = error.error.seance
          console.error(error.error.temp, seance)
          this.messageService.add({ severity: 'error', summary: "La séance " + serror + " rentre en conflit", detail: error.error.text })
          let classeStr = ""
          serror.classe_id.forEach(c => {
            classeStr = classeStr + this.classes[c].abbrv + ","
          })
          this.messageService.add({
            severity: 'error', summary: "Informations de :" + error.seance, detail:
              "Debut: " + this.convertDate(new Date(serror.date_debut)) +
              "\nFin: " + this.convertDate(new Date(serror.date_fin)) +
              "\nFormateur: " + this.formateurs[serror.formateur_id].firstname + " " + this.formateurs[serror.formateur_id].lastname +
              "\nModule: " + this.matieres[serror.matiere_id].nom +
              "\nClasse: " + classeStr
          })

        });
      }
    })


    //Partie qui s'execute si la séance se répète sur plusieurs jours
    if (!this.seanceForm.get('isUnique').value) {
      let numeroSeance = this.seanceForm.get('nbseance').value;
      let date_debut = this.seanceForm.get('date_debut').value;
      let date_de_debut = new Date(date_debut);
      let date_fin = new Date(this.seanceForm.get('date_fin').value);
      let dateDebut = new Date(date_debut.substr(0, 10));
      let dateFinPlan = new Date(this.seanceForm.get('date_fin_plannification').value);
      dateFinPlan.setDate(dateFinPlan.getDate() + 1);

      let newNumeroSeance = numeroSeance;
      let i = 0;

      while (date_de_debut <= dateFinPlan) {
        i += 7;

        date_de_debut.setDate(date_de_debut.getDate() + i);

        let newDateDebut = new Date(date_debut);
        newDateDebut.setDate(newDateDebut.getDate() + i);

        let newDateFin = new Date(date_debut);
        newDateFin.setDate(newDateFin.getDate() + i);

        newDateFin.setHours(date_fin.getHours());
        newDateFin.setMinutes(date_fin.getMinutes());
        newDateFin.setSeconds(date_fin.getSeconds());

        console.log(' ---------- ' + date_de_debut + ' ---------- ');


        newNumeroSeance += 1;

        //TODO get nbSeance
        let classeStr = this.dicClasse[this.seanceForm.value.classe[0].value].abbrv
        this.seanceForm.value.classe.forEach((c, index) => {
          if (index != 0)
            classeStr = classeStr + "," + this.dicClasse[c.value].abbrv
        })
        classeStr.slice(classeStr.lastIndexOf(',') - 1)

        let classeList = []
        this.seanceForm.value.classe.forEach(c => {
          classeList.push(c.value)
        })
        let seance = new Seance(null, classeList, this.seanceForm.value.matiere.value, this.seanceForm.value.libelle, newDateDebut, newDateFin, this.seanceForm.value.formateur.value, 'classe: ' + this.seanceForm.value.classe[0].value + ' Formateur: ' + this.seanceForm.value.formateur.nom,
          this.seanceForm.value.isPresentiel, this.seanceForm.value.salle_name, this.seanceForm.value.isPlanified.value, this.seanceForm.value.campus_id, newNumeroSeance, null, this.seanceForm.value.libelle);
        console.log(seance)
        seance.libelle = classeStr + " - " + this.matieres[this.seanceForm.value.matiere.value].abbrv + " - " + this.seanceForm.value.formateur.nom + " (" + newNumeroSeance + "/" + this.matieres[this.seanceForm.value.matiere.value].seance_max + ")" + this.seanceForm.value.libelle
        let calc = newDateFin.getHours() - newDateDebut.getHours()
        let choice = true
        this.formateurService.getByUserId(this.seanceForm.value.formateur.value).subscribe(data => {
          /*if (!data.hasOwnProperty("volume_h") || data.volume_h == null || data.volume_h[this.seanceForm.value.matiere.value] == undefined || data.volume_h[this.seanceForm.value.matiere.value] != Number) {
            choice = confirm("Le formateur n'a pas de volume horaire pour ce module\nVoulez-vous quand même créer cette séance ?")
          } else {
            if (data.hasOwnProperty("volume_h_consomme") && data.volume_h_consomme[this.seanceForm.value.matiere.value] == Number && data.volume_h_consomme[this.seanceForm.value.matiere.value] + calc > data.volume_h[this.seanceForm.value.matiere.value]) {
              choice = confirm("Le volume horaire de ce formateur sera dépassé pour ce module.\nVoulez-vous quand même créer cette séance ?")
            }
          }*/
          if (choice && data.type_contrat == "Prestation et Vacation") {
            let date_debut = this.getScoreDate(newDateDebut)
            let date_fin = this.getScoreDate(newDateFin)
            let score_debut = 0
            let score_fin = 10000
            //TODO if day_debut!=day_fin
            let available = true
            let rmq = ""
            let day = newDateDebut.getDay()
            if (day == 1 && data.monday_available && data.monday_available.state && data.monday_available.h_debut && data.monday_available.h_fin) {
              //Monday
              score_debut = this.getScoreString(data.monday_available.h_debut)
              score_fin = this.getScoreString(data.monday_available.h_fin)
              rmq = data.monday_available.remarque
            } else if (day == 2 && data.tuesday_available && data.tuesday_available.state && data.tuesday_available.h_debut && data.tuesday_available.h_fin) {
              //Tuesday
              score_debut = this.getScoreString(data.tuesday_available.h_debut)
              score_fin = this.getScoreString(data.tuesday_available.h_fin)
              rmq = data.tuesday_available.remarque
            } else if (day == 3 && data.wednesday_available && data.wednesday_available.state && data.wednesday_available.h_debut && data.wednesday_available.h_fin) {
              //Wednesday
              score_debut = this.getScoreString(data.wednesday_available.h_debut)
              score_fin = this.getScoreString(data.wednesday_available.h_fin)
              rmq = data.wednesday_available.remarque
            } else if (day == 4 && data.thursday_available && data.thursday_available.state && data.thursday_available.h_debut && data.thursday_available.h_fin) {
              //Thursday
              score_debut = this.getScoreString(data.thursday_available.h_debut)
              score_fin = this.getScoreString(data.thursday_available.h_fin)
              rmq = data.thursday_available.remarque
            } else if (day == 5 && data.friday_available && data.friday_available.state && data.friday_available.h_debut && data.friday_available.h_fin) {
              //Friday
              score_debut = this.getScoreString(data.friday_available.h_debut)
              score_fin = this.getScoreString(data.friday_available.h_fin)
              rmq = data.friday_available.remarque
            } else {
              available = false
            }
            if (!(score_debut < date_debut) || !(date_fin < score_fin)) {
              available = false
            }
            if (available) {
              let dd = newDateDebut
              data.absences.forEach(d => {
                available = !(d.getDate() == dd.getDate() && d.getMonth() == dd.getMonth() && d.getFullYear() == dd.getFullYear())
              })
            }
            if (!available) {
              let txt = ""
              if (rmq != "") {
                txt = "\nRemarque: " + rmq
              }
              choice = confirm("Le formateur n'est pas disponible pour toute la séance à cause de ses jours de disponibilité\nVoulez-vous quand même créer cette séance ?" + txt)
            }
          } else if (choice) {
            if (this.matieres[seance.matiere_id].seance_max < seance.nbseance) {
              choice = confirm("Le nombre de séance prévu pour ce module va être depassé\nVoulez-vous quand même créer cette séance ?")
            }
          }
          if (choice)
            console.log(seance)
          this.seanceService.create(seance).subscribe((data) => {
            console.log(data)
            this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'La séance a bien été ajouté!' });
          }, (error) => {
            console.error(error)
            let serror: Seance = error.error.seance
            this.messageService.add({ severity: 'error', summary: "La séance " + serror + " rentre en conflit", detail: error.error.text })
            let classeStr = ""
            serror.classe_id.forEach(c => {
              classeStr = classeStr + this.classes[c].abbrv + ","
            })
            this.messageService.add({
              severity: 'error', summary: "Informations de :" + error.seance, detail:
                "Debut: " + this.convertDate(new Date(serror.date_debut)) +
                "\nFin: " + this.convertDate(new Date(serror.date_fin)) +
                "\nFormateur: " + this.formateurs[serror.formateur_id].firstname + " " + this.formateurs[serror.formateur_id].lastname +
                "\nModule: " + this.matieres[serror.matiere_id].nom +
                "\nClasse: " + classeStr
            })

          });
        })


      }
    }


  }

  //Focntion qui calcul le nombre de jour entre 2dates
  getDaysBetweenTwoDates(date1, date2) {
    let t = date2.getTime() - date1.getTime();
    let days = t / (1000 * 3600 * 24);

    return (days);
  }

  getScoreString(s: String) {
    let h = parseInt(s.substring(0, s.indexOf(":")))
    let m = parseInt(s.substring(s.indexOf(":") + 1))
    return h * 60 + m
  }

  getScoreDate(d: Date) {
    return d.getHours() * 60 + d.getMinutes()
  }

  convertDate(date: Date) {
    let days = date.getDate()
    let month = date.getMonth() + 1
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let str = days + "/" + month + " " + hours + ":" + minutes
    return str
  }

  changeGroupe(event) {
    let listIDs = []
    this.dropdownCampus = []
    event.forEach(d => {
      listIDs.push(d.diplome_id)
      let groupe: Classe = this.dicClasse[d.value]
      let diplome: Diplome = this.diplomeDic[groupe.diplome_id]
      if (groupe) {
        diplome.campus_id.forEach(cid => {
          let campus: Campus = this.campus[cid]
          let r = false
          let l = { label: campus.libelle, value: campus._id }
          this.dropdownCampus.forEach(e => {
            if (e.value == l.value) {
              r = true
            }
          })
          if (!r)
            this.dropdownCampus.push(l)
        })
      }

    })
    this.dropdownMatiere = []
    this.listMatiere.forEach(m => {
      if (this.customIncludes(m.formation_id, listIDs) == true) {
        if (Array.isArray(m.formation_id)) {
          let str = m.nom + " - "
          m.formation_id.forEach((formation, index) => {
            if (index != 0)
              str = str + ", "+ this.diplomeDic[formation].titre
            else
              str = str + this.diplomeDic[formation].titre
          })
          this.dropdownMatiere.push({ nom: str, value: m._id });
        }
        else {
          let str: any = m.formation_id
          this.dropdownMatiere.push({ nom: m.nom + " - " + this.diplomeDic[str].titre, value: m._id });
        }

      }

    })

    this.seanceForm.patchValue({ campus_id: this.dropdownCampus[0].value })
    this.showSalles(this.dropdownCampus[0].value, true)
  }

  customIncludes(l: any, d: any[]) {
    let r = false
    if (Array.isArray(l)) {
      d.forEach(e => {
        if (this.customIncludes(e, l) == true) {
          r = true
        }
      })
    } else {
      d.forEach(e => {
        if (e == l) {
          r = true
        }
      })
    }
    return r

  }


}
