import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Classe } from 'src/app/models/Classe';
import { Diplome } from 'src/app/models/Diplome';
import { ClasseService } from 'src/app/services/classe.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { Campus } from 'src/app/models/Campus';
import { ExamenService } from 'src/app/services/examen.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-groupe',
  templateUrl: './list-groupe.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-groupe.component.scss']
})
export class ListGroupeComponent implements OnInit {

  formUpdateClasse: FormGroup;
  showFormUpdateClasse: boolean = false;

  classes: Classe[] = [];
  classeToUpdate: Classe;
  idClasseToUpdate: string;
  numberClasse = {};

  diplomes: Diplome[] = [];
  dropdownDiplome: any[] = [{ libelle: "Touts les diplômes", value: null }];
  diplomeToUpdate: string;
  diplomeFilter = []
  token;
  user: User;

  dropdownAnnee: any = [
    { libelle: 1 },
    { libelle: 2 },
    { libelle: 3 },
  ];

  dropdownGroupe: any = [
    { libelle: ' ' },
    { libelle: 'A' },
    { libelle: 'B' },
    { libelle: 'C' },
    { libelle: 'D' },
    { libelle: 'E' },
  ];

  dropdownCampus: any = [];

  campus: Campus[] = [];

  showFormAddCalendar: boolean = false;
  idGroupeToUpdate: string;
  calendarFile: any;

  constructor(private campusService: CampusService, private diplomeService: DiplomeService, private formBuilder: FormBuilder, private classeService: ClasseService, private messageService: MessageService
    , private router: Router, private EtudiantService: EtudiantService, private authService: AuthService, private ExamenService: ExamenService) { }

  customIncludes(l: any, d: { label: string, value: string }) {
    let r = false
    l.forEach(e => {
      if (e.label == d.label && e.value == d.value) {
        r = true
      }
    })
    return r
  }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else if (this.token["role"].includes("user")) {
      this.router.navigate(["/ticket/suivi"])
    }
    this.authService.getPopulate(this.token.id).subscribe(u => {
      this.user = u
    })

    this.campusService.getAll().subscribe(
      ((response) => {
        response.forEach((c) => {
          this.dropdownCampus.push({ libelle: c.libelle, value: c._id });
          this.campus[c._id] = c;
        });
      }),
      ((error) => { console.error(error); })
    );

    this.classeService.getAllPopulate().subscribe(
      ((response) => {
        this.classes = response;
        this.diplomeFilter = [{ label: "Tous les diplomes", value: null }]
        response.forEach(c => {
          let bypass: any = c.diplome_id
          let v = { value: bypass._id, label: bypass.titre }
          if (this.customIncludes(this.diplomeFilter, v) == false)
            this.diplomeFilter.push(v)
        })
      }),
      ((error) => { console.error(error); })
    );

    this.EtudiantService.getAll().subscribe(
      ((etudiants) => {
        etudiants.forEach(data => {
          if (this.numberClasse[data.classe_id]) {
            this.numberClasse[data.classe_id] += 1
          } else {
            this.numberClasse[data.classe_id] = 1
          }
        })
      })
    );

    this.diplomeService.getAll().subscribe(
      ((responseD) => {
        responseD.forEach(diplome => {
          this.dropdownDiplome.push({ libelle: diplome.titre, value: diplome._id });
        })
      }),
      ((error) => { console.error(error); })
    );

