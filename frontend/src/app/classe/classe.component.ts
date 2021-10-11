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
    nom : new FormControl('',Validators.required),
    nom_court : new FormControl('',Validators.required),
  })

  classeFormUpdate:FormGroup = new FormGroup({
    nom : new FormControl('',Validators.required),
    nom_court : new FormControl('',Validators.required),
  })

  columns = [
    
  ]

  constructor(private ClasseService:ClasseService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.updateList()
  }

  updateList(){
    this.ClasseService.getAll().subscribe((data)=>{
      this.classes=data;
    })
  }

  saveClasse(){
    let classe= new Classe(this.classeForm.value.nom,this.classeForm.value.nom_court)

    this.ClasseService.create(classe).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: 'Votre classe a bien été ajouté' });
      this.classes.push(data)
      this.showFormAddClasse=false;
      this.classeForm.reset();
    }, (error) => {
      console.log(error)
    });
  }

  showModify(rowData:Classe){
    this.showFormUpdateClasse=rowData;
    this.showFormAddClasse=false
    this.classeFormUpdate.setValue({nom:rowData.nom,nom_court:rowData.nom_court})
  }

  modifyClasse(){
    let classe = this.classeFormUpdate.value
    classe._id=this.showFormUpdateClasse._id

    this.ClasseService.update(classe).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: 'Votre classe a bien été modifié' });
      this.updateList()
      this.showFormUpdateClasse=null;
      this.classeFormUpdate.reset();
    }, (error) => {
      console.log(error)
    });
  }

  hide(classe :Classe){
    this.ClasseService.hide(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom_court+' ne s\'affichera plus dans la liste' });
      this.updateList()
    }, (error) => {
      console.log(error)
    });
  }

  show(classe :Classe){
    this.ClasseService.show(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom_court+' s\'affichera de nouveau dans la liste' });
      this.updateList()
    }, (error) => {
      console.log(error)
    });
  }

}
