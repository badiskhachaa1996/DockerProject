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

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notes: Note[] = [];

  formAddNote: FormGroup;
  showFormAddNote: boolean = false;
  showBulletin: boolean = false
  formUpdateNote: FormGroup;
  showFormUpdateNote: boolean = false;

  users: User[] = [];
  userList: any[] = [];

  etudiants: Etudiant[] = [];
  dropdownEtudiant: any[] = [{ libelle: '', value: '' }];

  examens: Examen[] = [];
  dropdownExamen: any[] = [{ libelle: '', value: '' }];

  dropdownClasse: any[] = [{ libelle: 'Toutes les classes', value: null }];
  classes: Classe[] = [];

  //Données de la dropdown semestre
  dropdownSemestre: any = [
    { libelle: '', value: '' },
    { libelle: 'Semestre 1', value: 'Semestre 1' },
    { libelle: 'Semestre 2', value: 'Semestre 2' },
    { libelle: 'Semestre 3', value: 'Semestre 3' }
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

  dropdownExamByClasse: any[] = [{ libelle: '', value: '' }];


  //Données liées à la modification d'une note
  noteToUpdate: Note;
  idNoteToUpdate: string;

  examenToUpdate: Examen;
  etudiantToUpdate: Etudiant;

  matieres: Matiere[] = [];

  //Génération bulletins de notes
  formGenerateBulletin: FormGroup;
  showFormGenerateBulletin: boolean = false;
  classeForBGenerateBulletin: Classe;
  etudiantFromClasse: Etudiant[] = [];
  etudiantToGenerateBulletin: Etudiant;
  notesForGenerateBulletin: any[] = [];
  notesBySemestre: Note[] = [];
  matiere_id: string;
  moyEtudiant: number;
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

  constructor(private appreciationService: AppreciationService, private diplomeService: DiplomeService, private campusService: CampusService, private anneeScolaireService: AnneeScolaireService, private matiereService: MatiereService, private classeService: ClasseService, private examenService: ExamenService, private etudiantService: EtudiantService, private fromBuilder: FormBuilder, private messageService: MessageService, private userService: AuthService, private noteService: NoteService) { }

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
      }),
      ((error) => { console.error(error); })
    );

    //recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.nom, value: classe._id });
          this.classes[classe._id] = classe;
        })

      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des notes
    this.noteService.getAll().subscribe(
      ((response) => {
        this.notes = response;
      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des étudiants
    this.userService.getAll().subscribe(
      ((responseUser) => {

        this.etudiantService.getAll().subscribe(
          ((responseEt) => {

            responseEt.forEach(etudiant => {
              responseUser.forEach(user => {
                this.users[user._id] = user;
                if (user._id == etudiant.user_id) {
                  this.dropdownEtudiant.push({ libelle: user.firstname + ' ' + user.lastname, value: etudiant._id });
                  this.etudiants[etudiant._id] = etudiant;
                }
              });
            });

          }),
          ((error) => { console.error(error); })
        );

      }),
      ((error) => { console.error(error); })
    );





    this.matiereService.getAll().subscribe(
      (responseM) => {


        this.examenService.getAllEvaluation().subscribe(
          (responseE) => {
            responseE.forEach((examen) => {

              responseM.forEach((matiere) => {
                this.matieres[matiere._id] = matiere;

                if (matiere._id == examen.matiere_id) {
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
    this.onInitFormAddNote();
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
      classe: ['', Validators.required],
      semestre: ['', Validators.required],
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
      note_val: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      etudiant_id: ['', Validators.required],
      appreciation: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàù .]+$")]],
    });
  }

  //Methode d'initialisation du formulaire d'ajout de notes
  onInitFormAddNote() {
    this.formAddNote = this.fromBuilder.group({
      note_val: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      semestre: ['', Validators.required],
      etudiant_id: ['', Validators.required],
      examen_id: ['', Validators.required],
      appreciation: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàù .]+$")]],
    });
  }

  //pour la partie de traitement des erreurs sur le formulaire
  get note_val() {
    return this.formAddNote.get("note_val");
  }
  get appreciation() {
    return this.formAddNote.get("appreciation");
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
    this.semestreSelected = this.formSelectClasse.get('semestre').value.value;

    //Selection de la classe 
    for (let classe in this.classes) {
      if (this.classes[classe]._id == this.formSelectClasse.get('classe').value.value) {
        this.classeSelected = this.classes[classe];
      }
    }

    //Recuperation de la liste des examens via l'id de la classe
    this.examenService.getAllByClasseId(this.classeSelected._id).subscribe(
      ((response) => {

        this.dropdownExamByClasse = [{ libelle: '', value: '' }];

        response.forEach((examen) => {
          for (let matiere in this.matieres) {
            if (examen.matiere_id == this.matieres[matiere]._id) {
              this.dropdownExamByClasse.push({
                libelle: this.matieres[matiere].nom,
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
    this.noteService.getAllByClasseBySemestre(this.classeSelected._id, this.semestreSelected).subscribe(
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
    let etudiant_id = this.formAddNoteByClasseByExam.get('etudiant_id').value.value;
    let appreciation = this.formAddNoteByClasseByExam.get('appreciation').value;

    let classe_id = this.classeSelected._id;
    let matiere_id = this.examSelected.matiere_id;


    this.examenService.getById(this.examSelected._id).subscribe(
      ((response) => {

        //verification si la note max n'est pas depassé
        if (response.note_max < note_val) {

          this.messageService.add({
            severity: "error",
            summary: "Impossible d'attribuer une note, la note maximale pour cet examen est " + response.note_max,
          });

        }
        else {

          this.noteService.verifNoteByIdBySemestreByExam(etudiant_id, this.semestreSelected, this.examSelected._id).subscribe(
            ((response) => {
              if (response.error) {

                this.messageService.add({
                  severity: "error",
                  summary: "Impossible d'attribuer une note, l'étudiant possède déjà une note pour cette matière durant ce sémestre",
                });

              }
              else if (response.success) {
                //Création de la nouvelle note à créer dans la BD
                let note = new Note(null, note_val, this.semestreSelected, etudiant_id, this.examSelected._id, appreciation, classe_id, matiere_id);

                this.noteService.create(note).subscribe(
                  ((response) => {
                    this.messageService.add({
                      severity: "success",
                      summary: "Nouvelle note attribuée",
                    });

                    //Recuperation de la liste des notes
                    this.noteService.getAll().subscribe(
                      ((response) => {
                        this.notes = response;
                      }),
                      ((error) => { console.error(error); })
                    );

                    this.showFormAddNote = false;
                    this.formAddNote.reset();

                  }),
                  ((error) => {
                    this.messageService.add({
                      severity: "error",
                      summary: "Impossible d'attribuer une note, veuillez contacter un administrateur.",
                    });
                  })
                );
              }
            }),
            ((error) => { console.error(error); })
          );

        }
      }),
      ((error) => { console.error(error); })
    );
  }


  //Methode d'ajout d'une note
  onAddNote() {
    //Recuperation des infos du formulaire
    let note_val = this.formAddNote.get('note_val').value;
    let semestre = this.formAddNote.get('semestre').value.value;
    let etudiant_id = this.formAddNote.get('etudiant_id').value.value;
    let examen_id = this.formAddNote.get('examen_id').value.value;
    let appreciation = this.formAddNote.get('appreciation').value;

    let classe_id: string;
    let matiere_id: string;

    for (let exam in this.examens) {
      if (this.examens[exam]._id == examen_id) {
        classe_id = this.examens[exam].classe_id;
        matiere_id = this.examens[exam].matiere_id;
      }
    }

    this.examenService.getById(examen_id).subscribe(
      ((response) => {

        //verification si la note max n'est pas depassé
        if (response.note_max < note_val) {

          this.messageService.add({
            severity: "error",
            summary: "Impossible d'attribuer une note, la note maximale pour cet examen est " + response.note_max,
          });

        }
        else {

          //Création de la nouvelle note à créer dans la BD
          let note = new Note(null, note_val, semestre, etudiant_id, examen_id, appreciation, classe_id, matiere_id);

          this.noteService.create(note).subscribe(
            ((response) => {
              this.messageService.add({
                severity: "success",
                summary: "Nouvelle note attribuée",
              });

              //Recuperation de la liste des notes
              this.noteService.getAll().subscribe(
                ((response) => {
                  this.notes = response;
                }),
                ((error) => { console.error(error); })
              );

              this.showFormAddNote = false;
              this.formAddNote.reset();

            }),
            ((error) => {
              this.messageService.add({
                severity: "error",
                summary: "Impossible d'attribuer une note, veuillez contacter un administrateur.",
              });
            })
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
    let etudiant_id = this.formUpdateNote.get('etudiant_id').value.value;
    let examen_id = this.formUpdateNote.get('examen_id').value.value;
    let appreciation = this.formUpdateNote.get('appreciation').value;

    let classe_id: string;
    let matiere_id: string;

    for (let exam in this.examens) {
      if (this.examens[exam]._id == examen_id) {
        classe_id = this.examens[exam].classe_id;
        matiere_id = this.examens[exam].matiere_id;
      }
    }

    //verification si la note max n'est pas depassé
    this.examenService.getById(examen_id).subscribe(
      ((response) => {

        if (response.note_max >= note_val) {
          //Création de la nouvelle note à créer dans la BD
          let note = new Note(this.noteToUpdate._id, note_val, semestre, etudiant_id, examen_id, appreciation, classe_id, matiere_id);

          this.noteService.update(note).subscribe(
            ((response) => {
              this.messageService.add({
                severity: "success",
                summary: "Note modifiée",
              });

              //Recuperation de la liste des notes
              this.noteService.getAll().subscribe(
                ((response) => {
                  this.notes = response;
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
        }
        else {
          this.messageService.add({
            severity: "error",
            summary: "Impossible d'attribuer une note, la note maximale pour cet examen est " + response.note_max,
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
    this.classeService.get(this.formGenerateBulletin.get('classe').value.value).subscribe(
      ((response) => {
        this.classeForBGenerateBulletin = response;
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
    this.noteService.getAllByIdBySemestre(this.etudiantToGenerateBulletin._id, this.semestreForGenerateBulletin).subscribe(
      ((responseNoteEtudiant) => {
        // Récuperation du campus actuelle
        for (let diplome in this.diplomes) {
          if (this.diplomes[diplome]._id == this.classes[this.etudiantToGenerateBulletin.classe_id].diplome_id) {
            for (let campus in this.campus) {
              if (this.campus[campus]._id == this.diplomes[diplome].campus_id) {
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
    this.etudiantService.getBulletin(etudiant_id, semestre).subscribe(data => {
      data.listMatiere.forEach(matiere => {
        this.notesForGenerateBulletin.push({ 'note_val': data.MoyenneEtudiant[matiere], 'semestre': semestre, 'etudiant_id': etudiant_id, "matiere_id": matiere, /*'appreciation': notefromdb.appreciation,*/ 'moyPromo': this.avg(data.dicMoyMatiere[matiere]), 'maxPromo': Math.max(data.dicMoyMatiere[matiere]), 'minPromo': Math.min(data.dicMoyMatiere[matiere]) });
      })
    }, error => {
      console.error(error)
    })
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
    let appreciation = new Appreciation(null, appr, this.semestreForGenerateBulletin, this.etudiantToGenerateBulletin._id);

    this.appreciationService.create(appreciation).subscribe(
      ((response) => {
        this.appreciationGenerale = response;
        this.onGetNotes();
        this.onGetAppreciationGenerale();
        this.showBulletin = true;
        this.showGenerateBulletin = true;
        this.showFormAppreciationGenerale = false;
        this.showBtnUpdateAppreciationGenerale = true;
      }),
      ((error) => { console.error(error); })
    );

  }


  //Methode de mise à jour d'une appreciation générale
  onUpdateAppreciationGenerale() {
    let appr = this.formUpdateAppreciationGenerale.get('appreciation').value;

    let appreciation = new Appreciation(this.appreciationToUpdate._id, appr, this.appreciationToUpdate.semestre, this.appreciationToUpdate.etudiant_id);

    this.appreciationService.update(appreciation).subscribe(
      ((response) => {
        this.appreciationGenerale = response;
        this.showAppreciationGenerale = true;
        this.showBtnAddAppreciationGenerale = false;
        this.showBtnUpdateAppreciationGenerale = true;
        this.showFormUpdateAppreciationGenerale = false;
        this.showGenerateBulletin = true;
      }),
      ((error) => { console.error(error); })
    );
  }


  //Recuperation de l'appreciation générale
  onGetAppreciationGenerale() {
    this.appreciationService.get(this.etudiantToGenerateBulletin._id, this.semestreForGenerateBulletin).subscribe(
      ((response) => {
        if (response != null) {
          this.appreciationGenerale = response;
          this.showAppreciationGenerale = true;
          this.showBtnAddAppreciationGenerale = false;
          this.showBtnUpdateAppreciationGenerale = true;

          this.formUpdateAppreciationGenerale.patchValue({ appreciation: response.appreciation });
        }
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


  //Methode de generation du bulletin de note
  onGenerateBulletin() {

    var element = document.getElementById('content');
    var opt = {
      margin: 0,
      filename: 'bulletin.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();

  }

  getBulletin(rowData: Note) {
    this.etudiantService.getBulletin(rowData.etudiant_id, rowData.semestre).subscribe(data => {
      console.log(data)
    })
  }

}