    this.onInitFormUpdateClasse();

  }

  onInitFormUpdateClasse() {
    this.formUpdateClasse = this.formBuilder.group({
      libelle: [''],
      diplome_id: [''],
      // abbrv: ['', Validators.required],
      campus_id: [''],
      annee: [this.dropdownAnnee[0]]
    });
  }

  modifyClasse() {
    //Recuperation des données du formulaire
    let libelle = this.formUpdateClasse.get('libelle')?.value.libelle;
    let diplome_id = this.formUpdateClasse.get('diplome_id')?.value.value;
    let annee = this.formUpdateClasse.get('annee')?.value.libelle;
    let campus_id = this.formUpdateClasse.get('campus_id')?.value.value;
    let abbrv = `${this.formUpdateClasse.get('diplome_id')?.value.libelle} ${annee} ${libelle} - ${this.formUpdateClasse.get('campus_id')?.value.libelle}`;

    let classe = new Classe(this.idClasseToUpdate, diplome_id, campus_id, true, abbrv, annee, this.classeToUpdate.calendrier);

    this.classeService.update(classe).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Votre classe a bien été modifié' });
        this.classes.forEach((v, i) => {
          if (classe._id == response._id)
            this.classes[i] = response
        })

        this.classeService.getAllPopulate().subscribe(
          ((response) => {
            this.classes = response;
          }),
          ((error) => { console.error(error); })
        );

        this.showFormUpdateClasse = false;
        this.formUpdateClasse.reset();
      }),
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Modification impossible' });
      });
  }


  onGetById() {
    this.classeService.get(this.idClasseToUpdate).subscribe(
      ((response) => {
        this.classeToUpdate = response;
        this.formUpdateClasse.patchValue({ campus_id: { libelle: this.campus[this.classeToUpdate.campus_id].libelle, value: this.classeToUpdate.campus_id }, libelle: { libelle: this.classeToUpdate.abbrv }, diplome_id: { libelle: this.diplomeToUpdate, value: this.classeToUpdate.diplome_id }, abbrv: this.classeToUpdate.abbrv });
      }),
      ((error) => { console.error(error); })
    );
  }

  get libelle_m() { return this.formUpdateClasse.get('libelle'); }
  get abbrv() { return this.formUpdateClasse.get('abbrv'); }


  /*hide(classe: Classe) {
    this.classeService.hide(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom + ' ne s\'affichera plus dans la liste' });

      this.classeService.getAll().subscribe(
        ((response) => { this.classes = response; }),
        ((error) => { console.error(error); })
      );

    }, (error) => {
      console.error(error)
    });
  }

  show(classe: Classe) {
    this.classeService.show(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom + ' s\'affichera de nouveau dans la liste' });

      this.classeService.getAll().subscribe(
        ((response) => { this.classes = response; }),
        ((error) => { console.error(error); })
      );

    }, (error) => {
      console.error(error)
    });
  }*/

  onGetColor(color: boolean) {
    if (!color) {
      return 'gray';
    }
  }

  showCalendar(rowData) {
    this.router.navigate(['/pedagogie/emploi-du-temps/classe/' + rowData._id])
  }

  sendCalendar(def: string, objet: string) {
    this.EtudiantService.sendEDT(this.groupeEdt._id, def, objet).subscribe(data => {
      this.objetMail = ""
      this.mailtype = ""
      this.messageService.add({ severity: 'success', summary: 'Envoie des emplois du temps', detail: "Les emplois du temps ont bien été envoyé" })
    }, error => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Erreur avec les emplois du temps', detail: "Contacte un Admin" })
    })
  }

  onRedirect() {
    this.router.navigate(['ajout-groupe']);
  }

  loadDefautEDT() {
    this.mailtype = "Bonjour,\nVous trouverez dans le lien ci-dessous votre emploi du temps.\n<lien edt>\nCordialement,\n<signature espic>"
    this.objetMail = "Emploi du temps"
  }
  display = false
  displayResponsive = false
  groupeEdt: Classe = null
  mailtype = ""
  objetMail = ""
  placeholderType = "Bonjour," + "\n" + "Voici un mail type" + "\n" + "Pour ajouter le lien de l'emploi du temps, merci d'écrire:" + "\n" + "<lien edt>" + "\n" + "pour mettre une signature d'une école merci d'écrire:" + "\n" +
    "<signature estya>" + "\n" + "<signature espic>" + "\n" + "<signature adg>" + "\n" + "<signature eduhorizons>" + "\n"
    + "La signature par défaut sera celle d'espic\nCordialement,\nl'équipe IMS"
  semestreList = [{ label: "Annuel", value: "Annuel" }, { label: "Semestre 1", value: "Semestre 1" }, { label: "Semestre 2", value: "Semestre 2" }]
  showPV: Classe = null
  formPV: FormGroup = this.formBuilder.group({
    semestre: ['', Validators.required]
  });
  initPV(rowData) {
    this.ExamenService.getAllByClasseId(rowData._id).subscribe(examens => {
      this.showPV = rowData
    })
  }

  generatePV() {
    if (this.formPV.value.semestre != "Annuel")
      this.router.navigate(['pedagogie/pv-semestriel', this.formPV.value.semestre, this.showPV._id])
    else
      this.router.navigate(['pedagogie/pv-annuel', this.showPV._id])
  }

  generatePVApp() {
    this.router.navigate(['pedagogie/pv-appreciation', this.formPV.value.semestre, this.showPV._id])
  }

  showLien: Classe = null

  onInitLien(classe: Classe) {
    this.showLien = classe
    this.formLiens.setValue({
      lien_programme: this.showLien?.lien_programme,
      lien_calendrier: this.showLien?.lien_calendrier
    })
  }

  formLiens: FormGroup = this.formBuilder.group({
    lien_programme: [''],
    lien_calendrier: [''],
  });

  onUpdateLiens() {
    let index = this.classes.indexOf(this.showLien)
    this.showLien.lien_programme = this.formLiens.value.lien_programme
    this.showLien.lien_calendrier = this.formLiens.value.lien_calendrier
    this.classeService.update(this.showLien).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Lien du groupe modifié' });
      this.classes[index].lien_programme = this.showLien.lien_programme
      this.classes[index].lien_calendrier = this.showLien.lien_calendrier
      this.showLien = null
      this.formLiens.reset()
    })
  }

  // upload du calendrier
  onSelectFile(event: any): void {
    if (event.target.files.length > 0) {
      this.calendarFile = event.target.files[0];
    }
  }

  onAddCalendar(): void {
    let formData = new FormData();
    formData.append('id', this.idGroupeToUpdate);
    formData.append('file', this.calendarFile);
    // envoi du calendrier de la formation
    this.classeService.uploadCalendar(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Calendrier', detail: response.successMsg });
        this.showFormAddCalendar = false;
        // recuperation de la liste des classes
        this.classeService.getAllPopulate().subscribe({
          next: (response) => { this.classes = response; },
          error: (error) => { console.error(error); },
          complete: () => { console.log('Liste des classes récupérer'); }
        });
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Calendrier', detail: error.error }); })
  }

  // méthode de téléchargement du calendrier
  onDownloadCalendrier(id: string): void {
    this.classeService.downloadCalendar(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `calendrier.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Calendrier", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Calendrier", detail: `Impossible de télécharger le fichier` }); });
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
  onUpdateGrp(grp: Classe) {
    if (grp.abbrv.includes('1'))
      this.formUpdateClasse.patchValue({ annee: this.dropdownAnnee[0] })
    if (grp.abbrv.includes('2'))
      this.formUpdateClasse.patchValue({ annee: this.dropdownAnnee[1] })
    if (grp.abbrv.includes('3'))
      this.formUpdateClasse.patchValue({ annee: this.dropdownAnnee[2] })
  }
}
