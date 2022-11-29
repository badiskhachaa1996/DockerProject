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
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/models/Note';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';

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
    { label: "Control Continue", value: "Control Continue" },
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
    private NotesService: NoteService,
    private router: Router,
    private EtudiantService: EtudiantService
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

      if (this.token.role == 'user')
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
  notes: Note[] = []
  loadNotes(examen) {
    this.notes = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      this.notes = notes
      console.log(notes)
    })
  }

  examSelected: Examen = null
  notesByClasseBySemestre: Note[] = []

  tableauNotes = [];//{ etudiant: string, note: Number, appreciation: string, date_note: Date }
  loadEtudiantsForNote(examen: any) {
    this.examSelected = examen
    let classe_ids = []
    let oldNote = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      examen.classe_id.forEach(c => { classe_ids.push(c._id) })
      this.EtudiantService.getAllByMultipleClasseID(classe_ids).subscribe(etudiants => {
        notes.forEach(n => {
          let bypass: any = n.etudiant_id
          oldNote.push(bypass._id)
          this.tableauNotes.push({
            etudiant: bypass?.user_id?.firstname + ' ' + bypass?.user_id?.lastname, // + ' ' + n.etudiant_id?.user_id?.date_creation
            note: parseFloat(n.note_val),
            appreciation: n.appreciation,
            date_note: n.date_creation,
            _id: n._id
          })
        })
        etudiants.forEach(etu => {
          let bypass: any = this.examSelected.matiere_id
          if (oldNote.indexOf(etu._id) == -1)
            this.tableauNotes.push({
              etudiant: etu.user_id.firstname + ' ' + etu.user_id.lastname, // + ' ' + n.etudiant_id?.user_id?.date_creation
              note: NaN,
              appreciation: '',
              date_note: null,
              _id: etu.user_id._id + "NEW",
              etudiant_id: etu._id,
              examen_id: this.examSelected._id,
              classe_id: etu.classe_id._id,
              matiere_id: bypass._id,
              isAbsent: false,
              semestre: this.examSelected.semestre
            })
        })
      })
      console.log(notes)
    })
  }

  clonedRowData = {}
  onRowEditInit(rowData) {
    this.clonedRowData[rowData._id] = { ...rowData };
  }

  onRowEditSave(rowData, index: number) {
    if (rowData.note <= this.examSelected.note_max) {
      delete this.clonedRowData[rowData._id];
      rowData.isAbsent = false
      rowData.date_note = new Date()

      let note = new Note(
        rowData._id,
        rowData.note.toString(),
        rowData.semestre,
        rowData.etudiant_id,
        rowData.examen_id,
        rowData.appreciation,
        rowData.classe_id,
        rowData.matiere_id,
        false,
        new Date()
      )
      if (rowData._id.includes('NEW')) {
        //C'est un Nouvelle Note
        delete note._id
        this.NotesService.create(note).subscribe(r => {
          rowData._id = r._id
          this.tableauNotes[index] = rowData
          this.messageService.add({ severity: 'success', summary: "La note a été crée pour " + rowData.etudiant })
        }, err => {
          this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
          console.error(err)
        })
      } else {
        //C'est une mise à jour de Note
        this.NotesService.updateV2(note).subscribe(r => {
          this.tableauNotes[index] = rowData
          this.messageService.add({ severity: 'success', summary: "La note a été mis à jour pour " + rowData.etudiant })
        }, err => {
          this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
          console.error(err)
        })
      }
    }
    else {
      this.messageService.add({ severity: "error", summary: "La note est supérieur à la note max de l'évaluation (" + this.examSelected.note_max + ")" })
      this.onRowEditCancel(rowData, index)
    }
  }

  onRowEditCancel(rowData, index: number) {
    this.tableauNotes[index] = this.clonedRowData[rowData._id];
    delete this.clonedRowData[rowData._id];
  }

  onRowUpdateIntoAbsent(rowData, index: number) {
    rowData.isAbsent = true
    let note = new Note(
      rowData._id,
      '0',
      rowData.semestre,
      rowData.etudiant_id,
      rowData.examen_id,
      'Absence Justifié',
      rowData.classe_id,
      rowData.matiere_id,
      true,
      new Date()
    )
    if (rowData._id.includes('NEW')) {
      //C'est un Nouvelle Note
      delete note._id
      this.NotesService.create(note).subscribe(r => {
        rowData._id = r._id
        this.tableauNotes[index] = rowData
        this.messageService.add({ severity: 'success', summary: "La note a été crée pour " + rowData.etudiant })
      }, err => {
        this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
        console.error(err)
      })
    } else {
      //C'est une mise à jour de Note
      this.NotesService.updateV2(note).subscribe(r => {
        this.tableauNotes[index] = rowData
        this.messageService.add({ severity: 'success', summary: "La note a été mis à jour pour " + rowData.etudiant })
      }, err => {
        this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
        console.error(err)
      })
    }
  }
  isNaN(value) { return (Number.isNaN(value)) }
}
