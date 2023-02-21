import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Classe } from 'src/app/models/Classe';
import { Examen } from 'src/app/models/Examen';
import { Formateur } from 'src/app/models/Formateur';
import { Matiere } from 'src/app/models/Matiere';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ClasseService } from 'src/app/services/classe.service';
import { ExamenService } from 'src/app/services/examen.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { SeanceService } from 'src/app/services/seance.service';


@Component({
  selector: 'app-ajout-examen',
  templateUrl: './ajout-examen.component.html',
  styleUrls: ['./ajout-examen.component.scss']
})
export class AjoutExamenComponent implements OnInit {
  dropdownMatiere: any[] = [];
  dropdownMatiereDefault = this.dropdownMatiere
  matieres: any = {}
  formateurs: any = {}
  groupes: any = {}

  dropdownClasse: any[] = [];
  isFormateur: Formateur = null
  token;

  dropdownSemestre = [
    { label: 'Semestre 1', value: 'Semestre 1' },
    { label: 'Semestre 2', value: 'Semestre 2' },
  ]

  dropdownFormateur: any[] = [];
  defaultDropdownFormateur = this.dropdownFormateur


  dropdownNiveau: any[] = [
    { label: "Control Continu", value: "Control Continu" },
    { label: "Examen final", value: "Examen final" },
    { label: "BTS Blanc", value: "BTS Blanc" },
    { label: "Projet Professionel", value: "Projet Professionel" }
  ]

  dropdownType: any[] = [
    { label: "Ponctuelle orale", value: "Ponctuelle orale" },
    { label: "Ponctuelle écrite", value: "Ponctuelle écrite" },
    // { label: "Épreuve ponctuelle pratique et orale", value: "Épreuve ponctuelle pratique et orale" },
    { label: "Ponctuelle écrite orale", value: "Ponctuelle écrite orale" },
    { label: "Devoir Sur Table", value: "Devoir Sur Table" },
    { label: "Participation", value: "Participation" }
  ]

  formAddExamen: FormGroup = new FormGroup({
    classe_id: new FormControl('', Validators.required),
    matiere_id: new FormControl('', Validators.required),
    libelle: new FormControl('', Validators.required),
    formateur_id: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    niveau: new FormControl('', Validators.required),
    note_max: new FormControl(20, [Validators.required, Validators.pattern("^[0-9.]+$")]),
    coef: new FormControl(1, Validators.required),
    semestre: new FormControl('', Validators.required)
  })


  constructor(private userService: AuthService,
    private messageService: MessageService,
    private formateurService: FormateurService,
    private examenService: ExamenService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private router: Router,
    private SeanceService: SeanceService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.formateurService.getAllPopulate().subscribe(formateurs => {
      formateurs.forEach(f => {
        let bypass_user: any = f.user_id
        if (bypass_user)
          this.dropdownFormateur.push({
            label: bypass_user.firstname + " " + bypass_user.lastname,
            value: f._id,
          })
        this.formateurs[f._id] = f
      })
      this.defaultDropdownFormateur = this.dropdownFormateur
    })
    if (this.token) {
      this.formateurService.getByUserId(this.token.id).subscribe(f => {
        if (f != null) {
          //Ce n'est pas Admin, c'est un formateur
          this.isFormateur = f
          this.formAddExamen.patchValue({ formateur_id: f._id })
          this.matiereService.getAllByFormateurID(this.token.id).subscribe((r) => {
            r.matieres.forEach((matiere) => {
              this.matieres[matiere._id] = matiere
              if (Array.isArray(matiere.formation_id))
                this.dropdownMatiere.push({ label: matiere.nom + ' - ' + matiere.formation_id[0].titre + " - " + matiere.niveau, value: matiere._id });
              else
                this.dropdownMatiere.push({ label: matiere.nom + ' - ' + matiere.formation_id.titre + " - " + matiere.niveau, value: matiere._id });
            });
            r.groupes.forEach((g) => {
              this.groupes[g._id] = g
              this.dropdownClasse.push({ label: g.abbrv, value: g._id });
            })
          })
        } else {

          //C'est un Admin
          //Recuperation de la liste des matières
          this.matiereService.getAllPopulate().subscribe(
            ((response) => {
              response.forEach((matiere) => {
                this.matieres[matiere._id] = matiere
                let bypa: any = matiere.formation_id
                if (Array.isArray(matiere.formation_id))
                  this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
                else
                  this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
              });
              this.dropdownMatiereDefault = this.dropdownMatiere
            }),
            ((error) => { console.error(error); })
          );


          //Recuperation de la liste des classes
          this.classeService.getAll().subscribe(
            ((response) => {
              response.forEach((classe) => {
                this.groupes[classe._id] = classe
                this.dropdownClasse.push({ label: classe.abbrv, value: classe._id });
              });
            }),
            ((error) => { console.error(error); })
          );
        }
      })

    }
  }

