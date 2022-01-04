import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Matiere } from '../models/Matiere';
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

  constructor(private messageService: MessageService, private matiereService: MatiereService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //Initialisation du formulaire d'ajout de matieres
    this.onInitFormAddMatiere();

    //Initialisation du formulaire de mdification d'une matière
    this.onInitFormModifMatiere();

    //recuperation de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => { this.matieres = response; }),
      ((error) => { console.log(error) })
    );

  }

  //methode d'initialisation du formulaire d'ajout de matière
  onInitFormAddMatiere() {
    this.formAddMatiere = this.formBuilder.group({
      nom: ['', Validators.required]
    })
  }

  //methode d'ajout d'une matiere
  onAddMatiere() {

    let nom = this.formAddMatiere.get('nom').value;
    let matiere = new Matiere(null, nom);

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
    this.showFormAddMatiere = false;
  }


  //Methode de recuperation de la matière à modifier
  onGetbyId() {
    this.matiereService.getById(this.idMatiereToUpdate).subscribe(
      ((response) => {
        this.matiereToUpdate = response;
        this.formModifMatiere.patchValue({ nom: this.matiereToUpdate.nom });
      }),
      ((error) => { console.log(error) })
    );
  }

  //Methode d'initialisation du formulaire de modification d'une matière
  onInitFormModifMatiere() {
    this.formModifMatiere = this.formBuilder.group({
      nom: ['', Validators.required],
    });
  }


  //Methode de modification d'une matière
  onModifMatiere() {
    //Création de la matière à modifier
    this.matiereToUpdate = new Matiere(this.idMatiereToUpdate, this.formModifMatiere.get('nom').value);

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
