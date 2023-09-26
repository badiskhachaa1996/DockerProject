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
import { SeanceService } from 'src/app/services/seance.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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
  importExcel = false

  users: User[] = [];
  formateurs: Formateur[] = [];

  matieres = {};
  dropdownClasse: any[] = [];
  dropdownMatiere: any[] = [];
  idMatiereToUpdate: Matiere[];

  classes = {};
  dropdownGroupe: any[] = [{ label: 'Tous les groupes', value: null }];//Filtre
  dropdownModule: any[] = [{ label: 'Tous les modules', value: null }];//Filtre
  defaultdropdownModule = this.dropdownModule
  idClasseToUpdate: Classe[];

  dropdownFormateur: any[] = [];
  filterFormateur: any[] = [{ label: 'Tous les formateurs', value: null }];
  defaultFilterFormateur = this.filterFormateur
  formateurToUpdate: Formateur;


  dropdownNiveau: any[] = [
    { label: "Control Continu", value: "Control Continu" },
    { label: "Examen final", value: "Examen final" },
    { label: "BTS Blanc", value: "BTS Blanc" },
    { label: "Projet Professionel", value: "Projet Professionel" }
  ]

  dropdownType: any[] = [
    { label: "Ponctuelle orale", value: "Ponctuelle orale" },
    { label: "Ponctuelle écrite", value: "Ponctuelle écrite" },
    { label: "Épreuve ponctuelle pratique et orale", value: "Épreuve ponctuelle pratique et orale" },
    { label: "Ponctuelle écrite orale", value: "Ponctuelle écrite orale" }
  ]

  dropdownSemestre = [
    { label: 'Semestre 1', value: 'Semestre 1' },
    { label: 'Semestre 2', value: 'Semestre 2' },
  ]
  showAppreciation = false

  formAppreciation = this.formBuilder.group({
    classe_id: [
      "", Validators.required]
  });
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
    private EtudiantService: EtudiantService,
    private SeanceService: SeanceService
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
                if (user && user._id == formateur.user_id) {
                  this.dropdownFormateur.push({
                    label: user?.firstname + " " + user?.lastname,
                    value: formateur._id,
                  });
                  this.formateurs[formateur._id] = formateur;
                  this.filterFormateur.push({
                    label: user?.firstname + " " + user?.lastname,
                    value: formateur._id,
                  })
                }
              });
            });
            this.defaultFilterFormateur = this.filterFormateur
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
        this.matiereService.getAllPopulate().subscribe(
          ((response) => {
            response.forEach((matiere) => {
              let bypa: any = matiere.formation_id
              if (Array.isArray(matiere.formation_id)) {
                this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
                this.dropdownModule.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
              } else {
                this.dropdownMatiere.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
                this.dropdownModule.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
              }
              this.matieres[matiere._id] = matiere;
            });
            this.defaultdropdownModule = this.dropdownModule
          }),
          ((error) => { console.error(error); })
        );


        //Recuperation de la liste des classes
        this.classeService.getAll().subscribe(
          ((response) => {
            response.forEach((classe) => {

              this.dropdownClasse.push({ label: classe.abbrv, value: classe._id });
              this.dropdownGroupe.push({ label: classe.abbrv, value: classe });
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
          this.defaultdropdownModule = this.dropdownModule
          r.groupes.forEach((g) => {
            this.dropdownClasse.push({ label: g.abbrv, value: g._id });
            this.dropdownGroupe.push({ label: g.abbrv, value: g });
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
        let m_id = []
        this.idMatiereToUpdate.forEach(mid => {
          m_id.push(mid._id)
        })
        this.formUpdateExamen.patchValue({
          classe_id: l_id,
          matiere_id: m_id,
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
  notes: Note[] = []
  loadNotes(examen) {
    this.notes = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      this.notes = notes
    })
  }

  examSelected: Examen = null
  notesByClasseBySemestre: Note[] = []

  tableauNotes = [];//{ etudiant: string, note: Number, appreciation: string, date_note: Date }
  loadEtudiantsForNote(examen: any) {
    this.tableauNotes = []
    this.examSelected = examen
    let classe_ids = []
    let oldNote = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      examen.classe_id.forEach(c => { classe_ids.push(c._id) })

      this.EtudiantService.getAllByMultipleClasseID(classe_ids).subscribe(etudiants => {
        notes.forEach(n => {
          let bypass: any = n.etudiant_id
          if (bypass && bypass.user_id) {
            oldNote.push(bypass._id)
            this.tableauNotes.push({
              id: bypass.custom_id,
              etudiant_f: bypass?.user_id?.firstname,
              etudiant_l: bypass?.user_id?.lastname,
              note: parseFloat(n.note_val),
              appreciation: n.appreciation,
              date_note: n.date_creation,
              _id: n._id,
              isAbsent: n.isAbsent,
              date_IMS: this.formatDate(bypass.user_id?.date_creation),
              date_TEAMS: this.formatDate(bypass.date_valided_by_support),
              matiere_id: examen.matiere_id[0]._id
            })
          }
        })
        etudiants.forEach(etu => {
          let bypass: any = this.examSelected.matiere_id
          let ids = bypass[0]._id
          if (oldNote.indexOf(etu._id) == -1 && etu.user_id)
            this.tableauNotes.push({
              id: etu.custom_id,
              etudiant_f: etu?.user_id?.firstname,
              etudiant_l: etu?.user_id?.lastname,
              note: NaN,
              appreciation: '',
              date_note: null,
              _id: etu.user_id._id + "NEW",
              etudiant_id: etu._id,
              examen_id: this.examSelected._id,
              classe_id: etu.classe_id._id,
              matiere_id: ids,
              isAbsent: false,
              semestre: this.examSelected.semestre,
              date_IMS: this.formatDate(etu.user_id?.date_creation),
              date_TEAMS: this.formatDate(etu.date_valided_by_support)
            })
        })
      })
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
          this.messageService.add({ severity: 'success', summary: "La note a été crée pour " + rowData.etudiant_f + " " + rowData.etudiant_l })
        }, err => {
          this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
          console.error(err)
        })
      } else {
        //C'est une mise à jour de Note
        this.NotesService.updateV2(note).subscribe(r => {
          this.tableauNotes[index] = rowData
          this.messageService.add({ severity: 'success', summary: "La note a été mis à jour pour " + rowData.etudiant_f + " " + rowData.etudiant_l })
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
      'Absence Justifiée',
      rowData.classe_id,
      rowData.matiere_id[0],
      true,
      new Date()
    )
    if (rowData._id.includes('NEW')) {
      //C'est un Nouvelle Note
      delete note._id
      this.NotesService.create(note).subscribe(r => {
        rowData._id = r._id
        this.tableauNotes[index] = rowData
        this.messageService.add({ severity: 'success', summary: "La note a été crée pour " + rowData.etudiant_f + " " + rowData.etudiant_l })
      }, err => {
        this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
        console.error(err)
      })
    } else {
      //C'est une mise à jour de Note
      this.NotesService.updateV2(note).subscribe(r => {
        this.tableauNotes[index] = rowData
        this.messageService.add({ severity: 'success', summary: "La note a été mis à jour pour " + rowData.etudiant_f + " " + rowData.etudiant_l })
      }, err => {
        this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
        console.error(err)
      })
    }
  }
  isNaN(value) { return (Number.isNaN(value)) }
  padTo2Digits(num) { return num.toString().padStart(2, '0'); }

  formatDate(date) {
    date = new Date(date)
    if (date != 'Invalid Date' && date.getFullYear() != '1970')
      return [this.padTo2Digits(date.getDate()), this.padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/');
    else return ''
  }

  formatClasse(classe_id) {
    return classe_id.map(function (item) { return item.abbrv; })
  }

  filterModuleByGroupe(classe_id, test) {
    if (!classe_id)
      this.dropdownModule = this.defaultdropdownModule
    else
      this.examenService.getModulesByGroupeID(classe_id._id).subscribe(modules => {
        this.dropdownModule = [{ label: 'Tous les modules', value: null }]
        modules.forEach(matiere => {
          let bypa: any = matiere.formation_id
          if (Array.isArray(matiere.formation_id))
            this.dropdownModule.push({ label: matiere.nom + ' - ' + bypa[0].titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
          else
            this.dropdownModule.push({ label: matiere.nom + ' - ' + bypa.titre + " - " + matiere.niveau + " - " + matiere.semestre, value: matiere._id });
        })
      })
  }

  filterFormateurByModule(module_id) {
    if (!module_id)
      this.filterFormateur = this.defaultFilterFormateur
    else
      this.examenService.getFormateurByModuleID(module_id).subscribe(formateurs => {
        this.filterFormateur = [{ label: 'Tous les formateurs', value: null }]
        formateurs.forEach(f => {
          if (f && f.user_id) {
            let user: any = f.user_id
            this.filterFormateur.push({
              label: user?.firstname + " " + user?.lastname,
              value: f._id,
            })
          }
        })
      })
  }

  exportExcel(examen) {
    let tableauNotes = []
    let classe_ids = []
    let oldNote = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      examen.classe_id.forEach(c => { classe_ids.push(c._id) })

      this.EtudiantService.getAllByMultipleClasseID(classe_ids).subscribe(etudiants => {
        notes.forEach(n => {
          let bypass: any = n.etudiant_id
          if (bypass && bypass.user_id) {
            oldNote.push(bypass._id)
            tableauNotes.push({
              id: bypass.custom_id,
              etudiant_f: bypass?.user_id?.firstname,
              etudiant_l: bypass?.user_id?.lastname,
              note: n.note_val,
              _id: n._id,
              isAbsent: n.isAbsent,
              Appreciation: n.appreciation
            })
          }
        })
        etudiants.forEach(etu => {
          if (oldNote.indexOf(etu._id) == -1 && etu.user_id)
            tableauNotes.push({
              id: etu.custom_id,
              etudiant_f: etu?.user_id?.firstname,
              etudiant_l: etu?.user_id?.lastname,
              note: '',
              _id: etu.user_id._id + "NEW",
              isAbsent: false,
              Appreciation: ''
            })
        })
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableauNotes);
        //const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet();
        const workbook: XLSX.WorkBook = { Sheets: { 'notes': worksheet }, SheetNames: ['notes'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const data: Blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        FileSaver.saveAs(data, "examen_template_" + examen.libelle + "_" + new Date().toLocaleDateString("fr-FR") + ".xlsx");
      })
    })
  }

  exportExel(examen) {
    let tableauNotes = []
    this.NotesService.getAllByExamenID(examen._id).subscribe(notes => {
      tableauNotes.push({
        'ID Etudiant': '',
        'Prénom': '',
        'Nom': '',
        'Note': '',
        'Appréciation': '',
        'Date de Notation': '',
        'Absence Justifié': '',
        '': '',
        'Formateur': examen.formateur_id?.user_id?.firstname + ' ' + examen.formateur_id?.user_id?.lastname,
        'Module': examen.matiere_id[0].abbrv,
        'Date de l\'éxamen': new Date(examen.date).toLocaleString('fr-FR'),
        'Filière': this.formatClasse(examen.classe_id).join(', '),
        'Semestre': examen.semestre
      })
      notes.forEach(n => {
        let bypass: any = n.etudiant_id
        if (bypass) {
          let t = {}
          t['ID Etudiant'] = bypass.custom_id;
          t['Prénom'] = bypass?.user_id?.firstname;
          t['Nom'] = bypass?.user_id?.lastname;
          t['Note'] = parseFloat(n.note_val);
          t['Appréciation'] = n.appreciation
          t['Date de Notation'] = new Date(n.date_creation).toLocaleString('fr-FR')
          t['Absence Justifié'] = (n.isAbsent) ? "Oui" : "Non";
          tableauNotes.push(t)
        }
      })

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableauNotes);
      //const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet();
      const workbook: XLSX.WorkBook = { Sheets: { 'notes': worksheet }, SheetNames: ['notes'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      FileSaver.saveAs(data, "examen" + '_export_' + examen.libelle + "_" + new Date().toLocaleDateString("fr-FR") + ".xlsx");

    })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  onShowAppreciation() {
    //appreciation/:semestre/:classe_id/:formateur_id
    let fid: any = this.examSelected.formateur_id
    this.router.navigate(['appreciation', this.examSelected.semestre, this.formAppreciation.value.classe_id, fid._id])
  }
  dropdownClasseExamen = []
  updateDropdown(exam) {
    this.dropdownClasseExamen = []
    if (Array.isArray(exam.classe_id))
      exam.classe_id.forEach(ex => {
        this.dropdownClasseExamen.push({ label: ex.abbrv, value: ex._id })
      })
    else
      this.dropdownClasseExamen.push({ label: exam.classe_id.abbrv, value: exam.classe_id._id })

  }
  deleteExamen(exam) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette examen?\nToutes les notes rattachés seront supprimés également"))
      this.examenService.delete(exam._id).subscribe(exam => {
        this.messageService.add({ severity: 'success', summary: "L'examen a été supprimé avec succès" })
        this.examens.splice(this.examens.indexOf(exam), 1)
      }, err => {
        this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
        console.error(err)
      })
  }
  validationNotes() {
    this.tableauNotes.forEach(rowData => {
      if (rowData.note <= this.examSelected.note_max) {
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
          }, err => {
            this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
            console.error(err)
          })
        } else {
          //C'est une mise à jour de Note
          this.NotesService.updateV2(note).subscribe(r => {
          }, err => {
            this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
            console.error(err)
          })
        }
      }
    })
    this.examSelected.canEdit = false
    this.examenService.update(this.examSelected).subscribe(r => {
      this.messageService.add({ severity: 'success', summary: "Les notes ont été mis à jour avec succès" })
    }, err => {
      this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
      console.error(err)
    })
  }
  allowEdit(examen: Examen) {
    examen.canEdit = true
    this.examenService.update(examen).subscribe(r => {
      this.messageService.add({ severity: 'success', summary: "Le formateur pourra modifié les notes." })
    }, err => {
      this.messageService.add({ severity: "error", summary: "Une erreur est survenue", detail: err?.message })
      console.error(err)
    })

  }
  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.files[0];
  }

  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var temp_list: any = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      temp_list.forEach(val => {
        this.tableauNotes.forEach((value, index) => {
          if (val._id == value._id) {
            this.tableauNotes[index].note = val.note
            this.tableauNotes[index].isAbsent = val.isAbsent
            this.tableauNotes[index].appreciation = val.Appreciation
          }
        })
      })
      this.messageService.add({ severity: "success", summary: "Importation avec succès", detail: "N'oubliez pas d'enregister les notes avec le bouton 'Enregistrer les notes et voir les appréciations du Module'" })

    }
    fileReader.readAsArrayBuffer(this.file);
  }

  isArr(arr) {
    return Array.isArray(arr)
  }
  deleteNote(note: Note) {
    this.NotesService.delete(note._id).subscribe(data => {
      this.notes.splice(this.notes.indexOf(note), 1)
    })
  }
  editSemestre: Examen = null

  correctionSemestre(examen: Examen) {
    this.editSemestre = examen
  }

  onCorrection() {
    this.examenService.correctionSemestre(this.editSemestre._id, this.editSemestre.semestre).subscribe(data => {
      this.editSemestre = null
      this.messageService.add({ severity: "success", summary: "Semestre modifié pour l'examen et les notes", detail: "Rechargez la page pour voir les modifications" })
    })
  }
}
