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


@Component({
  selector: 'app-ajout-examen',
  templateUrl: './ajout-examen.component.html',
  styleUrls: ['./ajout-examen.component.scss']
})
export class AjoutExamenComponent implements OnInit {
  dropdownMatiere: any[] = [];
  matieres: any = {}
  formateurs: any = {}
  groupes: any = {}

  dropdownClasse: any[] = [];
  token;

  dropdownFormateur: any[] = [];


  dropdownNiveau: any[] = [
    { label: "Controle Continue", value: "Controle Continue" },
    { label: "Examen finale", value: "Examen finale" },
    { label: "Soutenance", value: "Soutenance" }
  ]

  dropdownType: any[] = [
    { label: "Ponctuelle orale", value: "Ponctuelle orale" },
    { label: "Ponctuelle écrite", value: "Ponctuelle écrite" },
    { label: "Épreuve ponctuelle pratique et orale", value: "Épreuve ponctuelle pratique et orale" },
    { label: "Ponctuelle écrite orale", value: "Ponctuelle écrite orale" },
    { label: "Devoir Sur Table", value: "Devoir Sur Table" },
    { label: "BTS Blanc", value: "BTS Blanc" },
    { label: "Participation", value: "Participation" }
  ]

  formAddExamen: FormGroup = new FormGroup({
    classe_id: new FormControl('', Validators.required),
    matiere_id: new FormControl('', Validators.required),
    libelle: new FormControl('', Validators.required),
    formateur_id: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    type: new FormControl(this.dropdownType[0].value, Validators.required),
    niveau: new FormControl(this.dropdownNiveau[0].value, Validators.required),
    note_max: new FormControl('', [Validators.required, Validators.pattern("^[0-9.]+$")]),
    coef: new FormControl('', Validators.required),
  })


  constructor(private userService: AuthService,
    private messageService: MessageService,
    private formateurService: FormateurService,
    private examenService: ExamenService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private router: Router,) { }

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
    })

    //Initialisation des formulaires
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token) {
      //C'est un Admin
      //Recuperation de la liste des matières
      this.matiereService.getAllPopulate().subscribe(
        ((response) => {
          response.forEach((matiere) => {
            this.matieres[matiere._id] = matiere
            let bypa: any = matiere.formation_id
            if (Array.isArray(matiere.formation_id))
              this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau, value: matiere._id });
            else
              this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau, value: matiere._id });
          });
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
  }

  updateLibelle() {
    let classe_id = this.formAddExamen.get("classe_id")?.value;
    let matiere_id = this.formAddExamen.get("matiere_id")?.value;
    let formateur_id = this.formAddExamen.get("formateur_id")?.value;
    if (classe_id && matiere_id && formateur_id) {
      let libelle = this.formateurs[formateur_id].user_id.lastname + " " + this.formateurs[formateur_id].user_id.firstname + " - " + this.matieres[matiere_id].abbrv + " - " + this.groupes[classe_id[0]].abbrv
      classe_id.forEach((cid, index) => {
        if (index != 0)
          libelle = ' - ' + this.groupes[cid].abbrv
      })
      this.formAddExamen.patchValue({ libelle })
    }
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

    let examen = new Examen(null, classe_id, matiere_id, formateur_id, date, type, note_max, coef, libelle, niveau);
    this.examenService.create(examen).subscribe(
      (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Nouvel examen ajouté",
        });
        this.router.navigate(['/notes'])
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


