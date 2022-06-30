import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent implements OnInit {

  examens: Examen[] = [];



  formUpdateExamen: FormGroup;
  showFormUpdateExamen: boolean = false;

  users: User[] = [];
  formateurs: Formateur[] = [];

  matieres: Matiere[] = [];
  dropdownMatiere: any[] = [{ libelle: "", value: "" }];
  idMatiereToUpdate: String;
  nomMatiereToUpdate: String;

  classes: Classe[] = [];
  dropdownClasse: any[] = [{ libelle: "Toutes les classes", value: null }];
  idClasseToUpdate: String;
  nomClasseToUpdate: String;

  dropdownFormateur: any[] = [{ libelle: "", value: "" }];
  formateurToUpdate: Formateur;

  dropdownType: any[] = [
                          { libelle: "Tout les types", value: null},
                          { libelle: "Évaluation", value: "Évaluation" },
                          { libelle: "Examen finale", value: "Examen finale" },
                          { libelle: "Soutenance", value: "Soutenance" }
                        ]

  //Données liées à la modification d'examens
  examenToUpdate: Examen;
  idExamenToUpdate: string;

  constructor(
    private userService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private formateurService: FormateurService,
    private examenService: ExamenService, 
    private matiereService: MatiereService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {

    //Recupération de la liste des examens
    this.examenService.getAll().subscribe(
      (response) => {
        this.examens = [];
        this.examens = response;
      },
      (error) => {
        console.log(error);
      }
    );

    
    //Recuperation de la liste des formateurs
    //On recupère la liste des utilisateurs
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
            console.log(error);
          };
      },
      (error) => {
        console.log(error);
      }
    );


    //Recuperation de la liste des matières
    this.matiereService.getAll().subscribe(
      ((response) => {
        response.forEach((matiere) => {
          this.dropdownMatiere.push({libelle: matiere.nom, value: matiere._id});
          this.matieres[matiere._id] = matiere;
        });
      }),
      ((error) => { console.log(error); })
    );


    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach((classe) => {
          this.dropdownClasse.push({libelle: classe.nom, value: classe._id});
          this.classes[classe._id] = classe;
        });
      }),
      ((error) => { console.log(error); })
    );

    //Initialisation des formulaires
  
    this.onInitFormUpdateExamen();
  }

  //Methode d'initialisation du formulaire de mise à jours
  onInitFormUpdateExamen() {
    this.formUpdateExamen = this.formBuilder.group({
      classe_id: [
        "", Validators.required],
      matiere_id: [
          "", Validators.required],
      formateur_id: ["", Validators.required],
      libelle: ["", Validators.required],
      date: ["", Validators.required],
      type: ["", Validators.required],
      note_max: ["", [Validators.required, Validators.pattern("^[0-9.]+$")]],
      coef: ["", Validators.required],
    });
  }

  //Methode de modification d'un examen
  onUpdateExamen() {
    //Recuperation des données du formulaire de modification des examens
    let classe_id = this.formUpdateExamen.get("classe_id")?.value.value;
    let matiere_id = this.formUpdateExamen.get("matiere_id")?.value.value;
    let formateur_id = this.formUpdateExamen.get("formateur_id")?.value.value;
    let libelle = this.formUpdateExamen.get("libelle")?.value;
    let date = this.formUpdateExamen.get("date")?.value;
    let type = this.formUpdateExamen.get("type")?.value.value;
    let note_max = this.formUpdateExamen.get("note_max")?.value;
    let coef = this.formUpdateExamen.get("coef")?.value;

    let examen = new Examen(
      this.examenToUpdate._id,
      classe_id,
      matiere_id,
      formateur_id,
      date,
      type,
      note_max,
      coef,
      libelle,
    );

    this.examenService.update(examen).subscribe(
      (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Examen modifié",
        });

        this.examenService.getAll().subscribe(
          (responseE) => {
            this.examens = [];
            this.examens = responseE;
          },
          (error) => {
            console.log(error);
          }
        );

        this.showFormUpdateExamen = false;

      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Modification impossible",
        });
      }
    );
  }

  //pour la partie de traitement des erreurs sur le formulaire
 
  get note_max_m() {
    return this.formUpdateExamen.get("note_max");
  }

  //Methode de recuperation d'un examen via son identifianten vue de la modification
  onGetById() {
    this.examenService.getById(this.idExamenToUpdate).subscribe(
      (response) => {
        this.examenToUpdate = response;

        let firstname: string;
        let lastname: string;

        if (this.formateurToUpdate.user_id == this.users[this.formateurToUpdate.user_id]._id) {
          firstname = this.users[this.formateurToUpdate.user_id].firstname;
          lastname = this.users[this.formateurToUpdate.user_id].lastname;
        }

        this.formUpdateExamen.patchValue({
         
          classe_id: {
            libelle: this.nomClasseToUpdate,
            value: this.idClasseToUpdate
          },

          matiere_id: {
            libelle: this.nomMatiereToUpdate,
            value: this.idMatiereToUpdate
          },
          formateur_id: {
            libelle: firstname + ' ' + lastname,
            value: this.examenToUpdate.formateur_id,
          },
          date: this.examenToUpdate.date,
          type: this.examenToUpdate.type,
          note_max: this.examenToUpdate.note_max,
          coef: this.examenToUpdate.coef,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
