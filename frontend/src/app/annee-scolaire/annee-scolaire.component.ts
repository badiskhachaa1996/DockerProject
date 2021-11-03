import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AnneScolaire } from '../models/AnneeScolaire';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import {CalendarModule} from 'primeng/calendar';
@Component({
  selector: 'app-annee-scolaire',
  templateUrl: './annee-scolaire.component.html',
  styleUrls: ['./annee-scolaire.component.css']
})
export class AnneeScolaireComponent implements OnInit {

  
  showFormAddAnneScolaire:Boolean=false;
  showFormUpdateAnneScolaire:AnneScolaire = null;

  anneScolaires:AnneScolaire[]=[];

  anneScolaireForm:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    etat : new FormControl('',Validators.required),
  })

  anneScolaireFormUpdate:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    etat : new FormControl('',Validators.required),
  })

  columns = [
    
  ]

  constructor(private AnneScolaireService:AnneeScolaireService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.updateList()
  }

  updateList(){
    this.AnneScolaireService.getAll().subscribe((data)=>{
      this.anneScolaires=data;
    })
  }

  saveAnneScolaire(){
    let anneScolaire= new AnneScolaire(this.anneScolaireForm.value.nom,this.anneScolaireForm.value.nom_court)

    this.AnneScolaireService.create(anneScolaire).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneScolaires', detail: 'Votre anneScolaire a bien été ajouté' });
      this.anneScolaires.push(data)
      this.showFormAddAnneScolaire=false;
      this.anneScolaireForm.reset();
    }, (error) => {
      console.error(error)
    });
  }


}
