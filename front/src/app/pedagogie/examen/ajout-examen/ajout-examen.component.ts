import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-ajout-examen',
  templateUrl: './ajout-examen.component.html',
  styleUrls: ['./ajout-examen.component.scss']
})
export class AjoutExamenComponent implements OnInit {

  examens: Examen[] = [];
  formAddExamen: FormGroup;
  users: User[] = [];
  formateurs: Formateur[] = [];

  matieres: Matiere[] = [];
  dropdownMatiere: any[] = [{ libelle: "Choisir une matière", value: null }];


  classes: Classe[] = [];
  dropdownClasse: any[] = [{ libelle: "Choisir une classe", value: null }];


  dropdownFormateur: any[] = [{ libelle: "Choisir un formateur", value: null }];


  dropdownNiveau: any[] = [
    { label: "Évaluation", value: "Évaluation" },
    { label: "Examen finale", value: "Examen finale" },
    { label: "Soutenance", value: "Soutenance" }
  ]

  dropdownType: any[] = [
    { label: "Ponctuelle orale", value: "Ponctuelle orale" },
    { label: "Ponctuelle écrite", value: "Ponctuelle écrite" },
    { label: "Épreuve ponctuelle pratique et orale", value: "Épreuve ponctuelle pratique et orale" },
    { label: "Ponctuelle écrite orale", value: "Ponctuelle écrite orale" }
  ]


  constructor(private userService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private formateurService: FormateurService,
    private examenService: ExamenService,
    private matiereService: MatiereService,
    private classeService: ClasseService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe(
      (responseU) => {
        //Ensuite on boucle sur les formateurs
        this.formateurService.getAll().subscribe(
          responseF => {
            responseF.forEach(formateur => {
              responseU.forEach(user => {
                this.users[user._id] = user;
                if (user._id == formateur.user_id) {
                  this.dropdownFormateur.push({
                    libelle: user.firstname + " " + user.lastname,
                    value: formateur._id,
                  });
                  this.formateurs[formateur._id] = formateur;
                }
              });
            });
          }),
          (error) => {
            console.error(error);
          };
      },
      (error) => {
        console.error(error);
      }
    );


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
          this.dropdownClasse.push({ libelle: classe.nom, value: classe._id });
          this.classes[classe._id] = classe;
        });
      }),
      ((error) => { console.error(error); })
    );

    //Initialisation des formulaires
    this.onInitFormAddExamen();

  }

  //Methode d'initialisation du formulaire d'ajout
  onInitFormAddExamen() {
    this.formAddExamen = this.formBuilder.group({
      classe_id: ["", Validators.required],
      matiere_id: ["", Validators.required],
      libelle: ["", Validators.required],
      formateur_id: ["", Validators.required],
      date: ["", Validators.required],
      type: [this.dropdownType[0].value, Validators.required],
      niveau: [this.dropdownNiveau[0].value, Validators.required],
      note_max: ["", [Validators.required, Validators.pattern("^[0-9.]+$")]],
      coef: ["", Validators.required],
    });
  }

  //Methode d'ajout d'un formulaire
  onAddExamen() {
    //Recuperation des données du formulaire d'ajout d'examen
    let classe_id = this.formAddExamen.get("classe_id")?.value.value;
    let matiere_id = this.formAddExamen.get("matiere_id")?.value.value;
    let formateur_id = this.formAddExamen.get("formateur_id")?.value.value;
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
        this.onInitFormAddExamen()
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


