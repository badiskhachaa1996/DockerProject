import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwt_decode from "jwt-decode";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GenSchool } from 'src/app/models/gen_doc/GenSchool';
import { GenSchoolService } from 'src/app/services/gen_doc/genschool.service';
import { Table } from 'primeng/table';
import { from } from 'rxjs';

@Component({
  selector: 'app-genschool',
  templateUrl: './genschool.component.html',
  styleUrls: ['./genschool.component.scss']
})
export class GenschoolComponent implements OnInit {
  // partie dedié aux Ecoles
  schoolList: GenSchool[] = [];
  loading: boolean = true;
  token: any;
  selectedSchools = []
  showAddSchool: boolean = false;
  formAddSchool: FormGroup;
  showUpdateSchool: GenSchool;

  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService, private genSchoolService: GenSchoolService, private router: Router) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

        //Initialisation du formulaire d'ajout d'école
        this.formAddSchool = this.formBuilder.group({
          name:  [''],
          email:  [''],
          phone:  [''],
          website:  [''],
          uai:  [''],
          siret:  [''],
        });

  }

  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation des Ecoles
    this.genSchoolService.getSchools()
      .then((response: GenSchool[]) => {
        this.schoolList = response;
        this.loading = false;
      })
      .catch((error) => { console.error(error); })

  }


    // methode d'ajout du cv
    onAddSchool(): void {
      // recuperation des données du formulaire
      const formValue = this.formAddSchool.value;
      //création du cv

      if (this.showUpdateSchool) {
        let school = this.showUpdateSchool;
        school.name = formValue.name
        school.email = formValue.email
        school.phone = formValue.phone
        school.website = formValue.website
        school.uai = formValue.uai
        school.siret = formValue.siret
        //Mise à jour de l'école
        this.genSchoolService.updateSchool(school).then(data => {
          this.schoolList.splice(this.schoolList.indexOf(this.showUpdateSchool), 1, school)
          this.messageService.add({ severity: 'success', summary: "Mis à jour d'école avec succès" })
          this.formAddSchool.reset();
          this.showUpdateSchool = null;
        })
      } else if (this.showAddSchool) {
        let school = new GenSchool();
        school.name = formValue.name
        school.email = formValue.email
        school.phone = formValue.phone
        school.website = formValue.website
        school.uai = formValue.uai
        school.siret = formValue.siret
        //ajout de l'école
        this.genSchoolService.addSchool(school)
          .then((response: GenSchool) => {
            this.messageService.add({ severity: "success", summary: `L'école a été ajouté avec succés` })
            this.formAddSchool.reset();
            this.showAddSchool = false;
            this.onGetAllClasses();
          })
          .catch((error) => {
            this.messageService.add({ severity: "error", summary: `Ajout impossible` });
            console.error(error);
          });
      }


      }

  InitUpdateSchool(school) {
    this.showUpdateSchool = school
    this.formAddSchool = this.formBuilder.group({
      name:  school.name,
      email:  school.email,
      phone:  school.phone,
      website:  school.website,
      uai:  school.uai,
      siret:  school.siret,
    });
  }

  deleteSchool(school) {
    this.genSchoolService.deleteSchool(school).then(data => {
      this.messageService.add({ severity: 'success', summary: "Ecole supprimé avec succès" })
      this.onGetAllClasses();
    })
  }


  RemoveElementFromArray(arrayElements, element) {
    arrayElements.forEach((value,index)=>{
        if(value==element) arrayElements.splice(index,1);
    });
}
}
