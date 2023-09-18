import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwt_decode from "jwt-decode";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GenFormation } from 'src/app/models/gen_doc/GenFormation';
import { GenFormationService } from 'src/app/services/gen_doc/genformation.service';
import { Table } from 'primeng/table';
import { from } from 'rxjs';
import { GenRentre } from 'src/app/models/gen_doc/GenRentre';
import { GenRentreService } from 'src/app/services/gen_doc/genrentre.service';

@Component({
  selector: 'app-genformation',
  templateUrl: './genformation.component.html',
  styleUrls: ['./genformation.component.scss']
})
export class GenformationComponent implements OnInit {

  // partie dedié aux Formations
  formationList: GenFormation[] = [];
  loading: boolean = true;
  token: any;
  selectedFormations = []
  showAddFormation: boolean = false;
  formAddFormation: FormGroup;
  showUpdateFormation: GenFormation;

  formationSelected: GenFormation;

  showRentreTable: boolean = false;

  rentres: GenRentre[] = [];
  loadingRentres: boolean = true;

  showFormAddRentre: boolean = false;
  showFormUpdateRentre: GenRentre;

  rentreToUpdate: GenRentre;

  formAddRentre: FormGroup;


  constructor(private formBuilder: FormBuilder, private genRentreService: GenRentreService,
    private messageService: MessageService, private genFormationService: GenFormationService, private router: Router) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

        //Initialisation du formulaire de formation
        this.formAddFormation = this.formBuilder.group({
          name:  ['', Validators.required],
          rncp:  ['', Validators.required],
          niveau:  ['', Validators.required],
          accrediteur:  ['', Validators.required],
          duration:  ['', Validators.required],
          price:  ['', Validators.required],
        });

        // initialisation du formulaire de rentrée
        this.formAddRentre = this.formBuilder.group({
          type:    ['', Validators.required],
          date_rentre:    ['', Validators.required],
          date_limite:    ['', Validators.required],
        });

  }

  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation des Formations
    this.genFormationService.getFormations()
      .then((response: GenFormation[]) => {
        this.formationList = response;
        this.loading = false;
      })
      .catch((error) => { console.error(error); })

  }


    // methode de recuperation de la liste des competences pour un profile
    onGetDateRentre(): void
    {
      // recuperation des compétences
      this.genRentreService.getRentreByFormation(this.formationSelected._id)
      .then((response: GenRentre[]) => { 
        this.rentres = response;
        console.log(response);
        this.loadingRentres = false;
       })
      .catch((error) => { console.log(error) });
    }


    // methode d'ajout du cv
    onAddFormation(): void {
      // recuperation des données du formulaire
      const formValue = this.formAddFormation.value;
      //création du cv

      if (this.showUpdateFormation) {
        let formation = this.showUpdateFormation;
        formation.name = formValue.name
        formation.rncp = formValue.rncp
        formation.niveau = formValue.niveau
        formation.accrediteur = formValue.accrediteur
        formation.duration = formValue.duration
        formation.price = formValue.price
        //Mise à jour de l'formation
        this.genFormationService.updateFormation(formation).then(data => {
          this.formationList.splice(this.formationList.indexOf(this.showUpdateFormation), 1, formation)
          this.messageService.add({ severity: 'success', summary: "Mis à jour du formation avec succès" })
          this.formAddFormation.reset();
          this.showUpdateFormation = null;
        })
      } else if (this.showAddFormation) {
        let formation = new GenFormation();
        formation.name = formValue.name
        formation.rncp = formValue.rncp
        formation.niveau = formValue.niveau
        formation.accrediteur = formValue.accrediteur
        formation.duration = formValue.duration
        formation.price = formValue.price
        //ajout de l'formation
        this.genFormationService.addFormation(formation)
          .then((response: GenFormation) => {
            this.messageService.add({ severity: "success", summary: `Le formation a été ajouté avec succés` })
            this.formAddFormation.reset();
            this.showAddFormation = false;
            this.onGetAllClasses();
          })
          .catch((error) => {
            this.messageService.add({ severity: "error", summary: `Ajout impossible` });
            console.log(error);
          });
      }


      }

  InitUpdateFormation(formation) {
    this.showUpdateFormation = formation
    this.formAddFormation = this.formBuilder.group({
      name:  formation.name,
      rncp:  formation.rncp,
      niveau:  formation.niveau,
      accrediteur:  formation.accrediteur,
      duration:  formation.duration,
      price:  formation.price,
    });
  }

  deleteFormation(formation) {
    this.genFormationService.deleteFormation(formation).then(data => {
      this.messageService.add({ severity: 'success', summary: "Formation supprimé avec succès" })
      this.onGetAllClasses();
    })
  }


  RemoveElementFromArray(arrayElements, element) {
    arrayElements.forEach((value,index)=>{
        if(value==element) arrayElements.splice(index,1);
    });
}





  // methode d'ajout d'une nouvelle compétences
  onAddRentre(): void
  {
    const formValue = this.formAddRentre.value;

    if (this.showFormAddRentre) {
      const rentre = new GenRentre();
      rentre.type    = formValue.type.toLowerCase();
      rentre.date_rentre    = formValue.date_rentre;
      rentre.date_limite    = formValue.date_limite;
      rentre.formation_id = this.formationSelected._id;
      // ajout de la competence dans la base de données
      this.genRentreService.addRentre(rentre)
      .then((response: GenRentre) => {
        this.formAddRentre.reset();
        this.showFormAddRentre = false;
        this.onGetAllClasses();
        this.onGetDateRentre();
        this.messageService.add({ severity: "success", summary: "Rentrée ajouté" });
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: "error", summary: "Impossible d'ajouter la rentrée" }); })

    } else if (this.showFormUpdateRentre) {
        let rentre = this.rentreToUpdate;
        rentre.type    = formValue.type;
        rentre.date_rentre    = formValue.date_rentre;
        rentre.date_limite    = formValue.date_limite;
        rentre.formation_id = this.formationSelected._id;
        //Mise à jour de l'formation
        this.genRentreService.updateRentre(rentre).then(data => {
          this.rentres.splice(this.rentres.indexOf(this.rentreToUpdate), 1, rentre)
          this.messageService.add({ severity: 'success', summary: "Mis à jour de la rentrée avec succès" })
          this.formAddRentre.reset();
          this.showFormUpdateRentre = null;
        })
    }

  }

  InitUpdateRentre(rentre) {
    this.showFormUpdateRentre = rentre
    this.formAddRentre = this.formBuilder.group({
      type: this.showFormUpdateRentre.type,
      date_rentre: this.showFormUpdateRentre.date_rentre,
      date_limite: this.showFormUpdateRentre.date_limite,
    });
  }
}
