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
          this.dropdownClasse.push({ nom: response[classeID].nom, value: response[classeID]._id });
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

        }
      }),
      ((error) => { console.error(error) })
    );
  }

  loadEvents(data) {
    this.seances = []
    this.diplomeFilter = [{ label: "Toutes les filières", value: null }]
    this.groupeFilter = [{ label: "Tout les groupes", value: null }]
    let diplomeList = {}
    this.classeService.getAll().subscribe(datac => {
      //TODO Filter all the classe and not the first one
      datac.forEach(classe => {
        diplomeList[classe._id] = classe.diplome_id
        this.dicClasse[classe._id] = classe
      })
      this.DiplomeService.getAll().subscribe(camp => {
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
    let c = []
    rowData.campus_id.forEach(cid => {
      c.push({ libelle: this.dicCampus[cid]?.libelle, value: this.dicCampus[cid]?._id })
    })
    this.salleNames = []
    rowData.campus_id.forEach(cid => {
      this.dicCampus[cid].salles.forEach(s => {
        this.salleNames.push({ value: s, label: s })
      })
    })
    this.seanceFormUpdate = new FormGroup({
      classe: new FormControl(classeList),
      matiere: new FormControl({ nom: this.matieres[rowData.matiere_id].nom, value: rowData.matiere_id }, Validators.required),
      libelle: new FormControl(rowData.libelle),
      date_debut: new FormControl(new Date(rowData.date_debut).toISOString().slice(0, 16), Validators.required),
      date_fin: new FormControl(new Date(rowData.date_fin).toISOString().slice(0, 16), Validators.required),
      formateur: new FormControl({ nom: this.formateurs[rowData.formateur_id].firstname + " " + this.formateurs[rowData.formateur_id].lastname, value: rowData.formateur_id }, Validators.required),
      isPresentiel: new FormControl(rowData.isPresentiel),
      salle_name: new FormControl({ value: rowData.salle_name, label: rowData.salle_name }),
      campus_id: new FormControl(c),
      isPlanified: new FormControl(rowData.isPlanified),
      nbseance: new FormControl(rowData.nbseance)
    });
  }

  get isPresentielUpdated() { return this.seanceFormUpdate.get('isPresentiel'); }

  showSalles(value) {
    this.salleNames = []
    value.forEach(cid => {
      this.dicCampus[cid].salles.forEach(s => {
        this.salleNames.push({ value: s, label: s })
      })
    })
    this.seanceFormUpdate.patchValue({ salle_name: this.salleNames[0].value })
  }

  modifySeance() {
    let seance: Seance

    let classeList = []
    let campusList = []
    this.seanceFormUpdate.value.classe.forEach(c => {
      classeList.push(c.value)
    })
    this.seanceFormUpdate.value.campus_id.forEach(c => {
      campusList.push(c.value)
    })
    seance = new Seance(this.showFormUpdateSeance._id, classeList, this.seanceFormUpdate.value.matiere.value, this.seanceFormUpdate.value.libelle, this.seanceFormUpdate.value.date_debut, this.seanceFormUpdate.value.date_fin, this.seanceFormUpdate.value.formateur.value, 'classe: ' + this.seanceFormUpdate.value.classe.nom + ' Formateur: ' + this.seanceFormUpdate.value.formateur.nom,
      this.seanceFormUpdate.value.isPresentiel, this.seanceFormUpdate.value.salle_name.value, this.seanceFormUpdate.value.isPlanified, campusList);
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
        this.formateurService.sendEDT(this.seanceFormUpdate.value.formateur.value, "/YES")
        this.EtudiantService.sendEDT(this.seanceFormUpdate.value.classe.value, "/YES")
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

}
