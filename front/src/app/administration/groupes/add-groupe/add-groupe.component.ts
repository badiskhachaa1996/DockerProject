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


@Component({
  selector: 'app-add-groupe',
  templateUrl: './add-groupe.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-groupe.component.scss']
})
export class AddGroupeComponent implements OnInit {

  formAddClasse: FormGroup;
  classes: Classe[] = [];
  numberClasse = {};
  display: boolean;

  diplomes: Diplome[] = [];
  dropdownDiplome: any[] = [{ libelle: "Touts les diplômes", value: null }];

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

  token;

  constructor(private diplomeService: DiplomeService, private formBuilder: FormBuilder, private classeService: ClasseService, private messageService: MessageService
    , private router: Router, private EtudiantService: EtudiantService) { }

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
    this.diplomes = [];

    this.classeService.getAll().subscribe(
      ((response) => { this.classes = response; }),
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
          this.diplomes[diplome._id] = diplome;
        })
      }),
      ((error) => { console.error(error); })
    );

    this.onInitFormAddClasse();
  }

  onInitFormAddClasse() {
    this.formAddClasse = this.formBuilder.group({
      libelle: [this.dropdownGroupe[1], [Validators.required]],
      diplome_id: ['', Validators.required],
      //abbrv: ['', Validators.required],
      annee: [this.dropdownAnnee[0]]
    });
  }

  saveClasse() {
    //Recuperation des données du formulaire
    let libelle = this.formAddClasse.get('libelle')?.value.libelle;
    let diplome_id = this.formAddClasse.get('diplome_id')?.value.value;
    let annee = this.formAddClasse.get('annee')?.value.libelle;

    let abbrv = `${this.formAddClasse.get('diplome_id')?.value.libelle} ${annee} ${libelle}`;

    let classe = new Classe(null, diplome_id, libelle, true, abbrv, annee);

    this.classeService.create(classe).subscribe(
      ((response) => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des groupes', detail: 'Votre groupe a bien été ajouté' });
        this.classeService.getAll().subscribe(
          ((responseC) => { this.classes = responseC; }),
          ((error) => { console.error(error); })
        );
      }),
      ((error) => { this.messageService.add({ severity: 'error', summary: 'Ajout impossible' }); })
    );

    this.formAddClasse.reset();
  }

  //Partie gestion des erreurs sur le formulaire 
  get libelle() { return this.formAddClasse.get('libelle'); }

}
