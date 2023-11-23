import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwt_decode from "jwt-decode";
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GenCampus } from 'src/app/models/gen_doc/GenCampus';
import { GenCampusService } from 'src/app/services/gen_doc/gencampus.service';
import { Table } from 'primeng/table';
import { from } from 'rxjs';

@Component({
  selector: 'app-gencampus',
  templateUrl: './gencampus.component.html',
  styleUrls: ['./gencampus.component.scss']
})
export class GencampusComponent implements OnInit {

  // partie dedié aux Campuss
  campusList: GenCampus[] = [];
  loading: boolean = true;
  token: any;
  selectedCampuss = []
  showAddCampus: boolean = false;
  formAddCampus: UntypedFormGroup;
  showUpdateCampus: GenCampus;

  constructor(private formBuilder: UntypedFormBuilder,
    private messageService: MessageService, private genCampusService: GenCampusService, private router: Router) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

        //Initialisation du formulaire d'ajout d'campus
        this.formAddCampus = this.formBuilder.group({
          name:  [''],
          adress:  [''],
        });

  }

  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation des Campuss
    this.genCampusService.getCampuss()
      .then((response: GenCampus[]) => {
        this.campusList = response;
        this.loading = false;
      })
      .catch((error) => { console.error(error); })

  }


    // methode d'ajout du cv
    onAddCampus(): void {
      // recuperation des données du formulaire
      const formValue = this.formAddCampus.value;
      //création du cv

      if (this.showUpdateCampus) {
        let campus = this.showUpdateCampus;
        campus.name = formValue.name
        campus.adress = formValue.adress
        //Mise à jour de l'campus
        this.genCampusService.updateCampus(campus).then(data => {
          this.campusList.splice(this.campusList.indexOf(this.showUpdateCampus), 1, campus)
          this.messageService.add({ severity: 'success', summary: "Mis à jour du campus avec succès" })
          this.formAddCampus.reset();
          this.showUpdateCampus = null;
        })
      } else if (this.showAddCampus) {
        let campus = new GenCampus();
        campus.name = formValue.name
        campus.adress = formValue.adress
        //ajout de l'campus
        this.genCampusService.addCampus(campus)
          .then((response: GenCampus) => {
            this.messageService.add({ severity: "success", summary: `Le campus a été ajouté avec succés` })
            this.formAddCampus.reset();
            this.showAddCampus = false;
            this.onGetAllClasses();
          })
          .catch((error) => {
            this.messageService.add({ severity: "error", summary: `Ajout impossible` });
            console.error(error);
          });
      }


      }

  InitUpdateCampus(campus) {
    this.showUpdateCampus = campus
    this.formAddCampus = this.formBuilder.group({
      name:  campus.name,
      adress:  campus.adress,
    });
  }

  deleteCampus(campus) {
    this.genCampusService.deleteCampus(campus).then(data => {
      this.messageService.add({ severity: 'success', summary: "Campus supprimé avec succès" })
      this.onGetAllClasses();
    })
  }


  RemoveElementFromArray(arrayElements, element) {
    arrayElements.forEach((value,index)=>{
        if(value==element) arrayElements.splice(index,1);
    });
}
}
