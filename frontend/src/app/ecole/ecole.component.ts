import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from '../services/ecole.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import {Ecole} from '../models/Ecole'
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { NodeWithI18n } from '@angular/compiler';
import {CalendarModule} from 'primeng/calendar';
import { AnneeScolaire } from '../models/AnneeScolaire';
import {DropdownModule} from 'primeng/dropdown';
@Component({
  selector: 'app-ecole',
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.css']
})
export class EcoleComponent implements OnInit {

  annees: AnneeScolaire[]=[]
  dropdownAnnee: any[] = [{ label: "Toutes les années", value: null }];
  ecoles:Ecole[]=[];
  showFormAddEcole:Boolean=false;
  showFormUpdateEcole:Ecole = null;
  
  
  

  addecoleForm: FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    email : new FormControl('',Validators.required),
    site: new FormControl('',Validators.required),
    annee_id: new FormControl('',Validators.required),
    telephone: new FormControl('',Validators.required),
    adresse : new FormControl('',Validators.required),
    ville : new FormControl('PARIS',Validators.required),
    pays: new FormControl('',Validators.required),
    
  })

  ecoleFormUpdate:FormGroup = new FormGroup({
    libelle : new FormControl('',Validators.required),
    ville : new FormControl('',Validators.required),
    pays : new FormControl('',Validators.required),
    adresse : new FormControl('',Validators.required),
    email : new FormControl('',Validators.required),
    site : new FormControl('',Validators.required),
    telephone : new FormControl('',Validators.required),
  })

  columns = [
  ]

  constructor(private EcoleService:EcoleService,private messageService:MessageService,private anneeScolaireService:AnneeScolaireService, ) { }

  ngOnInit(): void {
    this.updateList()

    this.anneeScolaireService.getAll().subscribe((data) => {
      data.forEach(anne => {
      this.dropdownAnnee.push({ libelle: anne.libelle, value:anne._id})
      this.annees[anne._id]=anne;
   
    }, (error) => {
      console.error(error)
    });
    console.log(this.annees)
  })}

  updateList(){
    this.EcoleService.getAll().subscribe((data)=>{
      this.ecoles=data;
    })
  }

 

  saveEcole(){
    

    let ecole= new Ecole(null,this.addecoleForm.value.libelle,this.addecoleForm.value.annee_id.value,this.addecoleForm.value.ville,this.addecoleForm.value.pays,this.addecoleForm.value.adresse,this.addecoleForm.value.email,this.addecoleForm.value.site,this.addecoleForm.value.telephone)
console.log(ecole)
    this.EcoleService.create(ecole).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des écoles', detail: 'Votre ecole a bien été ajouté' });
      this.ecoles.push(data)
      this.showFormAddEcole=false;
      this.addecoleForm.reset();
    }, (error) => {
      console.error(error)
    });
  }
/*
  showModify(rowData:Ecole){
    this.showFormUpdateEcole=rowData;
    this.showFormAddEcole=false
    this.ecoleFormUpdate.setValue({libelle:rowData.libelle,etat:rowData.etat})
  }
*/
}
