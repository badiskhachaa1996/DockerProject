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


@Component({
  selector: 'app-add-seance',
  templateUrl: './add-seance.component.html',
  styleUrls: ['./add-seance.component.scss']
})
export class AddSeanceComponent implements OnInit {
  formateurs: Formateur[] = [];
  classes: Classe[] = [];
  matieres: Matiere[] = [];

  salleNames = [
    { value: "Salle 1 RDC" },
    { value: "Salle 2 RDC" },
    { value: "Salle 1" },
    { value: "Salle 2" },
    { value: "Salle 3" },
    { value: "Salle 4" },
    { value: "Salle 5" }
  ]
  dropdownFormateur: any[] = [{ nom: '', value: '' }];
  dropdownMatiere: any[] = [{ nom: '', value: '' }];
  dropdownCampus: any[] = [{ libelle: 'Choissisez un campus', value: null }]
  dropdownClasse: any[] = [];

  seanceForm: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    matiere: new FormControl('', Validators.required),
    libelle: new FormControl(''),
    date_debut: new FormControl('', Validators.required),
    date_fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
    isPresentiel: new FormControl(false, Validators.required),
    salle_name: new FormControl(this.salleNames[0]),
    isPlanified: new FormControl(false),
    campus_id: new FormControl(this.dropdownCampus[0], Validators.required),
    nbseance: new FormControl("")
  });

  get isPresentiel() { return this.seanceForm.get('isPresentiel'); }

  type = this.route.snapshot.paramMap.get('type');

  display: boolean;
  constructor(private EtudiantService: EtudiantService, private matiereService: MatiereService, private formateurService: FormateurService, private seanceService: SeanceService, private classeService: ClasseService, private messageService: MessageService, private router: Router, private route: ActivatedRoute,
    private AuthService: AuthService, private CampusService: CampusService, private DiplomeService: DiplomeService) { }

  ngOnInit(): void {
    this.matiereService.getAll().subscribe(
      ((response) => {
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
        this.dropdownCampus = [{ libelle: 'Choissisez un campus', value: null }]
        data.forEach(item => {
          this.dropdownCampus.push({ libelle: item.libelle, value: item._id });
        })
      }
    )
    this.classeService.getAll().subscribe(
      ((response) => {
        for (let classeID in response) {
          this.dropdownClasse.push({ nom: response[classeID].nom, value: response[classeID]._id });
          this.dropdownClasse[response[classeID]._id] = response[classeID];
          this.classes[response[classeID]._id] = response[classeID];
        }
      }),
      ((error) => { console.error(error) })
    );
  }

  saveSeance() {
    //TODO get nbSeance
    if (this.seanceForm.value.libelle == "") {
      let classeStr = ""
      this.seanceForm.value.classe.forEach(c => {
        classeStr = classeStr + c.value.abbrv + ","
      })
      classeStr.slice(classeStr.lastIndexOf(','))
      this.seanceForm.value.libelle = classeStr + " - " + this.matieres[this.seanceForm.value.matiere.value].abbrv + " - " + this.seanceForm.value.formateur.nom + " (" + this.seanceForm.value.nbseance + "/" + this.matieres[this.seanceForm.value.matiere.value].seance_max + ")"
    }

    let classeList = []
    this.seanceForm.value.classe.forEach(c => {
      classeList.push(c.value)
    })

    let seance = new Seance(null, classeList, this.seanceForm.value.matiere.value, this.seanceForm.value.libelle, this.seanceForm.value.date_debut, this.seanceForm.value.date_fin, this.seanceForm.value.formateur.value, 'classe: ' + this.seanceForm.value.classe[0].value + ' Formateur: ' + this.seanceForm.value.formateur.nom,
      this.seanceForm.value.isPresentiel.value, this.seanceForm.value.salle_name.value, this.seanceForm.value.isPlanified.value, this.seanceForm.value.campus_id.value, this.seanceForm.value.nbseance);

    let calc = new Date(this.seanceForm.value.date_fin).getHours() - new Date(this.seanceForm.value.debut).getHours()
    let choice = true
    this.formateurService.getByUserId(this.seanceForm.value.formateur.value).subscribe(data => {
      if (!data.hasOwnProperty("volume_h") || data.volume_h == null || data.volume_h[this.seanceForm.value.matiere.value] == undefined || data.volume_h[this.seanceForm.value.matiere.value] != Number) {
        choice = confirm("Le formateur n'a pas de volume horaire pour cette matière\nVoulez-vous quand même créer cette séance ?")
      } else {
        if (data.hasOwnProperty("volume_h_consomme") && data.volume_h_consomme[this.seanceForm.value.matiere.value] == Number && data.volume_h_consomme[this.seanceForm.value.matiere.value] + calc > data.volume_h[this.seanceForm.value.matiere.value]) {
          choice = confirm("Le volume horaire de ce formateur sera dépassé pour cette matière.\nVoulez-vous quand même créer cette séance ?")
        }
      }
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
        } else if (day == 2) {
          //Tuesday
          score_debut = this.getScoreString(data.tuesday_available.h_debut)
          score_fin = this.getScoreString(data.tuesday_available.h_fin)
          rmq = data.tuesday_available.remarque
        } else if (day == 3) {
          //Wednesday
          score_debut = this.getScoreString(data.wednesday_available.h_debut)
          score_fin = this.getScoreString(data.wednesday_available.h_fin)
          rmq = data.wednesday_available.remarque
        } else if (day == 4) {
          //Thursday
          score_debut = this.getScoreString(data.thursday_available.h_debut)
          score_fin = this.getScoreString(data.thursday_available.h_fin)
          rmq = data.thursday_available.remarque
        } else if (day == 5) {
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
        if (!available) {
          let txt = ""
          if (rmq != "") {
            txt = "\nRemarque: " + rmq
          }
          choice = confirm("Le formateur n'est pas disponible pour toute la séance à cause de ses jours de disponibilité\nVoulez-vous quand même créer cette séance ?" + txt)
        }
      }
      if (choice)
        this.seanceService.create(seance).subscribe((data) => {
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
              "\nMatière: " + this.matieres[serror.matiere_id].nom +
              "\nClasse: " + classeStr
          })

        });
    })

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

}
