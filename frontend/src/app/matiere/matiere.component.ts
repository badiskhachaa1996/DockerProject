import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Matiere } from '../models/Matiere';
import { DiplomeService } from '../services/diplome.service';
import { MatiereService } from '../services/matiere.service';

@Component({
  selector: 'app-matiere',
  templateUrl: './matiere.component.html',
  styleUrls: ['./matiere.component.css']
})
export class MatiereComponent implements OnInit {

  matieres: Matiere[] = [];
  matiereToUpdate: Matiere;
  formAddMatiere: FormGroup;
  showFormAddMatiere = false;

  formModifMatiere: FormGroup;
  showFormModifMatiere = false;

  idMatiereToUpdate: string;

  formationList: any = [];
  formationDic:any = {};

  constructor(private messageService: MessageService, private matiereService: MatiereService, private formBuilder: FormBuilder, private diplomeService: DiplomeService) { }

  ngOnInit(): void {



    //Initialisation du formulaire de mdification d'une matière
    this.onInitFormModifMatiere();

    //recuperation de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => { this.matieres = response; }),
      ((error) => { console.log(error) })
    );

    this.diplomeService.getAll().subscribe(data => {
      this.formationList = data
      data.forEach(formation=>{
        this.formationDic[formation._id]=formation;
      })

      //Initialisation du formulaire d'ajout de matieres
      this.onInitFormAddMatiere();

    })

  }

  //methode d'initialisation du formulaire d'ajout de matière
  onInitFormAddMatiere() {
    this.formAddMatiere = this.formBuilder.group({
      nom: ['', Validators.required],
      formation_id: [this.formationList[0], Validators.required]
    })
  }

  //methode d'ajout d'une matiere
  onAddMatiere() {

    let nom = this.formAddMatiere.get('nom').value;
    let formation_id = this.formAddMatiere.get('formation_id').value;
    let matiere = new Matiere(null, nom, formation_id);

    //Envoi vers la BD
    this.matiereService.create(matiere).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Ajout de matière', detail: 'Cette matière a bien été ajoutée' });
        //recuperation de la liste des Matières
        this.matiereService.getAll().subscribe(
          ((response) => { this.matieres = response; }),
          ((error) => { console.log(error) })
        );
      }),
      ((error) => { console.log(error) })
    );

    this.formAddMatiere.reset();
    this.onInitFormAddMatiere();
    this.showFormAddMatiere = false;
  }


  //Methode de recuperation de la matière à modifier
  onGetbyId(rowData) {
    this.formModifMatiere.patchValue({ nom: rowData.nom});
    this.diplomeService.getById(rowData.formation_id).subscribe(
      (data) => {
        console.log(data)
        this.formModifMatiere.patchValue({ formation_id: data});
      }
    )
  }

  //Methode d'initialisation du formulaire de modification d'une matière
  onInitFormModifMatiere() {
    this.formModifMatiere = this.formBuilder.group({
      nom: ['', Validators.required],
      formation_id: ["", Validators.required]
    });
  }


  //Methode de modification d'une matière
  onModifMatiere() {
    //Création de la matière à modifier
    this.matiereToUpdate = new Matiere(this.idMatiereToUpdate, this.formModifMatiere.get('nom').value, this.formModifMatiere.get('formation_id').value);

    this.matiereService.updateById(this.matiereToUpdate).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Modification de la matière', detail: 'Cette matière a bien été modifiée' });
        //recuperation de la liste des Matières
        this.matiereService.getAll().subscribe(
          ((response) => { this.matieres = response; }),
          ((error) => { console.log(error) })
        );
      }),
      ((error) => { console.log(error) })
    );

    this.formModifMatiere.reset();
    this.showFormModifMatiere = false;
  }

}
