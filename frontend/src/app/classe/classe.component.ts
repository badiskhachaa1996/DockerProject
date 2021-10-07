import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from '../services/classe.service';
import {Classe} from '../models/Classe'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {

  showFormAddClasse:Boolean=false;
  showFormUpdateClasse:Classe = null;

  classes:Classe[]=[];

  classeForm:FormGroup = new FormGroup({
    description : new FormControl(''),
    nom : new FormControl('',Validators.required),
    nom_court : new FormControl('',Validators.required),
  })

  classeFormUpdate:FormGroup = new FormGroup({
    description : new FormControl(''),
    nom : new FormControl('',Validators.required),
    nom_court : new FormControl('',Validators.required),
  })

  columns = [
    
  ]

  constructor(private ClasseService:ClasseService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.ClasseService.getAll().subscribe((data)=>{
      this.classes=data;
    })
  }

  saveClasse(){
    let classe= new Classe(this.classeForm.value.description,this.classeForm.value.nom,this.classeForm.value.nom_court)

    this.ClasseService.create(classe).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: 'Votre classe a bien été ajouté' });
      this.classes.push(data)
      this.showFormAddClasse=false;
      this.classeForm.reset();
    }, (error) => {
      console.log(error)
    });
  }

  modifyClasse(){
    let classe = this.showFormUpdateClasse

    this.ClasseService.update(classe).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: 'Votre classe a bien été modifié' });
      this.classes.splice(this.classes.indexOf(classe),1,data)
      this.showFormUpdateClasse=null;
      this.classeFormUpdate.reset();
    }, (error) => {
      console.log(error)
    });
  }

  hide(id){
    this.ClasseService.hide(id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: 'Votre classe a bien été modifié' });
      this.classes.splice(this.classes.indexOf(classe),1,data)
      this.showFormUpdateClasse=null;
      this.classeFormUpdate.reset();
    }, (error) => {
      console.log(error)
    });
  }

}
