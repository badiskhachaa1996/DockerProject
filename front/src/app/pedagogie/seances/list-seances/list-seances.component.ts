import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Classe } from 'src/app/models/Classe';
import { Formateur } from 'src/app/models/Formateur';
import { Matiere } from 'src/app/models/Matiere';
import { Seance } from 'src/app/models/Seance';
import { CampusService } from 'src/app/services/campus.service';
import { ClasseService } from 'src/app/services/classe.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { Campus } from 'src/app/models/Campus';

@Component({
  selector: 'app-list-seances',
  templateUrl: './list-seances.component.html',
  styleUrls: ['./list-seances.component.scss']
})
export class ListSeancesComponent implements OnInit {
  seances: Seance[] = [];
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  formateurs = [];
  user: User[] = []

  //Variable d'affichage par rapport à la provenance des séances
  titre: String = "";

  //Variables de filtre
  diplomeFilter: [{ label: string, value: string }];
  groupeFilter: [{ label: string, value: string }];

  dicCampus: any = {}
  dicDiplome: any = {}
  dicClasse: any = {}

  seanceFormUpdate: FormGroup;
  showFormUpdateSeance: Seance;

  salleNames = [
  ]
  dropdownFormateur: any[] = [];
  dropdownMatiere: any[] = [];
  dropdownCampus: any[] = []
  dropdownClasse: any[] = [];
  constructor(public DiplomeService: DiplomeService, public seanceService: SeanceService, public matiereService: MatiereService, public classeService: ClasseService,
    public formateurService: FormateurService, public CampusService: CampusService, private messageService: MessageService, private EtudiantService: EtudiantService) { }

  ngOnInit(): void {

    this.seanceService.getAll().subscribe(
      (datas) => {
        this.loadEvents(datas)
      },
    );

    this.CampusService.getAll().subscribe(
      data => {
        this.dropdownCampus = []
        this.dicCampus = []
        data.forEach(item => {
          this.dropdownCampus.push({ libelle: item.libelle, value: item._id });
          this.dicCampus[item._id] = item
        })
      }
    )

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

    //Remplissage de la liste des formateurs
    this.formateurService.getAllUser().subscribe(
      ((response) => {
        for (let formateurId in response) {
          this.dropdownFormateur.push({ nom: response[formateurId].firstname + ' ' + response[formateurId].lastname, value: response[formateurId]._id });
          this.formateurs[formateurId] = response[formateurId]
          this.formateurs[response[formateurId]._id] = response[formateurId]

        }
      }),
      ((error) => { console.error(error) })
    );
  }

