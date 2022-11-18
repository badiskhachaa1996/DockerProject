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
  matieres: Matiere[] = [];
  dropdownMatiere: any[] = [{ libelle: "Choisir un module", value: null }];


  classes: Classe[] = [];
  dropdownClasse: any[] = [];

  isFormateur: Formateur = null
  token;

  dropdownFormateur: any[] = [];


  dropdownNiveau: any[] = [
    { label: "Évaluation", value: "Évaluation" },
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
    conseiller_id: new FormControl('', Validators.required),
    classe_id: new FormControl('', Validators.required),
    matiere_id: new FormControl('', Validators.required),
    libelle: new FormControl(''),
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
      })
      if (this.isFormateur)
        this.formAddExamen.patchValue({ formateur_id: this.isFormateur._id })
    })

    //Initialisation des formulaires
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token) {
      this.formateurService.getByUserId(this.token.id).subscribe(f => {
        if (f != null) {
          //Ce n'est pas Admin, c'est un formateur
          this.isFormateur = f
          this.formAddExamen.patchValue({ formateur_id: f._id })
          this.matiereService.getAllByFormateurID(this.token.id)
        } else {
          //C'est un Admin
          //Recuperation de la liste des matières
          this.matiereService.getAll().subscribe(
            ((response) => {
              response.forEach((matiere) => {
                this.dropdownMatiere.push({ libelle: matiere.nom, value: matiere._id });
                this.matieres[matiere._id] = matiere;
              });
            }),
            ((error) => { console.error(error); })
          );


          //Recuperation de la liste des classes
          this.classeService.getAll().subscribe(
            ((response) => {
              response.forEach((classe) => {
                this.dropdownClasse.push({ libelle: classe.abbrv, value: classe._id });
                this.classes[classe._id] = classe;
              });
            }),
            ((error) => { console.error(error); })
          );
        }
      })
    }
  }

  //Methode d'ajout d'un formulaire
  onAddExamen() {
    //Recuperation des données du formulaire d'ajout d'examen
    let classe_id = this.formAddExamen.get("classe_id")?.value.value;
    let matiere_id = this.formAddExamen.get("matiere_id")?.value.value;
    let formateur_id = this.formAddExamen.get("formateur_id")?.value;
    let libelle = this.formAddExamen.get("libelle")?.value;
    let date = this.formAddExamen.get("date")?.value;
    let type = this.formAddExamen.get("type")?.value;
    let note_max = this.formAddExamen.get("note_max")?.value;
    let coef = this.formAddExamen.get("coef")?.value;
    let niveau = this.formAddExamen.get("niveau")?.value;

    let examen = new Examen(null, classe_id, matiere_id, formateur_id, date, type, note_max, coef, libelle, niveau);
    console.log(examen)
    this.examenService.create(examen).subscribe(
      (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Nouvel examen ajouté",
        });
        this.router.navigate(['/'])
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


