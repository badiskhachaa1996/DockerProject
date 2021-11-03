import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaireService } from '../services/annee-Scolaire.service';
import {AnneeScolaire} from '../models/AnneeScolaire'
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-annee-Scolaire',
  templateUrl: './annee-Scolaire.component.html',
  styleUrls: ['./annee-Scolaire.component.css']
})
export class AnneeScolaireComponent implements OnInit {

  showFormAddAnneeScolaire:Boolean=false;
  showFormUpdateAnneeScolaire:AnneeScolaire = null;

  anneeScolaires:AnneeScolaire[]=[];

  anneeScolaireForm:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    etat : new FormControl('',Validators.required),
  })

  anneeScolaireFormUpdate:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    etat : new FormControl('',Validators.required),
  })

  columns = [
    
  ]

  constructor(private AnneeScolaireService:AnneeScolaireService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.updateList()
  }

  updateList(){
    this.AnneeScolaireService.getAll().subscribe((data)=>{
      this.anneeScolaires=data;
    })
  }

  saveAnneeScolaire(){
    let anneeScolaire= new AnneeScolaire(null,this.anneeScolaireForm.value.libelle,this.anneeScolaireForm.value.etat)

    this.AnneeScolaireService.create(anneeScolaire).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: 'Votre anneeScolaire a bien été ajouté' });
      this.anneeScolaires.push(data)
      this.showFormAddAnneeScolaire=false;
      this.anneeScolaireForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  showModify(rowData:AnneeScolaire){
    this.showFormUpdateAnneeScolaire=rowData;
    this.showFormAddAnneeScolaire=false
    this.anneeScolaireFormUpdate.setValue({libelle:rowData.libelle,etat:rowData.etat})
  }

  modifyAnneeScolaire(){
    let anneeScolaire = this.anneeScolaireFormUpdate.value
    anneeScolaire._id=this.showFormUpdateAnneeScolaire._id

    this.AnneeScolaireService.update(anneeScolaire).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: 'Votre anneeScolaire a bien été modifié' });
      this.updateList()
      this.showFormUpdateAnneeScolaire=null;
      this.anneeScolaireFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }

  hide(anneeScolaire :AnneeScolaire){
    this.AnneeScolaireService.hide(anneeScolaire._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: anneeScolaire.etat+' ne s\'affichera plus dans la liste' });
      this.updateList()
    }, (error) => {
      console.error(error)
    });
  }

  show(anneeScolaire :AnneeScolaire){
    this.AnneeScolaireService.show(anneeScolaire._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: anneeScolaire.libelle+' s\'affichera de nouveau dans la liste' });
      this.updateList()
    }, (error) => {
      console.error(error)
    });
  }

}