  loadEvents(data) {
    let diplomeList = {}
    this.classeService.getAll().subscribe(datac => {
      //TODO Filter all the classe and not the first one
      datac.forEach(classe => {
        diplomeList[classe._id] = classe.diplome_id
        this.dicClasse[classe._id] = classe
      })
      this.DiplomeService.getAll().subscribe(camp => {
        this.seances = []
        this.diplomeFilter = [{ label: "Toutes les filières", value: null }]
        this.groupeFilter = [{ label: "Tout les groupes", value: null }]
        camp.forEach(ca => {
          this.dicDiplome[ca._id] = ca
        })
        data.forEach(d => {
          if (this.dicDiplome[this.dicClasse[d.classe_id[0]]?.diplome_id] && this.dicClasse[d.classe_id[0]]) {
            d.diplome_titre = this.dicDiplome[this.dicClasse[d.classe_id[0]].diplome_id].titre
            d.classe_abbrv = this.dicClasse[d.classe_id[0]].abbrv
            let v = { label: d.diplome_titre, value: d.diplome_titre }
            if (this.customIncludes(this.diplomeFilter, v) == false) {
              this.diplomeFilter.push(v)
            }
            let v2 = { label: d.classe_abbrv, value: d.classe_abbrv }
            if (this.customIncludes(this.groupeFilter, v2) == false) {
              this.groupeFilter.push(v2)
            }
            this.seances.push(d)
          }
        })
      })
    })
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

  validPlanification() {
    if (confirm("Voulez-vous convertir TOUTES les séances planifié en séance validé ?")) {
      this.seanceService.convertAllPlanified().subscribe(data => {
        this.seanceService.getAll().subscribe(
          (datas) => {
            this.loadEvents(datas)
          },
        );
      }, error => {
        console.error(error)
      })
    }
  }

  toSign(row) {
    window.open(environment.origin.replace("3000", "4200").replace("soc/", "#/emergement/" + row._id))
  }

  showModify(rowData: Seance) {
    this.showFormUpdateSeance = rowData;

    let classeList = [];
    rowData.classe_id.forEach(classeID => {
      classeList.push({ nom: this.classes[classeID]?.nom, value: this.classes[classeID]?._id });
    });
    this.salleNames = []
    this.dicCampus[rowData.campus_id].salles.forEach(s => {
      this.salleNames.push({ value: s, label: s })
    })
    this.seanceFormUpdate = new FormGroup({
      classe: new FormControl(classeList),
      matiere: new FormControl({ nom: this.matieres[rowData.matiere_id].nom, value: rowData.matiere_id }, Validators.required),
      libelle: new FormControl(rowData.libelle),
      date_debut: new FormControl(new Date(rowData.date_debut).toISOString().slice(0, 16), Validators.required),
      date_fin: new FormControl(new Date(rowData.date_fin).toISOString().slice(0, 16), Validators.required),
      formateur: new FormControl("", Validators.required),
      isPresentiel: new FormControl(rowData.isPresentiel),
      salle_name: new FormControl({ value: rowData.salle_name, label: rowData.salle_name }),
      campus_id: new FormControl({ libelle: this.dicCampus[rowData.campus_id]?.libelle, value: this.dicCampus[rowData.campus_id]?._id }),
      isPlanified: new FormControl(rowData.isPlanified),
      nbseance: new FormControl(rowData.nbseance)
    });
    //{ nom: this.formateurs[rowData.formateur_id].firstname + " " + this.formateurs[rowData.formateur_id].lastname, value: rowData.formateur_id }
    if (rowData.formateur_id && this.formateurs[rowData.formateur_id] && this.formateurs[rowData.formateur_id].firstname)
      this.seanceFormUpdate.patchValue({ formateur: { nom: this.formateurs[rowData.formateur_id].firstname + " " + this.formateurs[rowData.formateur_id].lastname, value: rowData.formateur_id } })
  }

  get isPresentielUpdated() { return this.seanceFormUpdate.get('isPresentiel'); }

  showSalles(value) {
    this.salleNames = []
    value.forEach(cid => {
      this.dicCampus[cid].salles.forEach(s => {
        this.salleNames.push({ value: s, label: s })
      })
    })
    if (this.salleNames.length < 1)
      this.messageService.add({ severity: "error", summary: "Problème de chargement des salles", detail: "Le campus que vous avez selectionné n'a pas de salle parametré, ce qui empeche le choix d'une salle si la séance est Présentiel." })
    else
      this.seanceFormUpdate.patchValue({ salle_name: this.salleNames[0].value })
  }

  showCampus(value) {
    this.dropdownCampus = []
    console.log(value)
    value.forEach(cid => {
      let groupe: Classe = this.classes[cid.value]
      let diplome = this.dicDiplome[groupe.diplome_id]
      if (groupe) {
        diplome.campus_id.forEach(cid => {
          let campus: Campus = this.dicCampus[cid]
          let r = false
          let l = { libelle: campus.libelle, value: campus._id }
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
    this.seanceFormUpdate.patchValue({ campus_id: this.dropdownCampus[0].value })
  }

  modifySeance() {
    let classeList = []
    this.seanceFormUpdate.value.classe.forEach(c => {
      classeList.push(c.value)
    })
    let seance = new Seance(this.showFormUpdateSeance._id, classeList, this.seanceFormUpdate.value.matiere.value, this.seanceFormUpdate.value.libelle, this.seanceFormUpdate.value.date_debut, this.seanceFormUpdate.value.date_fin, this.seanceFormUpdate.value.formateur.value, 'classe: ' + this.seanceFormUpdate.value.classe.nom + ' Formateur: ' + this.seanceFormUpdate.value.formateur.nom,
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
      this.seanceService.getAll().subscribe(
        (datas) => {
          this.loadEvents(datas)
        },
      );
      this.showFormUpdateSeance = null;
      if (!this.seanceFormUpdate.value.isPlanified && confirm("Voulez-vous avertir le formateur et le groupe de cette modification ?")) {
        this.formateurService.sendEDT(this.seanceFormUpdate.value.formateur.value, "/YES").subscribe(data => {
          this.messageService.add({ severity: "success", summary: "Envoi du mail avec succès", detail: "Nous vous conseillons d'envoyer un mail au groupe via la liste des groupes pour les notifier du changement" })
        }, err => {
          console.error(err)
          this.messageService.add({ severity: "error", summary: "Le mail ne s'est pas envoyé", detail: err.error })
        })
      }
      this.seanceFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }

  /*date_filter_debut: Date = null;
  date_filter_fin: Date = null;*/

  calendar_value: Date[] = null

  filterRange(value) {
    /*if (this.date_filter_debut && !this.date_filter_fin && value > this.date_filter_debut) {
      this.date_filter_fin = value
    }
    else {
      this.date_filter_debut = value
      this.date_filter_fin = null
    }
    if (this.date_filter_debut && this.date_filter_fin) {
      this.seanceService.getAllByRange(this.date_filter_debut, this.date_filter_fin).subscribe(
        (datas) => {
          this.loadEvents(datas)
        },
      );
    }*/
    if (this.calendar_value[0] && this.calendar_value[1])
      this.seanceService.getAllByRange(this.calendar_value[0], this.calendar_value[1]).subscribe(
        (datas) => {
          this.loadEvents(datas)
        },
      );
  }
  clearFilter() {
    /*this.date_filter_debut = null
    this.date_filter_fin = null*/
    this.calendar_value = null
    this.seanceService.getAll().subscribe(
      (datas) => {
        this.loadEvents(datas)
      },
    );
  }

  delete(rowData: Seance) {
    if (confirm("Voulez vous supprimez la séance " + rowData.libelle + " ?"))
      this.seanceService.delete(rowData._id).subscribe(data => {
        this.messageService.add({ severity: "success", summary: "Suppression avec succès" })
        this.seances.forEach((val, index) => {
          if (val._id == rowData._id) {
            this.seances.splice(index, 1)
          }
        })
      }, error => {
        console.error(error)
      })
  }

  updateGroupeFilter(value) {
    if (value)
      this.classeService.getAllByDiplomeABBRV(value).subscribe(classes => {
        this.groupeFilter = [{ label: "Tout les groupes", value: null }]
        classes.forEach(c => {
          let v2 = { label: c.abbrv, value: c.abbrv }
          if (this.customIncludes(this.groupeFilter, v2) == false) {
            this.groupeFilter.push(v2)
          }
        })
      })
    else
      this.seanceService.getAll().subscribe(
        (datas) => {
          this.loadEvents(datas)
        },
      );
  }

}
