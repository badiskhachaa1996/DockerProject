import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import {AnneeScolaire} from '../models/AnneeScolaire'
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { NodeWithI18n } from '@angular/compiler';
import {CalendarModule} from 'primeng/calendar';
@Component({
  selector: 'app-annee-scolaire',
  templateUrl: './annee-scolaire.component.html',
  styleUrls: ['./annee-scolaire.component.css']
})
export class AnneeScolaireComponent implements OnInit {

  etat_annee: any[]= environment.etat_annee

   

  showFormAddAnneeScolaire:Boolean=false;
  showFormUpdateAnneeScolaire:AnneeScolaire = null;
  rangedate:any;
  rangedateS : string="" ;
  anneeScolaires:AnneeScolaire[]=[];

  anneeScolaireForm:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    etat : new FormControl('',Validators.required),
  })

  anneeScolaireFormUpdate:FormGroup = new FormGroup({
    etat : new FormControl('Archivée',Validators.required),
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
    
   
    var str = String(this.anneeScolaireForm.value.libelle)
    var splited=str.split(',').join('/');
    console.log(splited)
    let anneeScolaire= new AnneeScolaire(null,splited,String(this.anneeScolaireForm.value.etat.value))

    this.AnneeScolaireService.create(anneeScolaire).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: 'Votre année scolaire a bien été ajouté' });
      this.anneeScolaires.push(data)
      this.showFormAddAnneeScolaire=false;
      this.anneeScolaireForm.reset();
    }, (error) => {
      console.error(error)
    });
  }
/*
  showModify(rowData:AnneeScolaire){
    this.showFormUpdateAnneeScolaire=rowData;
    this.showFormAddAnneeScolaire=false
    this.anneeScolaireFormUpdate.setValue({libelle:rowData.libelle,etat:rowData.etat})
  }
*/
  modifyAnneeScolaire(rowData:AnneeScolaire){
    
    this.showFormUpdateAnneeScolaire=rowData;
    this.showFormAddAnneeScolaire=false
    let anneeScolaire = this.showFormUpdateAnneeScolaire
    anneeScolaire._id=this.showFormUpdateAnneeScolaire._id
console.log(anneeScolaire._id)
    this.AnneeScolaireService.archivee(anneeScolaire._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: 'Votre année scolaire a bien été archivé' });
      this.updateList()
      this.showFormUpdateAnneeScolaire=null;
      this.anneeScolaireFormUpdate.reset();
    }, (error) => {
      console.log(error)
    });
  
  }

  rangedatechange($event){
    console.log('label'+this.rangedate )
    var str = String(this.anneeScolaireForm.value.libelle)
    var splited=str.split(',').join('/');
    console.log(splited)
  }

}
