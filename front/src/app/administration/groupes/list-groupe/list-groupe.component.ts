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

  constructor(private campusService: CampusService, private diplomeService: DiplomeService, private formBuilder: FormBuilder, private classeService: ClasseService, private messageService: MessageService
    , private router: Router, private EtudiantService: EtudiantService, private authService: AuthService) { }

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
      ((error) => { console.error(error);})
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

    let classe = new Classe(this.idClasseToUpdate, diplome_id, campus_id, true, abbrv, annee);

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
        this.formUpdateClasse.patchValue({ campus_id: { libelle: this.campus[this.classeToUpdate.campus_id].libelle, value: this.classeToUpdate.campus_id }, libelle: {libelle: this.classeToUpdate.abbrv}, diplome_id: { libelle: this.diplomeToUpdate, value: this.classeToUpdate.diplome_id }, abbrv: this.classeToUpdate.abbrv });
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
    this.router.navigate(['/emploi-du-temps/classe/' + rowData._id])
  }

  sendCalendar(rowData) {
    this.EtudiantService.sendEDT(rowData._id).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Envoie des emplois du temps', detail: "Les emplois du temps ont bien été envoyé" })
    }, error => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Erreur avec les emplois du temps', detail: "Contacte un Admin" })
    })
  }

  sendNotes(rowData: Classe) {
    this.router.navigate(['/pv', rowData._id]);
  }

  onRedirect() {
    this.router.navigate(['ajout-groupe']);
  }

}
