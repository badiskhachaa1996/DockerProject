import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  formAddMatiere: FormGroup;
  showFormAddMatiere = false;

  formModifMatiere: FormGroup;
  showFormModifMatiere = false;

  idMatiereToUpdate: string;

  formationList: any = [];
  formationDic: any = {};

  classeList: any = [];
  classeDic: any = {};

  classeIDTOdiplomeID: any = {};

  matiereVolume: any = {};
  token;
  constructor(private messageService: MessageService, private matiereService: MatiereService, private formBuilder: FormBuilder, private diplomeService: DiplomeService, private router: Router
    , private ClasseService: ClasseService) { }

  ngOnInit(): void {

    //Initialisation du formulaire de mdification d'une matière
    this.onInitFormModifMatiere();

    //recuperation de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => { this.matieres = response; }),
      ((error) => { console.error(error) })
    );

    this.diplomeService.getAll().subscribe(data => {
      this.formationList = data
      data.forEach(formation => {
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
      nom: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô/ -]+$")]],
      volume: [''],
      abbrv: ['', Validators.required],
      classe_id: [this.classeList[0], Validators.required],
      seance_max: ['', Validators.required]
    })
  }

  resetAddMatiere() {
    this.formAddMatiere.reset()
    this.formAddMatiere.patchValue({ formation_id: this.formationList[0], volume: 0, classe_id: this.classeList[0], seance_max: 0 })
  }

  //methode d'ajout d'une matiere
  onAddMatiere() {

    let nom = this.formAddMatiere.get('nom').value;
    let volume = this.formAddMatiere.get("volume").value;
    let abbrv = this.formAddMatiere.get("abbrv").value;
    let classe_id = this.formAddMatiere.get("classe_id").value;
    let seance_max = this.formAddMatiere.get("seance_max").value;


    //Recuperation de la formation_id
    this.ClasseService.get(this.formAddMatiere.get("classe_id").value).subscribe(
      ((response) => {
        let formation_id = response.diplome_id;

        //Création de la matière
        let matiere = new Matiere(
          null,
          nom,
          formation_id,
          volume,
          abbrv,
          classe_id,
          seance_max,
        );
        //Envoi vers la BD
        this.matiereService.create(matiere).subscribe(
          ((response) => {
            this.messageService.add({ severity: 'success', summary: 'Ajout de matière', detail: 'Cette matière a bien été ajoutée' });
            //recuperation de la liste des Matières
            this.matiereService.getAll().subscribe(
              ((responseM) => { this.matieres = responseM; }),
              ((error) => { console.error(error) })
            );
          }),
          ((error) => { console.error(error) })
        );

      }),
      ((error) => { console.error(error); })
    );


    this.onInitFormAddMatiere();
    this.showFormAddMatiere = false;
    this.resetAddMatiere()
  }


  //Methode de recuperation de la matière à modifier
  onGetbyId(rowData: Matiere) {
    this.formModifMatiere.patchValue({ nom: rowData.nom, volume: rowData.volume_init, abbrv: rowData.abbrv, seance_max: rowData.seance_max });
    this.diplomeService.getById(rowData.formation_id).subscribe(
      (data) => {
        this.formModifMatiere.patchValue({ formation_id: data._id });
      }
    )
    this.ClasseService.get(rowData.classe_id).subscribe(
      (data) => {
        this.formModifMatiere.patchValue({ classe_id: data });
      }
    )
  }

  //Methode d'initialisation du formulaire de modification d'une matière
  onInitFormModifMatiere() {
    this.formModifMatiere = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô/ -]+$")]],
      volume: [''],
      abbrv: ['', Validators.required],
      classe_id: ['', Validators.required],
      seance_max: ['', Validators.required]
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
    let classe_id = this.formModifMatiere.get("classe_id").value;
    let seance_max = this.formModifMatiere.get("seance_max").value;

    //Recuperation de la formation_id
    this.ClasseService.get(this.formModifMatiere.get("classe_id").value).subscribe(
      ((response) => {
        let formation_id = response.diplome_id;

        this.matiereToUpdate = new Matiere(
          this.idMatiereToUpdate,
          nom,
          formation_id,
          volume,
          abbrv,
          classe_id,
          seance_max,
        );


        this.matiereService.updateById(this.matiereToUpdate).subscribe(
          ((response) => {
            this.messageService.add({ severity: 'success', summary: 'Modification de la matière', detail: 'Cette matière a bien été modifiée' });
            //recuperation de la liste des Matières
            this.matiereService.getAll().subscribe(
              ((responseM) => { this.matieres = responseM; }),
              ((error) => { console.error(error) })
            );
          }),
          ((error) => { console.error(error) })
        );


      }),
      ((error) => { console.error(error); })
    );

    this.formModifMatiere.reset();
    this.showFormModifMatiere = false;
  }

}
