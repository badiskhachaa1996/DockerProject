import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.scss']
})
export class ExamenComponent implements OnInit {

  examens: Examen[] = [];
  isFormateur: Formateur = null
  token;

  formUpdateExamen: FormGroup;
  showFormUpdateExamen: boolean = false;

  users: User[] = [];
  formateurs: Formateur[] = [];

  matieres = {};
  dropdownClasse: any[] = [];
  dropdownMatiere: any[] = [];
  idMatiereToUpdate: String;

  classes = {};
  dropdownGroupe: any[] = [{ label: 'Tous les groupes', value: null }];//Filtre
  dropdownModule: any[] = [{ label: 'Tous les modules', value: null }];//Filtre
  idClasseToUpdate: Classe[];

  dropdownFormateur: any[] = [];
  formateurToUpdate: Formateur;


  dropdownNiveau: any[] = [
    { label: "Controle Continue", value: "Controle Continue" },
    { label: "Examen finale", value: "Examen finale" },
    { label: "Soutenance", value: "Soutenance" }
  ]

  dropdownType: any[] = [
    { label: "Ponctuelle orale", value: "Ponctuelle orale" },
    { label: "Ponctuelle écrite", value: "Ponctuelle écrite" },
    { label: "Épreuve ponctuelle pratique et orale", value: "Épreuve ponctuelle pratique et orale" },
    { label: "Ponctuelle écrite orale", value: "Ponctuelle écrite orale" }
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
    private classeService: ClasseService,
    private router: Router
  ) { }

  ngOnInit(): void {

    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token) {
      this.loadStuffs()
    }


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
                    label: user.firstname + " " + user.lastname,
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



    //Initialisation des formulaires

    this.onInitFormUpdateExamen();
  }

  loadStuffs() {
    this.dropdownMatiere = []
    this.matieres = {}
    this.dropdownClasse = []
    this.classes = {}
    this.dropdownGroupe = [{ label: 'Tous les groupes', value: null }];//Filtre
    this.dropdownModule = [{ label: 'Tous les modules', value: null }];//Filtre
    this.formateurService.getByUserId(this.token.id).subscribe(f => {
      this.isFormateur = f
      if (!this.isFormateur) {
        //Récupération des informations en tant qu'Admin ou Agent Péda
        this.examenService.getAllPopulate().subscribe(
          (response) => {
            this.examens = response;
          },
          (error) => {
            console.error(error);
          }
        );
        //Recuperation de la liste des matières
        this.matiereService.getAll().subscribe(
          ((response) => {
            response.forEach((matiere) => {
              this.dropdownMatiere.push({ label: matiere.nom, value: matiere._id });
              this.dropdownModule.push({ label: matiere.nom, value: matiere._id });
              this.matieres[matiere._id] = matiere;
            });
          }),
          ((error) => { console.error(error); })
        );


        //Recuperation de la liste des classes
        this.classeService.getAll().subscribe(
          ((response) => {
            response.forEach((classe) => {
              this.dropdownClasse.push({ label: classe.abbrv, value: classe._id });
              this.dropdownGroupe.push({ label: classe.abbrv, value: classe._id });
              this.classes[classe._id] = classe;
            });
          }),
          ((error) => { console.error(error); })
        );
      } else {
        //Récupération des informations en tant que Formateur
        this.matiereService.getAllByFormateurID(this.token.id).subscribe((r) => {
          r.matieres.forEach((matiere) => {
            if (Array.isArray(matiere.formation_id))
              this.dropdownMatiere.push({ label: matiere.nom + ' - ' + matiere.formation_id[0].titre + " - " + matiere.niveau, value: matiere._id });
            else
              this.dropdownMatiere.push({ label: matiere.nom + ' - ' + matiere.formation_id.titre + " - " + matiere.niveau, value: matiere._id });
            this.dropdownModule.push({ label: matiere.nom, value: matiere._id });
          });
          r.groupes.forEach((g) => {
            this.dropdownClasse.push({ label: g.abbrv, value: g._id });
            this.dropdownGroupe.push({ label: g.abbrv, value: g._id });
          })
        })
        this.examenService.getAllByFormateurID(this.isFormateur._id).subscribe(
          (response) => {
            this.examens = response;
          },
          (error) => {
            console.error(error);
          })
      }
    })
  }

  //Methode d'initialisation du formulaire de mise à jours
  onInitFormUpdateExamen() {
    this.formUpdateExamen = this.formBuilder.group({
      classe_id: [
        "", Validators.required],
      matiere_id: [
        "", Validators.required],
      formateur_id: ["", Validators.required],
      libelle: [""],
      date: ["", Validators.required],
      type: ["", Validators.required],
      note_max: ["", [Validators.required, Validators.pattern("^[0-9.]+$")]],
      coef: ["", Validators.required],
      niveau: ["", Validators.required]
    });
    if (this.isFormateur) {
      this.formUpdateExamen.patchValue({ formateur_id: this.isFormateur._id })
    }
  }

  //Methode de modification d'un examen
  onUpdateExamen() {
    //Recuperation des données du formulaire de modification des examens
    let classe_id = this.formUpdateExamen.get("classe_id")?.value;
    let matiere_id = this.formUpdateExamen.get("matiere_id")?.value;
    let formateur_id = this.formUpdateExamen.get("formateur_id")?.value;
    let libelle = this.formUpdateExamen.get("libelle")?.value;
    let date = this.formUpdateExamen.get("date")?.value;
    let type = this.formUpdateExamen.get("type")?.value;
    let note_max = this.formUpdateExamen.get("note_max")?.value;
    let coef = this.formUpdateExamen.get("coef")?.value;
    let niveau = this.formUpdateExamen.get("niveau")?.value;

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
      niveau
    );

    this.examenService.update(examen).subscribe(
      (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Examen modifié",
        });
        this.loadStuffs()

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
        let l_id = []
        this.idClasseToUpdate.forEach(cid => {
          l_id.push(cid._id)
        })
        this.formUpdateExamen.patchValue({
          classe_id: l_id,
          matiere_id: this.idMatiereToUpdate,
          formateur_id: this.examenToUpdate.formateur_id,
          date: this.examenToUpdate.date,
          type: this.examenToUpdate.type,
          note_max: this.examenToUpdate.note_max,
          coef: this.examenToUpdate.coef,
          niveau: this.examenToUpdate.niveau,
          libelle: this.examenToUpdate.libelle
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onRedirect() {
    this.router.navigate(['ajout-examen']);
  }

  onLoadModules(event) {
    console.log(event)

  }
}