  updateLibelle() {
    let classe_id = this.formAddExamen.get("classe_id")?.value;
    let matiere_id = this.formAddExamen.get("matiere_id")?.value;
    let formateur_id = this.formAddExamen.get("formateur_id")?.value;
    let niveau = this.formAddExamen.get("niveau")?.value;
    if (classe_id && matiere_id && formateur_id && niveau) {
      let libelle = this.formateurs[formateur_id].user_id.lastname + " " + this.formateurs[formateur_id].user_id.firstname + " | "
      matiere_id.forEach((mid, index) => {
        if (index == 0)
          libelle = libelle + this.matieres[mid].abbrv
        else
          libelle = libelle + ' - ' + this.matieres[mid].abbrv
      })
      libelle = libelle + " | "
      classe_id.forEach((cid, index) => {
        if (index == 0)
          libelle = libelle + this.groupes[cid].abbrv
        else
          libelle = libelle + ' - ' + this.groupes[cid].abbrv
      })
      libelle = libelle + ' | ' + niveau
      if (niveau != "BTS Blanc")
        this.examenService.getAllByFormateurID(formateur_id).subscribe(e => {
          libelle = libelle + " " + (e.length + 1).toString()
          this.formAddExamen.patchValue({ libelle })
        })
    }

  }

  filterModule() {
    let classe_id = this.formAddExamen.get("classe_id")?.value;
    let cids = []
    if (classe_id) {
      classe_id.forEach(c => {
        cids.push(this.groupes[c].diplome_id)
      })
      this.matiereService.getAllPopulateByFormationID(cids).subscribe(response => {
        this.dropdownMatiere = []
        response.forEach(matiere => {
          this.matieres[matiere._id] = matiere
          let bypa: any = matiere.formation_id
          if (Array.isArray(matiere.formation_id))
            this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
          else
            this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
        })
      })
    }
  }

  filterFormateur() {
    let matiere_id = this.formAddExamen.get("matiere_id")?.value;
    this.formAddExamen.patchValue({ semestre: this.matieres[matiere_id[0]].semestre })
    this.dropdownFormateur = []
    if (matiere_id)
      this.SeanceService.getFormateursFromClasseIDs(matiere_id).subscribe(r => {
        if (r && r.length != 0) {
          r.forEach(f => {
            let bypass_user: any = f.user_id
            if (bypass_user)
              this.dropdownFormateur.push({
                label: bypass_user.firstname + " " + bypass_user.lastname,
                value: f._id,
              })
          })
        } else
          this.dropdownFormateur = this.defaultDropdownFormateur
      })
    else
      this.dropdownFormateur = this.defaultDropdownFormateur
  }

  //Methode d'ajout d'un formulaire
  onAddExamen() {
    //Recuperation des données du formulaire d'ajout d'examen
    let classe_id = this.formAddExamen.get("classe_id")?.value;
    let matiere_id = this.formAddExamen.get("matiere_id")?.value;
    let formateur_id = this.formAddExamen.get("formateur_id")?.value;
    let libelle = this.formAddExamen.get("libelle")?.value;
    let date = this.formAddExamen.get("date")?.value;
    let type = this.formAddExamen.get("type")?.value;
    let note_max = this.formAddExamen.get("note_max")?.value;
    let coef = this.formAddExamen.get("coef")?.value;
    let niveau = this.formAddExamen.get("niveau")?.value;
    if (niveau == 'Examen final')
      coef = 2
    let examen = new Examen(null, classe_id, matiere_id, formateur_id, date[0], type, note_max, coef, libelle, niveau, this.matieres[matiere_id].semestre, true, date[1]);
    this.examenService.create(examen).subscribe(
      (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Nouvel examen ajouté",
        });
        this.router.navigate(['/examens'])
      },
      (error) => {
        console.error(error)
        this.messageService.add({
          severity: "error",
          summary:
            "Impossible d'ajouter le nouvel examen veuillez contacter un administrateur",
        });
      }
    );


  }
  //pour la partie de traitement des erreurs sur le formulaire
  get note_max() {
    return this.formAddExamen.get("note_max");
  }




}


