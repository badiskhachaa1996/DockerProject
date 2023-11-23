import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Matiere } from 'src/app/models/Matiere';
import { ClasseService } from 'src/app/services/classe.service';
import jwt_decode from "jwt-decode";
import { MatiereService } from 'src/app/services/matiere.service';
import { DiplomeService } from 'src/app/services/diplome.service';


@Component({
  selector: 'app-matieres',
  templateUrl: './matieres.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./matieres.component.scss']
})
export class MatieresComponent implements OnInit {

  matieres: Matiere[] = [];
  matiereToUpdate: Matiere;
  formAddMatiere: UntypedFormGroup;
  showFormAddMatiere = false;

  formModifMatiere: UntypedFormGroup;
  showFormModifMatiere = false;

  idMatiereToUpdate: string;

  filterFormation = [{ label: "Toutes les formations", value: null }];
  formationList: any = [];
  formationDic: any = {};

  classeList: any = [];
  classeDic: any = {};
  semestreList = [{ label: "Semestre 1", value: "Semestre 1" }, { label: "Semestre 2", value: "Semestre 2" }]

  classeIDTOdiplomeID: any = {};

  matiereVolume: any = {};
  token;
  constructor(private messageService: MessageService, private matiereService: MatiereService, private formBuilder: UntypedFormBuilder, private diplomeService: DiplomeService, private router: Router
    , private ClasseService: ClasseService) { }

  ngOnInit(): void {

    //Initialisation du formulaire de modification d'une matière
    this.onInitFormModifMatiere();


    //recuperation de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => { this.matieres = response; }),
      ((error) => { console.error(error) })
    );

    this.diplomeService.getAll().subscribe(data => {
      this.formationList = data

      data.forEach(formation => {
        this.filterFormation.push({ label: formation.titre, value: formation._id })
        this.formationDic[formation._id] = formation;
      })
      //Initialisation du formulaire d'ajout de matieres
      this.onInitFormAddMatiere();
    })

    this.ClasseService.getAll().subscribe(data => {
      this.classeList = data
      data.forEach(formation => {
        this.classeDic[formation._id] = formation;
      })
      //Initialisation du formulaire d'ajout de matieres
      this.onInitFormAddMatiere();
    })
    this.matiereService.getVolume().subscribe(data => {
      this.matiereVolume = data
    })
  }

  //methode d'initialisation du formulaire d'ajout de matière
  onInitFormAddMatiere() {
    this.formAddMatiere = this.formBuilder.group({
      nom: ['', [Validators.required]],
      volume: ['', [Validators.required]],
      abbrv: ['', Validators.required],
      formation_id: [[], Validators.required],
      seance_max: [1],
      coeff: ['', [Validators.required]],
      credit_ects: ['', Validators.required],
      remarque: [''],
      semestre: ['', Validators.required],
      niveau: ['', Validators.required],
      hors_bulletin: [false]
    })
  }

  resetAddMatiere() {
    this.onInitFormAddMatiere()
  }

  //methode d'ajout d'une matiere
  onAddMatiere() {

    let nom = this.formAddMatiere.get('nom').value;
    let volume = this.formAddMatiere.get("volume").value;
    let abbrv = this.formAddMatiere.get("abbrv").value;
    let formation_id = this.formAddMatiere.get("formation_id").value;
    let seance_max = this.formAddMatiere.get("seance_max").value;
    let coeff = this.formAddMatiere.get("coeff").value;
    let credit_ects = this.formAddMatiere.get("credit_ects").value;
    let remarque = this.formAddMatiere.get("remarque").value;
    let semestre = this.formAddMatiere.get("semestre").value;
    let niveau = this.formAddMatiere.get("niveau").value;

    //Création de la matière
    let matiere = new Matiere(
      null,
      nom,
      formation_id,
      volume,
      abbrv,
      //classe_id,
      seance_max,
      coeff,
      credit_ects,
      remarque,
      semestre,
      niveau,
      this.formAddMatiere.value.hors_bulletin
    );
    //Envoi vers la BD
    this.matiereService.create(matiere).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Ajout du module', detail: 'Ce module a bien été ajoutée' });
        //recuperation de la liste des Matières
        this.matiereService.getAll().subscribe(
          ((responseM) => { this.matieres = responseM; }),
          ((error) => { console.error(error) })
        );
      }),
      ((error) => { console.error(error) })
    );



    this.onInitFormAddMatiere();
    this.showFormAddMatiere = false;
    this.resetAddMatiere()
  }


  //Methode de recuperation de la matière à modifier
  onGetbyId(rowData: Matiere) {
    this.formModifMatiere.patchValue({
      nom: rowData.nom, volume: rowData.volume_init, abbrv: rowData.abbrv, seance_max: rowData.seance_max, coeff: rowData.coeff, credit_ects: rowData.credit_ects,
      remarque: rowData.remarque, semestre: rowData.semestre, niveau: rowData.niveau
    });
    this.formModifMatiere.patchValue({ formation_id: rowData.formation_id });
    /*this.ClasseService.get(rowData.classe_id).subscribe(
      (data) => {
        this.formModifMatiere.patchValue({ classe_id: data });
      }
    )*/
  }

  //Methode d'initialisation du formulaire de modification d'une matière
  onInitFormModifMatiere() {
    this.formModifMatiere = this.formBuilder.group({
      nom: ['', [Validators.required]],
      volume: ['', Validators.required],
      abbrv: ['', Validators.required],
      formation_id: [this.formationList[0], Validators.required],
      seance_max: ['', Validators.required],
      coeff: ['', Validators.required],
      credit_ects: ['', Validators.required],
      remarque: [''],
      semestre: ['', Validators.required],
      niveau: ['', Validators.required],
    });
  }

  //partie dedié à la correction des erreurs
  get nom() { return this.formAddMatiere.get('nom'); };
  get nom_m() { return this.formModifMatiere.get('nom'); };


  //Methode de modification d'une matière
  onModifMatiere() {
    //Création de la matière à modifier
    let nom = this.formModifMatiere.get('nom').value;
    let volume = this.formModifMatiere.get("volume").value;
    let abbrv = this.formModifMatiere.get("abbrv").value;
    let formation_id = this.formModifMatiere.get("formation_id").value;
    let seance_max = this.formModifMatiere.get("seance_max").value;
    let coeff = this.formModifMatiere.get("coeff").value;
    let credit_ects = this.formModifMatiere.get("credit_ects").value;
    let remarque = this.formModifMatiere.get("remarque").value;
    let semestre = this.formModifMatiere.get("semestre").value;
    let niveau = this.formModifMatiere.get("niveau").value;
    this.matiereToUpdate = new Matiere(
      this.idMatiereToUpdate,
      nom,
      formation_id,
      volume,
      abbrv,
      //classe_id,
      seance_max,
      coeff,
      credit_ects,
      remarque,
      semestre,
      niveau
    );


    this.matiereService.updateById(this.matiereToUpdate).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Modification du module', detail: 'Ce module a bien été modifiée' });
        //recuperation de la liste des Matières
        this.matiereService.getAll().subscribe(
          ((responseM) => { this.matieres = responseM; }),
          ((error) => { console.error(error) })
        );
      }),
      ((error) => { console.error(error) })
    );
    this.formModifMatiere.reset();
    this.showFormModifMatiere = false;
  }
  isArray(r) {
    return Array.isArray(r)
  }
  showHorsBulletin = true
  changeMatiereSeanceAdd(value) {
    //WIP
    if (value) {
      //hors bulletin
      //this.formAddMatiere.controls.gngn.setValidators([])
    } else {

    }

  }

  test(event) {
    console.log(event)
  }
}
