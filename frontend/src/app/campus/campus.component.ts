import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from '../services/ecole.service';
import { CampusService } from '../services/campus.service';
import { AnneeScolaireService } from '../services/annee-scolaire.service';
import {Ecole} from '../models/Ecole'
import {Campus} from '../models/Campus'
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { NodeWithI18n } from '@angular/compiler';
import {CalendarModule} from 'primeng/calendar';

import {DropdownModule} from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AnneeScolaire } from '../models/AnneeScolaire';
@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {
  ecoles: Ecole[]=[]
  dropdownEcole: any[] = [{ label: "Toutes les Ecoles", value: null }];
  campuss:Campus[]=[];
  showFormAddCampus:Boolean=false;
  showFormUpdateCampus:Boolean=false;
  campusToUpdate:Campus;
   ecoleid :String;
   idanneeselected:any;
   Lblecoleselected:any;
   LblAnneselected:any;
  

  addcampusForm: FormGroup = new FormGroup({
    libelle : new FormControl('',[Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),
    ecole_id: new FormControl('',Validators.required),
    ville : new FormControl('PARIS',Validators.required),
    pays: new FormControl('',Validators.required),
    email : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]),
    adresse : new FormControl('',Validators.required),
    site: new FormControl(''),
    
    
    
    
  })

  campusFormUpdate:FormGroup = new FormGroup({  
  
    libelle : new FormControl('',[Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),
    ecole_id: new FormControl('',Validators.required),
    ville : new FormControl('PARIS',Validators.required),
    pays: new FormControl('',Validators.required),
    email : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]),
    adresse : new FormControl('',Validators.required),
    site: new FormControl(''),
  })
  columns = [
  ]

  constructor(private ecoleService:EcoleService,private messageService:MessageService,private campusService:CampusService,private route: ActivatedRoute ,private router: Router,private anneeScolaireService:AnneeScolaireService) { }

  ngOnInit(): void {

    this.ecoleid = this.route.snapshot.paramMap.get('id');
    console.log(this.ecoleid)
    
    
    

    const id = this.route.snapshot.paramMap.get('id');
    this.updateList()
    this.ecoleService.getAll().subscribe((data) => {
      data.forEach(ecole => {
      this.dropdownEcole.push({ libelle: ecole.libelle, value:ecole._id})
      this.ecoles[ecole._id]=ecole;
     
   
    }, (error) => {
      console.error(error)
    });
   
  })

  this.ecoleService.getByID(this.ecoleid).subscribe((data)=>{
   
    this.idanneeselected=data.dataEcole.annee_id;
     this.Lblecoleselected=data.dataEcole.libelle;
     console.log(data.dataEcole.annee_id)
  
  
 
  this.anneeScolaireService.getByID(this?.idanneeselected).subscribe((data2)=>{
    
     this.LblAnneselected=data2.dataAnneeScolaire.libelle;

  console.log( this.LblAnneselected)
  })
})
  

}

  updateList(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id!==null){
    this.campusService.getAllByEcole(id).subscribe((data)=>{
      this.campuss=data;
    })
  }
    else {
      this.campusService.getAll().subscribe((data)=>{
      this.campuss=data;
    
    })}
  }

 

  saveCampus(){
    

    let campus= new Campus(null,this.addcampusForm.value.libelle,this.addcampusForm.value.ecole_id.value,this.addcampusForm.value.ville,this.addcampusForm.value.pays,this.addcampusForm.value.email,this.addcampusForm.value.adresse,this.addcampusForm.value.site)
console.log(campus)
    this.campusService.createCampus(campus).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });
      this.campuss.push(data)
      this.showFormAddCampus=false;
      this.addcampusForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  editCampus(){
    let campus= new Campus(this.campusToUpdate._id,this.campusFormUpdate.value.libelle,this.campusFormUpdate.value.ecole_id.value,this.campusFormUpdate.value.ville,this.campusFormUpdate.value.pays,this.campusFormUpdate.value.email,this.campusFormUpdate.value.adresse,this.campusFormUpdate.value.site)
    console.log(campus)
        this.campusService.edit(campus).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });
        
          this.showFormUpdateCampus=false;
          this.updateList();
        }, (error) => {
          console.error(error)
        });

  }

  showModify(rowData:Campus){
    console.log(rowData)
    this.campusToUpdate=rowData;
    this.showFormAddCampus=false;
    this.showFormUpdateCampus=true;

    this.campusFormUpdate.setValue({libelle:rowData.libelle,ecole_id:rowData.ecole_id,  email:rowData.email,site:rowData.site,pays:rowData.pays,adresse:rowData.adresse,ville:rowData.ville})
  }

  navigatetoDiplome(rowData:Campus){

    this.router.navigateByUrl('/diplomes/'+rowData._id);

  }

}
