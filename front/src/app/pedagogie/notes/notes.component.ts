import { Component, ElementRef, OnInit, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Classe } from 'src/app/models/Classe';
import { Etudiant } from 'src/app/models/Etudiant';
import { Examen } from 'src/app/models/Examen';
import { Note } from 'src/app/models/Note';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ClasseService } from 'src/app/services/classe.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ExamenService } from 'src/app/services/examen.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { MatiereService } from 'src/app/services/matiere.service';
import { Matiere } from 'src/app/models/Matiere';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { Campus } from 'src/app/models/Campus';
import { Diplome } from 'src/app/models/Diplome';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Appreciation } from 'src/app/models/Appreciation';
import { AppreciationService } from 'src/app/services/appreciation.service';
import { RachatBulletinService } from 'src/app/services/rachat-bulletin.service';
import { RachatBulletin } from 'src/app/models/RachatBulletin';
import { SeanceService } from 'src/app/services/seance.service';
import { FormateurService } from 'src/app/services/formateur.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  providers: [MessageService],
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];

  showBulletin: boolean = false
  formUpdateNote: FormGroup;
  showFormUpdateNote: boolean = false;

  users: User[] = [];
  userList: any[] = [];
  formateurs = {}

  etudiants: Etudiant[] = [];
  dropdownEtudiant: any[] = [];

  examens: Examen[] = [];
  dropdownExamen: any[] = [{ libelle: 'Veuillez choisir une évaluation', value: null }];

  dropdownClasse: any[] = [{ libelle: 'Toutes les groupes', value: null }];
  filterCampus: any[] = [
    { label: "Tous les campus", value: null }
  ]
  classes: Classe[] = [];
  showPVAnnuel = false
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  isAnneeScolaire: boolean = true;

  //Données de la dropdown semestre
  dropdownSemestre: any = [
    { libelle: 'Choissisez un semestre', value: 'Choissisez un semestre', actif: true },
    { libelle: '1er', value: 'Semestre 1', actif: false },
    { libelle: '2ème', value: 'Semestre 2', actif: false },
    { libelle: '3ème', value: 'Semestre 3', actif: false },
    { libelle: '4ème', value: 'Semestre 4', actif: false },
    { libelle: 'Annuel', value: 'Annuel', actif: false }
  ];

  //Données liées à la saisie de notes
  notesByClasseBySemestre: any[] = [];

  formSelectClasse: FormGroup;
  showFormSelectClasse: boolean = false;

  formSelectExam: FormGroup;
  showFormSelectExam: boolean = false;

  classeSelected: Classe;
  semestreSelected: string;
  examSelected: Examen;

  formAddNoteByClasseByExam: FormGroup;
  showFormAddNoteByClasseByExam: boolean = false;

  showTableAddnotes: boolean = false;

  dropdownExamByClasse: any[] = [{ libelle: 'Veuillez choisir une évaluation', value: null }];

  appreciationModules = {}
  dicFormateurMatiere = {}

  initAppreciation(mode) {

    if (mode == "set") {

    } else {
      this.notesForGenerateBulletin.forEach(n => {
        if (this.appreciationToUpdate.appreciation_matiere && this.appreciationToUpdate.appreciation_matiere[n.matiere_id]) {
          this.appreciationModules[n.matiere_id] = this.appreciationToUpdate.appreciation_matiere[n.matiere_id]
        } else {
          this.appreciationModules[n.matiere_id] = ""
        }
      })
    }
  }
  changeAppreciation(m_id, value) {
    this.appreciationModules[m_id] = value
  }
  showFormRacheter = false;
  rachatEtudiant = []
  matiereRachat = []

  initRachatEtudiant() {
    this.rachatEtudiant = []
    this.matiereRachat = []

    this.RBService.getByUserID(this.etudiantToGenerateBulletin.user_id, this.semestreChoose).subscribe(rbs => {
      rbs.forEach(rb => {
        this.rachatEtudiant.push({ matiere_id: rb.matiere_id, fixed_moy: rb.fixed_moy['$numberDecimal'], isNew: false, _id: rb._id, dispensed: rb.isDispensed, semestre: rb.semestre })
      })
    })
    this.notesForGenerateBulletin.forEach(n => {
      this.matiereRachat.push({ label: n.matiere_name, value: n.matiere_id })
    })
  }
  addRachatEtudiant() {
    this.rachatEtudiant.push({ matiere_id: this.matiereRachat[0].value, fixed_moy: 10.0, isNew: true, dispensed: false, semestre: this.semestreChoose })
  }

  updateRachatEtudiant(i, value, type) {
    if (value.value) {
      value = value.value
    }
    this.rachatEtudiant[i][type] = value
  }

  deleteRachatEtudiant(i, isNew) {
    if (!isNew && confirm("Ce rachat sera supprimé totalement (même sans enregistrer le formulaire)\nEtes-vous sûr de vouloir faire cela ?")) {
      this.RBService.delete(this.rachatEtudiant[i]._id).subscribe(data => {
        this.messageService.add({ severity: "success", summary: "Suppresion du rachat réussi" })
      }, error => {
        this.messageService.add({ severity: "error", summary: "Erreur lors de la suppresion du rachat", detail: error.toString() })
      })
      this.GenerateBulletin2(this.etudiantToGenerateBulletin._id, this.semestreChoose)
      this.rachatEtudiant.splice(i, 1)
    }
    if (isNew) {
      this.rachatEtudiant.splice(i, 1)
    }
  }

  onSubmitRachat() {
    let problem: RachatBulletin = null
    console.log(this.rachatEtudiant)
    this.rachatEtudiant.forEach(rb => {
      if (!rb.isNew) {
        //Update
        let RBU = new RachatBulletin(rb._id, rb.matiere_id, this.etudiantToGenerateBulletin.user_id, rb.fixed_moy, rb.semestre, rb.dispensed)
        this.RBService.update(RBU).subscribe(data => {
          testlast(rb, this)
        }, err => {
          problem = RBU
          console.error(err)
        })
      } else {
        //Create
        let RBC = new RachatBulletin(null, rb.matiere_id, this.etudiantToGenerateBulletin.user_id, rb.fixed_moy, rb.semestre, rb.dispensed)
        this.RBService.create(RBC).subscribe(data => {
          testlast(rb, this)
        }, err => {
          problem = RBC
          console.error(err)
        })
      }
    })
    function testlast(rb, t: NotesComponent) {
      if (rb == t.rachatEtudiant[t.rachatEtudiant.length - 1]) {
        //Dernier
        if (problem != null) {
          t.messageService.add({ severity: "error", summary: "Un problème est arrivé avec " + t.matieres[problem.matiere_id].nom })
        } else {
          t.showFormRacheter = false
          t.messageService.add({ severity: "success", summary: "Le rachat a été enregistré avec succès" })
          t.GenerateBulletin2(t.etudiantToGenerateBulletin._id, t.semestreChoose)
        }
      }
    }
  }


  //Données liées à la modification d'une note
  noteToUpdate: Note;
  idNoteToUpdate: string;

  examenToUpdate: Examen;
  etudiantToUpdate: Etudiant;

  matieres: Matiere[] = [];

  //Génération bulletins de notes
  formGenerateBulletin: FormGroup;
  showFormGenerateBulletin: boolean = false;
  classeForBGenerateBulletin: any;
  etudiantFromClasse: Etudiant[] = [];
  etudiantToGenerateBulletin: Etudiant;
  semestreChoose: string;
  notesForGenerateBulletin: any[] = [];
  notesBySemestre: Note[] = [];
  matiere_id: string;
  moyEtudiant: number;
  moyEtudiantAnnuel: { 'Semestre 1': number, 'Semestre 2': number, 'Annuel': number } = { 'Semestre 1': 0, 'Semestre 2': 0, 'Annuel': 0 }
  semestreForGenerateBulletin: string;

  showGenerateBulletin: boolean = false;

  anneScolaire: AnneeScolaire;

  campus: Campus[];
  activeCampus: Campus;
  diplomes: Diplome[];

  //Partie dedié à la saisie d'appreciation générale
  formAppreciationGenerale: FormGroup;
  formUpdateAppreciationGenerale: FormGroup;
  appreciationGenerale: Appreciation;
  appreciationToUpdate: Appreciation;
  showAppreciationGenerale: boolean = false;
  showFormAppreciationGenerale: boolean = false;
  showFormUpdateAppreciationGenerale: boolean = false;
  showBtnAddAppreciationGenerale: boolean = true;
  showBtnUpdateAppreciationGenerale: boolean = false;


  @ViewChild('content', { static: false }) el!: ElementRef;

  constructor(private appreciationService: AppreciationService, private diplomeService: DiplomeService, private campusService: CampusService,
    private anneeScolaireService: AnneeScolaireService, private matiereService: MatiereService, private classeService: ClasseService, private examenService: ExamenService,
    private etudiantService: EtudiantService, private fromBuilder: FormBuilder, private messageService: MessageService, private userService: AuthService,
    private noteService: NoteService, private RBService: RachatBulletinService, private seanceService: SeanceService, private formateurService: FormateurService) { }

  ngOnInit(): void {
    //Recuperation de l'année scolaire en cours
    this.anneeScolaireService.getActive().subscribe(
      ((response) => { this.anneScolaire = response; }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des diplomes
    this.diplomeService.getAll().subscribe(
      ((response) => {
        this.diplomes = response;
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des campus
    this.campusService.getAll().subscribe(
      ((response) => {
        this.campus = response;
        this.campus.forEach(c => {
          this.filterCampus.push({ label: c.libelle, value: c._id })
        })
      }),
      ((error) => { console.error(error); })
    );

    //recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.abbrv, value: classe._id });
          this.classes[classe._id] = classe;
        })

      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des notes
    this.noteService.getAllPopulate().subscribe(
      ((response) => {
        this.notes = response;
        console.log(response)
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des étudiants
    this.userService.getAll().subscribe(us => {
      us.forEach(u => {
        this.users[u._id] = u
      })
    })




    this.matiereService.getAll().subscribe(
      (responseM) => {


        this.examenService.getAllEvaluation().subscribe(
          (responseE) => {
            console.log(responseE);
            responseE.forEach((examen) => {
              responseM.forEach((matiere) => {
                this.matieres[matiere._id] = matiere;
                if (examen.matiere_id.includes(matiere._id)) {
                  this.dropdownExamen.push({
                    libelle: matiere.nom,
                    value: examen._id,
                  });
                  this.examens[examen._id] = examen;
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
    this.onInitFormSelectClasse();
    this.onInitFormUpdateNote();
    this.onInitFormGenerateBulletin();
    this.onInitFormSelectExam();
    this.onInitFormAddNoteByClasseByExam();
    this.onInitFormAppreciationGenerale();
    this.onInitFormUpdateAppreciationGenerale();
  }


  //Methode d'initialisation du formulaire de selection d'une classe
  onInitFormSelectClasse() {
    this.formSelectClasse = this.fromBuilder.group({
      classe: [''],
      semestre: [''],
    });
  }

  //Methode d'initialisation du formulaire de selection d'une classe
  onInitFormSelectExam() {
    this.formSelectExam = this.fromBuilder.group({
      examen: ['', Validators.required],
    });
  }

  //Formulaire d'initialisation du formulaire d'ajout de note par classe et par examen et par semestre
  onInitFormAddNoteByClasseByExam() {
    this.formAddNoteByClasseByExam = this.fromBuilder.group({
      note_val: ['', [Validators.required]],
      etudiant_id: ['', Validators.required],
      appreciation: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàù .]+$")]],
      isAbsent: [false]
    });
  }


  get note_val_esm() {
    return this.formAddNoteByClasseByExam.get("note_val");
  }
  get appreciation_esm() {
    return this.formAddNoteByClasseByExam.get("appreciation");
  }

  get note_val_m() {
    return this.formUpdateNote.get("note_val");
  }
  get appreciation_m() {
    return this.formUpdateNote.get("appreciation");
  }

  //Methode d'initialisation du formulaire d'ajout de notes
  onInitFormUpdateNote() {
    this.formUpdateNote = this.fromBuilder.group({
      note_val: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      semestre: ['', Validators.required],
      etudiant_id: ['', Validators.required],
      examen_id: ['', Validators.required],
      appreciation: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàù .]+$")]],
    });
  }


  //Methode de selection d'une classe et d'un semestre
  onSelectClasse() {
    // this.semestreSelected = this.formSelectClasse.get('semestre').value.value;
    //Recuperation de la date du jour
    let date = new Date();

    //Selection de la classe 
    for (let classe in this.classes) {
      if (this.classes[classe]._id == this.formSelectClasse.get('classe').value.value) {
        this.classeSelected = this.classes[classe];

        //Recuperation du diplome et attribution du semestre
        this.diplomeService.getById(this.classeSelected.diplome_id).subscribe(
          ((response) => {

            if (date >= response.date_debut_semestre_1 && date <= response.date_fin_semestre_1) {
              this.semestreSelected = 'Semestre 1';
              this.isAnneeScolaire = true;
            }

            else if (date >= response.date_debut_semestre_2 && date <= response.date_fin_semestre_2) {
              this.semestreSelected = 'Semestre 2';
              this.isAnneeScolaire = true;
            }

            else {
              this.isAnneeScolaire = true;
              this.semestreSelected = 'Semestre 1';
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Ajout impossible', detail: 'Vous êtes hors année scolaire, impossible d\'ajouter une note!' });
            }
          }),
          ((error) => { console.error(error); })
        );
      }
    }
    this.dropdownEtudiant = []
    this.etudiantService.getAllByClasseId(this.classeSelected._id).subscribe(r => {
      r.forEach(etu => {
        let by_pass: any = etu.user_id
        if (by_pass)
          this.dropdownEtudiant.push({ label: by_pass.lastname + " " + by_pass.firstname, value: etu._id })
      })
    })

    //Recuperation de la liste des examens via l'id de la classe
    this.examenService.getAllByClasseId(this.classeSelected._id).subscribe(
      ((response) => {

        this.dropdownExamByClasse = [];

        response.forEach((examen) => {
          for (let matiere in this.matieres) {
            if (examen.matiere_id.includes(this.matieres[matiere]._id)) {
              this.dropdownExamByClasse.push({
                libelle: examen.libelle,
                value: examen._id,
              });
            }
          }

        });


        this.showFormSelectClasse = false;
        this.showFormSelectExam = true;

      }),
      ((error) => { console.error(error); })
    );

  }


  //Methode de recuperation de l'examen et affichage de la table d'attribution de note
  onSelectExam() {
    for (let exam in this.examens) {
      if (this.examens[exam]._id == this.formSelectExam.get('examen').value.value) {
        this.examSelected = this.examens[exam];
      }
    }

    //Requete de recuperation des notes par classe et par semestre
    this.noteService.getAllByExamenID(this.examSelected._id).subscribe(
      ((response) => {
        this.notesByClasseBySemestre = response;
      }),
      ((error) => { console.error(error); })
    );

    this.showTableAddnotes = true;
    this.showFormSelectExam = false;
    this.formSelectExam.reset();

  }


  //Methode d'ajout d'une note par exam par semestre et par classe
  onAddNoteByClasseByExam() {
    //Recuperation des infos du formulaire
    let note_val = this.formAddNoteByClasseByExam.get('note_val').value;
    let etudiant_id = this.formAddNoteByClasseByExam.get('etudiant_id').value;
    let appreciation = this.formAddNoteByClasseByExam.get('appreciation').value;
    let isAbsent = this.formAddNoteByClasseByExam.get('isAbsent').value;

    let classe_id = this.classeSelected._id;
    let matiere_id = this.examSelected.matiere_id;




    this.examenService.getById(this.examSelected._id).subscribe(
      ((response) => {

        //verification si la note max n'est pas depassé
        if (response.note_max < note_val) {

          this.messageService.add({
            severity: "error",
            summary: "Impossible d'attribuer une note, la note maximale pour cette évaluation est " + response.note_max,
          });

        }
        else {

          this.noteService.verifNoteByIdBySemestreByExam(etudiant_id, this.semestreSelected, this.examSelected._id).subscribe(
            ((response) => {
              if (response.error) {

                this.messageService.add({
                  severity: "error",
                  summary: "Impossible d'attribuer une note, l'étudiant possède déjà une note pour ce module durant ce sémestre",
                });

              }
              else if (response.success) {
                //Création de la nouvelle note à créer dans la BD 
                //Pas tester
                this.etudiantService.getMatiereByMatiereListAndEtudiantID(etudiant_id, matiere_id).subscribe(module_id => {
                  let note = new Note(null, note_val, this.semestreSelected, etudiant_id, this.examSelected._id, appreciation, classe_id, module_id._id, isAbsent);

                  this.noteService.create(note).subscribe(
                    ((response) => {
                      this.messageService.add({
                        severity: "success",
                        summary: "Nouvelle note attribuée",
                      });

                      //Recuperation de la liste des notes
                      this.noteService.getAllPopulate().subscribe(
                        ((response) => {
                          this.notes = response;
                        }),
                        ((error) => { console.error(error); })
                      );
                      //Requete de recuperation des notes par classe et par semestre
                      this.noteService.getAllByExamenID(this.examSelected._id).subscribe(
                        ((response) => {
                          this.notesByClasseBySemestre = response;
                        }),
                        ((error) => { console.error(error); })
                      );

                    }),
                    ((error) => {
                      this.messageService.add({
                        severity: "error",
                        summary: "Impossible d'attribuer une note, veuillez contacter un administrateur.",
                      });
                    })
                  );
                })

              }
            }),
            ((error) => { console.error(error); })
          );

        }
      }),
      ((error) => { console.error(error); })
    );
  }


  //Methode de mise à jour d'une note
  onUpdateNote() {
    //Recuperation des données du formulaire
    let note_val = this.formUpdateNote.get('note_val').value;
    let semestre = this.formUpdateNote.get('semestre').value.value;
    let etudiant_id = this.formUpdateNote.get('etudiant_id').value;
    let examen_id = this.formUpdateNote.get('examen_id').value.value;
    let appreciation = this.formUpdateNote.get('appreciation').value;

    let classe_id: string;
    let matiere_id: string[];

    for (let exam in this.examens) {
      if (this.examens[exam]._id == examen_id) {
        classe_id = this.examens[exam].classe_id[0]; //TODO
        matiere_id = this.examens[exam].matiere_id;
      }
    }

    //verification si la note max n'est pas depassé
    this.examenService.getById(examen_id).subscribe(
      ((response) => {

        if (response.note_max >= note_val) {
          //Création de la nouvelle note à créer dans la BD
          this.etudiantService.getMatiereByMatiereListAndEtudiantID(etudiant_id, matiere_id).subscribe(module_id => {
            let note = new Note(this.noteToUpdate._id, note_val, semestre, etudiant_id, examen_id, appreciation, classe_id, module_id._id);

            this.noteService.update(note).subscribe(
              ((response) => {
                this.messageService.add({
                  severity: "success",
                  summary: "Note modifiée",
                });

                //Recuperation de la liste des notes
                this.noteService.getAllPopulate().subscribe(
                  ((response) => {
                    this.notes = response;
                  }),
                  ((error) => { console.error(error); })
                );
                //Requete de recuperation des notes par classe et par semestre
                this.noteService.getAllByExamenID(this.examSelected._id).subscribe(
                  ((response) => {
                    this.notesByClasseBySemestre = response;
                  }),
                  ((error) => { console.error(error); })
                );

                this.showFormUpdateNote = false;
                this.formUpdateNote.reset()

              }),
              ((error) => {
                this.messageService.add({
                  severity: "error",
                  summary: "Impossible de modifier la note",
                });
              })
            );
          })
        }
        else {
          this.messageService.add({
            severity: "error",
            summary: "Impossible d'attribuer une note, la note maximale pour cette évaluation est " + response.note_max,
          });
        }
      }),
      ((error) => { console.error(error); })
    );


  }


  //Recuperation de la note à modifier
  onGetById() {

    let firstname: string;
    let lastname: string;

    if (this.etudiantToUpdate.user_id == this.users[this.etudiantToUpdate.user_id]._id) {
      firstname = this.users[this.etudiantToUpdate.user_id].firstname;
      lastname = this.users[this.etudiantToUpdate.user_id].lastname;
    }

    this.formUpdateNote.patchValue({

      examen_id: {
        libelle: this.examenToUpdate,
        value: this.noteToUpdate.examen_id
      },
      note_val: this.noteToUpdate.note_val,
      semestre: {
        libelle: this.noteToUpdate.semestre,
        value: this.noteToUpdate.semestre
      },
      etudiant_id: {
        libelle: firstname + ' ' + lastname,
        value: this.noteToUpdate.etudiant_id
      },
      appreciation: this.noteToUpdate.appreciation,
    });

  }


  //Partie dedié à la génération de bulletin de notes
  onInitFormGenerateBulletin() {
    this.formGenerateBulletin = this.fromBuilder.group({
      classe: ['', Validators.required],
      semestre: ['', Validators.required]
    });
  }

  onGenerateClasse() {
    //recuperation des infos de la classe en question
    this.classeService.getPopulate(this.formGenerateBulletin.get('classe').value.value).subscribe(
      ((response) => {
        this.classeForBGenerateBulletin = response.diplome_id;
      }),
      ((error) => { console.error(error); })
    );


    //Recuperation de la liste des étudiants via l'id de la classe
    this.etudiantService.getAllByClasseId(this.formGenerateBulletin.get('classe').value.value).subscribe(
      ((response) => {
        this.etudiantFromClasse = response;
        this.semestreForGenerateBulletin = this.formGenerateBulletin.get('semestre').value.value;

        this.showFormGenerateBulletin = false;
        this.showGenerateBulletin = true;
      }),
      ((error) => { console.error(error); })
    );
  }


  onGetNotes() {
    //Recuperation de la liste des notes d'un etudiant Par Idrissa
    this.notesForGenerateBulletin = []
    this.noteService.getAllByIdBySemestre(this.etudiantToGenerateBulletin._id, this.semestreForGenerateBulletin).subscribe(
      ((responseNoteEtudiant) => {
        // Récuperation du campus actuelle
        for (let diplome in this.diplomes) {
          if (this.diplomes[diplome]._id == this.classes[this.etudiantToGenerateBulletin.classe_id].diplome_id) {
            for (let campus in this.campus) {
              if (this.diplomes[diplome].campus_id.includes(this.campus[campus]._id)) {
                this.activeCampus = this.campus[campus];
              }
            }
          }
        }
        /* end */

        let sumCoef = 0;
        let sumEtu = 0;

        for (let note in responseNoteEtudiant) {
          sumEtu += parseFloat(responseNoteEtudiant[note].note_val) * parseFloat(this.examens[responseNoteEtudiant[note].examen_id].coef);
          sumCoef += parseFloat(this.examens[responseNoteEtudiant[note].examen_id].coef);
        }

        responseNoteEtudiant.forEach(notefromdb => {

          this.noteService.getAllByClasseBySemestreByExam(this.semestreForGenerateBulletin, this.etudiantToGenerateBulletin.classe_id, notefromdb.examen_id).subscribe(
            ((responseNoteClasse) => {

              let noteTab = [];
              let sum = 0;
              let cpt = 0;

              for (let note in responseNoteClasse) {
                noteTab.push(parseFloat(responseNoteClasse[note].note_val));
                sum += parseFloat(responseNoteClasse[note].note_val);
                cpt++;
              }

              this.moyEtudiant = sumEtu / sumCoef;

              this.notesForGenerateBulletin.push({ '_id': notefromdb._id, 'note_val': notefromdb.note_val, 'semestre': notefromdb.semestre, 'etudiant_id': notefromdb.etudiant_id, 'examen_id': notefromdb.examen_id, 'appreciation': notefromdb.appreciation, 'moyPromo': sum / cpt, 'maxPromo': Math.max(...noteTab), 'minPromo': Math.min(...noteTab) });

            }),
            ((error) => { console.error(error); })
          );

        });

      }),
      ((error) => { console.error(error); })
    );

  }

  GenerateBulletin2(etudiant_id, semestre) {
    //Par Morgan
    this.notesForGenerateBulletin = []
    if (semestre != "Annuel") {
      this.semestreChoose = semestre
      this.etudiantService.getBulletin(etudiant_id, semestre).subscribe(data => {
        this.moyEtudiant = data.moyenneEtudiant
        this.notesForGenerateBulletin = data.data
        this.showBulletin = true
        this.onGetAppreciationGenerale(data.haveDispensed)
      }, error => {
        console.error(error)
      })
      this.etudiantService.getById(etudiant_id).subscribe(data => {
        this.etudiantToGenerateBulletin = data
        this.seanceService.getFormateurFromClasseID(data.classe_id, semestre).subscribe(d => {
          this.dicFormateurMatiere = d
        })
      })
    } else {
      this.semestreChoose = "Annuel"
      this.GenerateBulletinAnnuel(etudiant_id)
    }
  }

  GenerateBulletinAnnuel(etudiant_id) {
    //Par Morgan
    this.notesForGenerateBulletin = []
    this.etudiantService.getBulletin(etudiant_id, 'Semestre 1').subscribe(dataS1 => {
      this.moyEtudiantAnnuel['Semestre 1'] = dataS1.moyenneEtudiant
      let notesS1 = dataS1.data
      this.etudiantService.getBulletin(etudiant_id, 'Semestre 2').subscribe(dataS2 => {
        this.moyEtudiantAnnuel['Semestre 2'] = dataS2.moyenneEtudiant
        this.moyEtudiantAnnuel['Annuel'] = this.getMoyAnnuel(dataS1.moyenneEtudiant, dataS2.moyenneEtudiant)
        let notesS2 = dataS2.data
        console.log(notesS1, notesS2)
        dataS1.data.forEach(NS1 => {
          dataS2.data.forEach(NS2 => {
            if (NS1.matiere_id == NS2.matiere_id) {
              this.notesForGenerateBulletin.push({ "Semestre 1": NS1, "Semestre 2": NS2, "Annuel": this.getNoteAnnuel(NS1, NS2), 'matiere_name': NS1.matiere_name, 'coef': NS1.coef, 'matiere_id': NS1.matiere_id, 'ects': NS1.ects })
              notesS1.splice(notesS1.indexOf(NS1), 1)
              notesS2.splice(notesS2.indexOf(NS2), 1)
            }
          })
        })
        if (notesS1.length != 0) {
          notesS1.forEach(n => {
            this.notesForGenerateBulletin.push({ "Semestre 1": n, "Semestre 2": null, "Annuel": n, 'matiere_name': n.matiere_name, 'coef': n.coef, 'matiere_id': n.matiere_id, 'ects': n.ects })
          })
        }
        if (notesS2.length != 0) {
          notesS2.forEach(n => {
            this.notesForGenerateBulletin.push({ "Semestre 1": null, "Semestre 2": n, "Annuel": n, 'matiere_name': n.matiere_name, 'coef': n.coef, 'matiere_id': n.matiere_id, 'ects': n.ects })
          })
        }
        console.log(notesS2, notesS1)
        this.showPVAnnuel = true
        this.onGetAppreciationGenerale(dataS1.haveDispensed || dataS2.haveDispensed)
      }, error => {
        console.error(error)
      })
    }, error => {
      console.error(error)
    })
    this.etudiantService.getById(etudiant_id).subscribe(data => {
      this.etudiantToGenerateBulletin = data
      this.seanceService.getFormateurFromClasseID(data.classe_id, "Annuel").subscribe(d => {
        this.dicFormateurMatiere = d
      })
    })
    /*this.etudiantService.getBulletinAnnuel(etudiant_id).subscribe(data => {
      console.log(data)
      this.moyEtudiant = data.moyenneEtudiant
      this.notesForGenerateBulletin = data.data
      this.showPVAnnuel = true
    }, error => {
      console.error(error)
    })
    this.etudiantService.getById(etudiant_id).subscribe(data => {
      this.etudiantToGenerateBulletin = data
      this.seanceService.getFormateurFromClasseID(data.classe_id, "Annuel").subscribe(d => {
        this.dicFormateurMatiere = d
      })
    })*/
  }

  getMoyAnnuel(ns1: number, ns2: number) {
    console.log(ns1, ns2)
    let moy_etu = (ns1 + ns2) / 2
    if (ns1 == 0.00000000001) {
      moy_etu = ns2
    }
    else if (ns2 == 0.00000000001) {
      moy_etu = ns1
    }
    return moy_etu
  }

  getNoteAnnuel(ns1: { coef: number, isDispensed: Boolean, matiere_id: string, matiere_name: string, max_classe: number, min_classe: number, moy_classe: number, moy_etu: number }, ns2: { coef: number, isDispensed: Boolean, matiere_id: string, matiere_name: string, max_classe: number, min_classe: number, moy_classe: number, moy_etu: number }) {
    let moy_etu = (ns1.moy_etu + ns2.moy_etu) / 2
    if (ns1.moy_etu == 0.00000000001) {
      moy_etu = ns2.moy_etu
    }
    else if (ns2.moy_etu == 0.00000000001) {
      moy_etu = ns1.moy_etu
    }
    return {
      coef: ns1.coef, isDispensed: ns1.isDispensed && ns2.isDispensed, matiere_id: ns1.matiere_id, matiere_name: ns1.matiere_name,
      max_classe: (ns1.max_classe + ns2.max_classe) / 2, min_classe: (ns1.min_classe + ns2.min_classe) / 2, moy_classe: (ns1.moy_classe + ns2.moy_classe) / 2,
      moy_etu: moy_etu
    }

  }

  avg(arr: [number]) {
    let total = 0.0
    arr.forEach(nb => {
      total += nb
    })
    return total / arr.length
  }
  //Methode d'initialisation du formulaire de saisie d'appréciation générale
  onInitFormAppreciationGenerale() {
    this.formAppreciationGenerale = this.fromBuilder.group({
      appreciation: ['', Validators.required],
    });
  }

  //Methode d'initialisation du formulaire de mise à jour d'une appréciation
  onInitFormUpdateAppreciationGenerale() {
    this.formUpdateAppreciationGenerale = this.fromBuilder.group({
      appreciation: ['', Validators.required],
    });
  }


  //Methode de saisie d'appreciation générale
  onSetAppreciationGenerale() {
    //Recuperation des données du formulaire de saisie d'appréciation
    let appr = this.formAppreciationGenerale.get('appreciation').value;

    //Stockage de l'appreciation dans la BD
    let appreciation = new Appreciation(null, appr, this.semestreForGenerateBulletin, this.etudiantToGenerateBulletin._id, this.appreciationModules);

    this.appreciationService.create(appreciation).subscribe(
      ((response) => {
        this.appreciationGenerale = response;
        this.showAppreciationGenerale = true;
        this.showBtnAddAppreciationGenerale = false;
        this.showBtnUpdateAppreciationGenerale = true;
        this.showFormUpdateAppreciationGenerale = false;
        this.showGenerateBulletin = true;
        this.showFormAppreciationGenerale = false
        this.messageService.add({ severity: 'success', summary: 'Mis à jour de l\'appréciation globale avec succès' })
        if (response.appreciation_matiere)
          this.appreciationModules = response.appreciation_matiere
      }),
      ((error) => { console.error(error); })
    );

  }


  //Methode de mise à jour d'une appreciation générale
  onUpdateAppreciationGenerale() {
    let appr = this.formUpdateAppreciationGenerale.get('appreciation').value;

    let appreciation = new Appreciation(this.appreciationToUpdate._id, appr, this.appreciationToUpdate.semestre, this.appreciationToUpdate.etudiant_id, this.appreciationModules);

    this.appreciationService.update(appreciation).subscribe(
      ((response) => {
        this.appreciationGenerale = response;
        this.showAppreciationGenerale = true;
        this.showBtnAddAppreciationGenerale = false;
        this.showBtnUpdateAppreciationGenerale = true;
        this.showFormUpdateAppreciationGenerale = false;
        this.showGenerateBulletin = true;
        if (response.appreciation_matiere)
          this.appreciationModules = response.appreciation_matiere
      }),
      ((error) => { console.error(error); })
    );
  }


  //Recuperation de l'appreciation générale
  onGetAppreciationGenerale(haveDispensed = false) {
    this.appreciationModules = {}
    this.appreciationGenerale = {}
    this.appreciationService.get(this.etudiantToGenerateBulletin._id, this.semestreForGenerateBulletin).subscribe(
      ((response) => {
        if (response != null && response.appreciation != "") {
          this.appreciationGenerale = response;
          this.showBtnAddAppreciationGenerale = false;
          this.showBtnUpdateAppreciationGenerale = true;
          if (response.appreciation_matiere)
            this.appreciationModules = response.appreciation_matiere
          this.formUpdateAppreciationGenerale.patchValue({ appreciation: response.appreciation });
        }

        if (response == null || response.appreciation == "") {
          //Si semesestre Validé : Semestre Validée
          if (this.moyEtudiant && this.semestreChoose != "Annuel" && this.moyEtudiant >= 10)
            this.appreciationGenerale = new Appreciation(null, "Semestre Validé", this.semestreChoose, null, null)
          if (this.moyEtudiant && this.semestreChoose != "Annuel" && this.moyEtudiant < 10)
            this.appreciationGenerale = new Appreciation(null, "Semestre Non Validé", this.semestreChoose, null, null)
          //Si Année validé : Année Validée
          if (this.moyEtudiantAnnuel['Annuel'] && this.semestreChoose == "Annuel" && this.moyEtudiantAnnuel['Annuel'] >= 10)
            this.appreciationGenerale = new Appreciation(null, "Année Validée", "Annuel", null, null)
          if (this.moyEtudiantAnnuel['Annuel'] && this.semestreChoose == "Annuel" && this.moyEtudiantAnnuel['Annuel'] < 10)
            this.appreciationGenerale = new Appreciation(null, "Année Non Validée", "Annuel", null, null)
          //Si validé avec Rachat: Année Validée avec Rachat
          if (haveDispensed)
            this.appreciationGenerale.appreciation = this.appreciationGenerale.appreciation + " avec rachat"
          console.log(this.appreciationGenerale)
        }
        this.showAppreciationGenerale = true;
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode de remise à null de l'appreciation generale
  onNullAppreciationGenerale() {
    this.appreciationGenerale = null;
    this.showAppreciationGenerale = false;
    this.showBtnAddAppreciationGenerale = true;
    this.showBtnUpdateAppreciationGenerale = false;
  }
  hideBtn = false

  //Methode de generation du bulletin de note
  onGenerateBulletin(id = 'content') {
    console.log(this.etudiantToGenerateBulletin)
    if ((this.etudiantToGenerateBulletin.statut_dossier && this.etudiantToGenerateBulletin.statut_dossier.includes('Dossier complet')) || confirm("Le dossier n'est pas complet\nVoulez-vous quand même générer le bulletin de note ?")) {
      this.hideBtn = true
      var element = document.getElementById(id);
      var opt = {
        margin: 0,
        filename: 'bulletin.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
      this.hideBtn = false
      this.etudiantService.downloadBulletin(this.etudiantToGenerateBulletin._id).subscribe(doc => {

      }, err => {
        console.error(err)
      })
    }
  }

  getBulletin(rowData: Note) {
    this.etudiantService.getBulletin(rowData.etudiant_id, rowData.semestre).subscribe(data => {
      console.log(data)
    })
  }

}